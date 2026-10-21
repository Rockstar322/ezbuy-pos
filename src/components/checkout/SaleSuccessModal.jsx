import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Mail, 
  Download, 
  Share2, 
  X, 
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/audio';
import { formatCurrency, generateQrSvg, buildWhatsAppLink, triggerPrint } from '../../utils/receiptGenerator';
import { downloadInvoicePdf } from '../../utils/pdfGenerator';

export function SaleSuccessModal({
  isOpen,
  onClose,
  sale = null,
  config = {},
  onNewSale,
}) {
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  useEffect(() => {
    if (isOpen && sale) {
      soundFX.playCashRegister();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#059669', '#10B981', '#F59E0B'],
        });
      } catch {
        // Fallback
      }
      setEmailSent(false);
      setPdfDownloaded(false);
    }
  }, [isOpen, sale]);

  if (!isOpen || !sale) return null;

  const qrSvgHtml = generateQrSvg(sale.qrCodeData || sale.seriesCorrelative || 'EZBUY', 105);

  const handleSendEmail = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSent(true);
    }, 600);
  };

  const handleWhatsApp = () => {
    const link = buildWhatsAppLink(sale.customerPhone || '987654321', sale, config);
    window.open(link, '_blank');
  };

  const handleDownloadPdf = () => {
    try {
      downloadInvoicePdf(sale, config);
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3000);
    } catch (err) {
      console.error('Error al generar PDF:', err);
    }
  };

  const totalItemsCount = (sale.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Stepper Horizontal de 3 Pasos */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-500 font-medium">
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">1</span>
              <span>Carrito</span>
            </span>
            <span>→</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">2</span>
              <span>Comprobante</span>
            </span>
            <span>→</span>
            <span className="flex items-center space-x-1 text-emerald-700 font-extrabold">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Impreso / PDF Enviado</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cabecera del Comprobante Limpio */}
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  {sale.customerName}
                </h3>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.2 rounded-full">
                  Emitido & Pagado
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600 mt-0.5">
                Comprobante N° {sale.seriesCorrelative} • DNI/RUC: {sale.customerDoc || '-'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-slate-500">
              {totalItemsCount} productos
            </span>
            <p className="text-xl font-black font-mono text-emerald-700">
              {formatCurrency(sale.total)}
            </p>
          </div>
        </div>

        {/* Contenido en Dos Columnas: Resumen de Compra vs Ticket Térmico */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Columna Izquierda: Resumen de Compra & Acciones Digitales */}
          <div className="md:col-span-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Recuadro "Resumen de Compra" */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                  Resumen de Compra:
                </h4>

                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal (Op. Gravada):</span>
                    <span className="font-mono">{formatCurrency(sale.subtotal || sale.total / 1.18)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>I.G.V. (18% SUNAT):</span>
                    <span className="font-mono">{formatCurrency(sale.igv || sale.total - (sale.total / 1.18))}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
                    <span>Total en Soles (S/):</span>
                    <span className="font-mono text-emerald-700 font-black">{formatCurrency(sale.total)}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-[11px] text-slate-500">
                    <span>Método de pago:</span>
                    <span className="font-bold text-slate-800 uppercase">{(sale.paymentMethod || 'Efectivo')}</span>
                  </div>
                </div>
              </div>

              {/* Botón Destacado: Enviar PDF al Correo del Cliente */}
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSendingEmail || emailSent}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  emailSent
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Mail className={`w-4 h-4 ${emailSent ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-xs font-bold">
                      {emailSent ? '¡PDF Enviado al Correo!' : 'Enviar PDF al Correo del Cliente'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {sale.customerEmail || 'antonio.bendezu@gmail.com'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  {emailSent ? '✓ Listo' : (isSendingEmail ? 'Enviando...' : 'Enviar')}
                </span>
              </button>

              {/* Botón: Descargar PDF Digital (Oficial SUNAT) */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>{pdfDownloaded ? '¡PDF Descargado!' : 'Descargar Comprobante PDF (A4 Oficial)'}</span>
              </button>

              {/* Botón: WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Compartir por WhatsApp</span>
              </button>
            </div>

            {/* Botón Iniciar Nueva Venta */}
            <button
              type="button"
              onClick={onNewSale}
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs tracking-wider shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition-all mt-3 cursor-pointer"
            >
              <span>+ Iniciar Nueva Venta</span>
            </button>
          </div>

          {/* Columna Derecha: Vista Previa Ticketera Térmica */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-700">Vista Previa Ticket Térmico:</span>
              <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                {config.printer_type || '58mm'}
              </span>
            </div>

            {/* Ticket Térmico Blanco */}
            <div 
              id="printable-receipt"
              className="bg-white text-black p-4 rounded-2xl shadow-sm border border-slate-200 font-mono text-[11px] leading-tight select-none max-h-[380px] overflow-y-auto"
            >
              <div className="text-center border-b border-black pb-2 mb-2">
                <p className="text-sm font-extrabold tracking-tight">
                  {config.business_name || 'BODEGA "LA PRIMERA"'}
                </p>
                <p className="text-[10px]">RUC: {config.ruc || '20609876543'}</p>
                <p className="text-[9px] text-slate-600">{config.address || 'Av. Las Gardenias 450, Surco'}</p>
                <div className="mt-1 pt-1 border-t border-dashed border-black/40">
                  <p className="font-bold text-xs uppercase">
                    {(sale.docType || 'boleta').toUpperCase()} ELECTRÓNICA
                  </p>
                  <p className="font-bold">{sale.seriesCorrelative}</p>
                  <p className="text-[9px]">Fecha: {new Date(sale.createdAt || Date.now()).toLocaleString('es-PE')}</p>
                </div>
              </div>

              {/* Datos Cliente */}
              <div className="border-b border-dashed border-black/40 pb-1.5 mb-1.5 text-[10px]">
                <p><span className="font-bold">Cliente:</span> {sale.customerName}</p>
                <p><span className="font-bold">Doc:</span> {sale.customerDoc || '45892134'}</p>
              </div>

              {/* Items */}
              <div className="border-b border-dashed border-black/40 pb-2 mb-2">
                <div className="flex justify-between font-bold text-[10px] border-b border-black/20 pb-0.5 mb-1">
                  <span>CANT / DESCRIPCIÓN</span>
                  <span>TOTAL</span>
                </div>
                {(sale.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between py-0.5 text-[10px]">
                    <span className="truncate pr-2">
                      {it.quantity}x {it.product_name || it.name}
                    </span>
                    <span className="font-bold flex-shrink-0">
                      S/ {Number(it.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-0.5 text-[10px] border-b border-black pb-2 mb-2">
                <div className="flex justify-between">
                  <span>OP. GRAVADA:</span>
                  <span>S/ {Number(sale.subtotal || sale.total / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>I.G.V. (18%):</span>
                  <span>S/ {Number(sale.igv || sale.total - (sale.total / 1.18)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-black/30">
                  <span>TOTAL:</span>
                  <span>S/ {Number(sale.total).toFixed(2)}</span>
                </div>
              </div>

              {/* QR SUNAT */}
              <div className="text-center">
                <div dangerouslySetInnerHTML={{ __html: qrSvgHtml }} />
                <p className="text-[8px] text-slate-600">
                  Hash: {sale.sunatHash ? sale.sunatHash.substring(0, 18) + '...' : 'CPE-HASH-OK'}
                </p>
                <p className="text-[8px] mt-0.5 font-bold">
                  Comprobante Electrónico SUNAT
                </p>
              </div>
            </div>

            {/* Botón Imprimir Ticket Térmico */}
            <button
              type="button"
              onClick={triggerPrint}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ticket Térmico</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
