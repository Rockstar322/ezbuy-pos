import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Calendar, 
  DollarSign, 
  FileText, 
  Mail, 
  Phone, 
  ArrowRight, 
  Printer, 
  Share2, 
  Clock, 
  ShoppingBag,
  Sparkles,
  Filter,
  CheckCircle2,
  ExternalLink,
  Download,
  X
} from 'lucide-react';
import { formatCurrency, triggerPrint, buildWhatsAppLink } from '../../utils/receiptGenerator';
import { downloadInvoicePdf } from '../../utils/pdfGenerator';

export function CRMView({ customers = [], sales = [], config = {}, onSaveCustomer }) {
  const [activeSubTab, setActiveSubTab] = useState('audit'); // 'audit' o 'directory'

  // Filtros de Auditoría
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterDay, setFilterDay] = useState('all');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');

  // Ticket seleccionado
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);

  const applyDemoBodegaCase = () => {
    setActiveSubTab('audit');
    setFilterCustomer('Antonio');
    setFilterDay('Lunes');
    setFilterMinAmount('10');
    setFilterMaxAmount('20');
  };

  const clearFilters = () => {
    setFilterCustomer('');
    setFilterDay('all');
    setFilterMinAmount('');
    setFilterMaxAmount('');
  };

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const q = filterCustomer.toLowerCase().trim();
      const matchCust = !q || 
        (s.customerName && s.customerName.toLowerCase().includes(q)) ||
        (s.customerDoc && s.customerDoc.includes(q));

      const matchDay = filterDay === 'all' || s.dayOfWeek === filterDay;

      const total = Number(s.total || 0);
      const min = filterMinAmount !== '' ? parseFloat(filterMinAmount) : 0;
      const max = filterMaxAmount !== '' ? parseFloat(filterMaxAmount) : Infinity;
      const matchAmount = total >= min && total <= max;

      return matchCust && matchDay && matchAmount;
    });
  }, [sales, filterCustomer, filterDay, filterMinAmount, filterMaxAmount]);

  const handleSendEmailFromAudit = (ticket) => {
    setEmailStatus('sending');
    setTimeout(() => {
      setEmailStatus('sent');
      setTimeout(() => setEmailStatus(null), 3000);
    }, 600);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner de Auditoría Histórica de Bodega */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
              Buscador de Auditoría Histórica (Caso Real de Tienda)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Si un cliente llega y pregunta: <em>"El lunes hice una compra de unos dieciséis soles, ¿qué compré?"</em>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={applyDemoBodegaCase}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-all flex-shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Probar Caso: "Lunes ~S/ 16.50"</span>
        </button>
      </div>

      {/* Sub-Pestañas: Historial vs Directorio */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('audit')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'audit'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Comprobantes & Historial ({sales.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('directory')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'directory'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Directorio de Clientes ({customers.length})
        </button>
      </div>

      {/* CONTENIDO 1: HISTORIAL DE TICKETS */}
      {activeSubTab === 'audit' && (
        <div className="space-y-3">
          {/* Barra de Filtros */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-500 font-bold mb-1 block">Cliente / DNI</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                  placeholder="Antonio, 4589..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold mb-1 block">Día de la Semana</label>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos los días</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold mb-1 block">Rango de Monto (S/)</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  placeholder="Mín 10"
                  value={filterMinAmount}
                  onChange={(e) => setFilterMinAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 font-mono"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Máx 20"
                  value={filterMaxAmount}
                  onChange={(e) => setFilterMaxAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Lista de Resultados */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {filteredSales.length === 0 ? (
              <div className="py-12 text-center text-slate-400 p-4">
                <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-700">No se encontraron tickets con estos criterios</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Prueba usando el botón de demo arriba</p>
              </div>
            ) : (
              filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-extrabold text-slate-800">
                          {sale.seriesCorrelative}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          {sale.dayOfWeek || 'Lunes'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {sale.paymentMethod}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {sale.customerName} <span className="text-[10px] text-slate-400 font-mono">({sale.customerDoc || '-'})</span>
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(sale.createdAt).toLocaleString('es-PE')}</span>
                        <span>• {(sale.items || []).length} items</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <div className="text-right">
                      <p className="text-sm font-mono font-black text-emerald-700">
                        {formatCurrency(sale.total)}
                      </p>
                      <p className="text-[10px] text-emerald-600 flex items-center justify-end gap-1 font-medium">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>SUNAT Aceptado</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedTicket(sale)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Ver Desglose</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO 2: DIRECTORIO DE CLIENTES */}
      {activeSubTab === 'directory' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-3 px-4">Cliente & Documento</th>
                  <th className="py-3 px-3">Contacto</th>
                  <th className="py-3 px-3 font-mono">Total Gastado</th>
                  <th className="py-3 px-3 text-center">Compras</th>
                  <th className="py-3 px-4">Última Visita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-extrabold text-slate-800 text-xs">{c.fullName}</p>
                      <p className="text-[10px] font-mono text-slate-400">{c.docType}: {c.docNumber}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-slate-600">{c.email || 'Sin correo'}</p>
                      <p className="text-[10px] font-mono text-slate-400">Cel: {c.phone}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-700 font-extrabold">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {c.ordersCount} compras
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString('es-PE') : 'Reciente'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Desglose del Ticket para Auditoría */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Ticket {selectedTicket.seriesCorrelative}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full font-bold">
                    {selectedTicket.dayOfWeek}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Emitido el {new Date(selectedTicket.createdAt).toLocaleString('es-PE')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Cliente:</p>
                <p className="text-slate-900 font-extrabold text-sm">{selectedTicket.customerName}</p>
                <p className="font-mono text-slate-600">
                  Doc: {selectedTicket.customerDoc || 'No registrado'} • Pago: {(selectedTicket.paymentMethod || 'Efectivo').toUpperCase()}
                </p>
                {selectedTicket.customerEmail && (
                  <p className="text-slate-500 text-[11px]">Email: {selectedTicket.customerEmail}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-700">Productos en este ticket:</p>
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  {(selectedTicket.items || []).map((it, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-800 truncate">{it.product_name || it.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {it.quantity}x {formatCurrency(it.unit_price)}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 flex-shrink-0">
                        {formatCurrency(it.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-emerald-800 font-medium">Total Facturado</p>
                  <p className="text-xl font-black font-mono text-emerald-700">
                    {formatCurrency(selectedTicket.total)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Firma Hash SUNAT</p>
                  <p className="text-[9px] font-mono text-slate-600 max-w-[140px] truncate">
                    {selectedTicket.sunatHash || 'OK'}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones: Descargar PDF A4, Enviar Email y WhatsApp */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => downloadInvoicePdf(selectedTicket, config)}
                className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Descargar Comprobante Oficial SUNAT en PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendEmailFromAudit(selectedTicket)}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{emailStatus === 'sent' ? '¡Enviado!' : 'Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const link = buildWhatsAppLink(selectedTicket.customerPhone || '987654321', selectedTicket, config);
                  window.open(link, '_blank');
                }}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={triggerPrint}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                title="Reimprimir ticket"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
