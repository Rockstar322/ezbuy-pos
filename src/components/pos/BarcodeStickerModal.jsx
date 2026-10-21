import React, { useState } from 'react';
import { X, Printer, Barcode, Sparkles, Check, Copy } from 'lucide-react';
import { formatCurrency, triggerPrint } from '../../utils/receiptGenerator';

export function BarcodeStickerModal({ isOpen, onClose, products = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [customName, setCustomName] = useState('Conserva de Atún 140g');
  const [customPrice, setCustomPrice] = useState('5.00');
  const [customBarcode, setCustomBarcode] = useState('7750100001234');
  const [useCustom, setUseCustom] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentName = useCustom ? customName : (selectedProduct?.name || customName);
  const currentPrice = useCustom ? parseFloat(customPrice || 0) : (selectedProduct?.salePrice || 5.0);
  const currentBarcode = useCustom ? customBarcode : (selectedProduct?.barcode || customBarcode);

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setUseCustom(false);
  };

  const generateRandomCode = () => {
    const randomEan = '775' + Math.floor(100000000 + Math.random() * 900000000);
    setCustomBarcode(randomEan);
    setUseCustom(true);
  };

  const handlePrintSticker = () => {
    triggerPrint();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header del Modal */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Barcode className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Generador de Stickers de Códigos de Barras
              </h3>
              <p className="text-[11px] text-slate-500">
                Imprime etiquetas con precio para productos sin código de fábrica
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Selector de Producto */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Seleccionar Producto del Catálogo:
            </label>
            <div className="flex gap-2">
              <select
                value={useCustom ? 'custom' : (selectedProduct?.id || '')}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setUseCustom(true);
                  } else {
                    const found = products.find((p) => p.id === e.target.value);
                    if (found) handleSelectProduct(found);
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {formatCurrency(p.salePrice)} ({p.barcode})
                  </option>
                ))}
                <option value="custom">Crear producto personalizado o suelto...</option>
              </select>

              <button
                type="button"
                onClick={generateRandomCode}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Generar código interno nuevo"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autogenerar</span>
              </button>
            </div>
          </div>

          {/* Formulario Custom si aplica */}
          {useCustom && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Nombre en Etiqueta</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  placeholder="Ej: Kilo de Palta Fuerte"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Precio (S/)</label>
                <input
                  type="number"
                  step="0.10"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  placeholder="5.00"
                />
              </div>
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Código de Barras Interno</label>
                <input
                  type="text"
                  value={customBarcode}
                  onChange={(e) => setCustomBarcode(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Vista Previa Realista del Sticker Adhesivo */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700">
              Vista Previa de Impresión Térmica (Etiqueta 50mm x 30mm):
            </span>

            {/* Sticker con diseño de alta fidelidad */}
            <div 
              id="printable-barcode-sticker"
              className="mx-auto w-[280px] bg-white text-black p-3.5 rounded-2xl border-2 border-dashed border-slate-300 shadow-md flex flex-col items-center justify-between font-sans select-none"
            >
              <div className="w-full text-center border-b border-black/20 pb-1">
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-600">
                  EZBUY MINIMARKET
                </p>
                <h4 className="text-xs font-bold leading-tight text-black line-clamp-2 mt-0.5">
                  {currentName}
                </h4>
              </div>

              {/* Precio destacado */}
              <div className="my-1 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-700 mr-1">PRECIO:</span>
                <span className="text-lg font-black font-mono text-black">
                  {formatCurrency(currentPrice)}
                </span>
              </div>

              {/* Patrón visual de código de barras simulado de alta resolución */}
              <div className="w-full flex flex-col items-center">
                <div className="w-[85%] h-11 flex items-stretch justify-center space-x-[2px] bg-white py-1">
                  {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 2, 1, 2, 3, 1, 2, 4, 1].map((w, i) => (
                    <div
                      key={i}
                      style={{ width: `${w * 1.5}px` }}
                      className={i % 2 === 0 ? 'bg-black' : 'bg-transparent'}
                    />
                  ))}
                </div>
                <p className="font-mono text-[10px] tracking-widest font-bold text-black mt-0.5">
                  {currentBarcode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer y Acciones de Impresión */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(currentBarcode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-colors"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrintSticker}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Sticker</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BarcodeStickerModal;
