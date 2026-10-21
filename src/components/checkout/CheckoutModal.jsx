import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileText, 
  User, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Mail, 
  Phone, 
  Check, 
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { formatCurrency } from '../../utils/receiptGenerator';
import { billingService } from '../../services/billing';

export function CheckoutModal({
  isOpen,
  onClose,
  cart = [],
  total = 0,
  customers = [],
  onConfirmSale,
  config = {},
}) {
  const [docType, setDocType] = useState('boleta'); // 'ticket', 'boleta', 'factura'
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0] || null);
  const [customerName, setCustomerName] = useState(customers[0]?.fullName || 'Antonio Bendezú Quispe');
  const [customerDoc, setCustomerDoc] = useState(customers[0]?.docNumber || '45892134');
  const [customerEmail, setCustomerEmail] = useState(customers[0]?.email || 'antonio.bendezu@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(customers[0]?.phone || '987654321');

  const [paymentMethod, setPaymentMethod] = useState('yape'); // 'efectivo', 'yape', 'plin', 'tarjeta'
  const [cashTendered, setCashTendered] = useState(String(total));
  const [isProcessing, setIsProcessing] = useState(false);

  // Autocompletado inteligente de clientes habituales
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return [];
    const q = customerSearch.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.docNumber.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [customerSearch, customers]);

  if (!isOpen) return null;

  const handleSelectCustomer = (cust) => {
    setSelectedCustomer(cust);
    setCustomerName(cust.fullName);
    setCustomerDoc(cust.docNumber);
    setCustomerEmail(cust.email || '');
    setCustomerPhone(cust.phone || '');
    setCustomerSearch('');

    if (cust.docType === 'RUC' || cust.docNumber.length === 11) {
      setDocType('factura');
    } else {
      setDocType('boleta');
    }
  };

  const cashNum = parseFloat(cashTendered || 0);
  const changeAmount = Math.max(0, cashNum - total);

  const generateSeries = () => {
    const prefix = docType === 'factura' ? 'F001' : (docType === 'boleta' ? 'B001' : 'T001');
    const randomCorrelative = String(Math.floor(100000 + Math.random() * 900000));
    return `${prefix}-${randomCorrelative}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const seriesCorrelative = generateSeries();
      const salePayload = {
        seriesCorrelative,
        docType,
        customerId: selectedCustomer?.id || null,
        customerName: customerName.trim() || 'Antonio Bendezú Quispe',
        customerDoc: customerDoc.trim() || '45892134',
        customerEmail: customerEmail.trim() || 'antonio.bendezu@gmail.com',
        customerPhone: customerPhone.trim() || '987654321',
        paymentMethod,
        total: parseFloat(total),
        cashTendered: paymentMethod === 'efectivo' ? cashNum : total,
        changeReturned: paymentMethod === 'efectivo' ? changeAmount : 0,
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          product_name: item.name,
          barcode: item.barcode,
          quantity: item.quantity,
          unit_price: item.salePrice,
          subtotal: item.salePrice * item.quantity,
        })),
      };

      const billingResult = await billingService.emit(salePayload);

      const completedSale = {
        ...salePayload,
        billingStatus: billingResult.sunatStatus === 'ACEPTADO' ? 'sunat_accepted' : 'local_mock',
        sunatHash: billingResult.hashCPE,
        qrCodeData: billingResult.qrData,
        billingMessage: billingResult.message,
        provider: billingResult.provider,
      };

      onConfirmSale(completedSale);
    } catch (err) {
      console.error('Error al emitir comprobante:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalItemsCount = cart.reduce((sum, it) => sum + (it.isGranelItem ? 1 : it.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Stepper Horizontal Minimalista */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-500 font-medium">
            <span className="flex items-center space-x-1 text-emerald-700 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Carrito</span>
            </span>
            <span>→</span>
            <span className="flex items-center space-x-1 text-emerald-700 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Comprobante SUNAT</span>
            </span>
            <span>→</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">3</span>
              <span className="hidden sm:inline">Impreso / PDF</span>
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
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {customerName}
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Doc: {customerDoc} • {customerEmail}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
              {totalItemsCount} productos
            </span>
            <p className="text-xl font-black font-mono text-emerald-700 mt-1">
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        {/* Formulario de Emisión */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          {/* 1. Selector de Tipo de Comprobante */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">1. Tipo de Comprobante:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'boleta', title: 'Boleta de Venta', sub: 'Serie B001 (DNI)', badge: 'DNI' },
                { id: 'factura', title: 'Factura Electrónica', sub: 'Serie F001 (RUC)', badge: 'RUC' },
                { id: 'ticket', title: 'Nota de Venta', sub: 'Ticket Simple', badge: 'Simple' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setDocType(c.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    docType === c.id
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800">{c.title}</p>
                    <span className="text-[9px] font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
                      {c.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Buscador de Clientes */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>2. Cliente / Razón Social:</span>
              <span className="text-[10px] text-slate-400 font-normal">Autocompletado en 1 toque</span>
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Buscar cliente (ej: Antonio Bendezú, 45892134...)"
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />

              {filteredCustomers.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden divide-y divide-slate-100">
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCustomer(c)}
                      className="w-full p-2.5 text-left hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{c.fullName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{c.docType}: {c.docNumber} • {c.email}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Elegir
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Inputs editables de datos del cliente */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500">Nombre / Razón Social</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-0.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500">{docType === 'factura' ? 'RUC' : 'DNI'}</label>
                <input
                  type="text"
                  value={customerDoc}
                  onChange={(e) => setCustomerDoc(e.target.value)}
                  className="w-full mt-0.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Método de Pago */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">3. Método de Pago:</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'yape', label: 'Yape', icon: Smartphone, color: 'text-purple-600' },
                { id: 'plin', label: 'Plin', icon: QrCode, color: 'text-sky-600' },
                { id: 'efectivo', label: 'Efectivo', icon: Banknote, color: 'text-emerald-600' },
                { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard, color: 'text-amber-600' },
              ].map((m) => {
                const Icon = m.icon;
                const isSel = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-2 px-1 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      isSel
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs ring-1 ring-emerald-500/30'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSel ? 'text-emerald-700' : m.color}`} strokeWidth={1.75} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'efectivo' && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 mt-2">
                <div className="flex-1 space-y-0.5">
                  <label className="text-[11px] font-bold text-slate-600">Paga con (S/):</label>
                  <input
                    type="number"
                    step="0.50"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono font-bold"
                  />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Vuelto:</p>
                  <p className="text-base font-mono font-black text-emerald-700">
                    {formatCurrency(changeAmount)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botón Primario de Confirmación */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-700/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Firmando comprobante SUNAT...
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                <span>Confirmar y Emitir Comprobante ({formatCurrency(total)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
