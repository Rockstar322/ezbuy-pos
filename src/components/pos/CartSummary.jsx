import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Scale } from 'lucide-react';
import { formatCurrency } from '../../utils/receiptGenerator';

export function CartSummary({
  cart = [],
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
  discount = 0,
}) {
  const totalItemsCount = cart.reduce((sum, it) => sum + (it.isGranelItem ? 1 : it.quantity), 0);
  
  // Cálculo de totales
  const rawSubtotal = cart.reduce((sum, it) => sum + (it.salePrice * it.quantity), 0);
  const discountedTotal = Math.max(0, rawSubtotal - discount);
  const baseImponible = Number((discountedTotal / 1.18).toFixed(2));
  const igv = Number((discountedTotal - baseImponible).toFixed(2));

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Encabezado del Carrito */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>Ticket de Venta</span>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full font-bold">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Listo para facturar en Soles</p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Vaciar</span>
          </button>
        )}
      </div>

      {/* Lista de Items */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2 max-h-[380px] sm:max-h-[440px]">
        {cart.length === 0 ? (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-2.5">
              <ShoppingBag className="w-7 h-7 text-slate-300 stroke-[1.5]" />
            </div>
            <p className="text-xs font-bold text-slate-700">El carrito está vacío</p>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">
              Toca un producto, pesa a granel o dispara la pistola láser al código
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all group"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center space-x-1">
                  {item.isGranelItem && (
                    <Scale className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  )}
                  <h4 className="text-xs font-extrabold text-slate-800 truncate">
                    {item.name}
                  </h4>
                </div>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  {formatCurrency(item.salePrice)} <span className="text-[9px] text-slate-400">{item.unit === 'KGM' ? 'x kg' : 'c/u'}</span>
                </p>
              </div>

              {/* Controles de Cantidad y Subtotal */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.isGranelItem) {
                        onRemoveItem(item.id);
                      } else {
                        onUpdateQty(item.id, item.quantity - 1);
                      }
                    }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="w-9 text-center font-mono text-xs font-bold text-slate-800">
                    {item.isGranelItem ? item.quantity.toFixed(2) : item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (item.isGranelItem) {
                        onUpdateQty(item.id, item.quantity + 0.25);
                      } else {
                        onUpdateQty(item.id, item.quantity + 1);
                      }
                    }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[65px]">
                  <p className="text-xs font-black font-mono text-emerald-700">
                    {formatCurrency(item.salePrice * item.quantity)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1 rounded-lg text-slate-300 hover:text-rose-500 transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resumen Financiero y Botón Primario de Cobro */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 space-y-3">
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-500">Op. Gravada (Subtotal)</span>
            <span className="font-mono font-medium">{formatCurrency(baseImponible)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">I.G.V. (18% SUNAT)</span>
            <span className="font-mono font-medium">{formatCurrency(igv)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" /> Descuento
              </span>
              <span className="font-mono">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
            <span>TOTAL A COBRAR</span>
            <span className="font-mono text-xl text-emerald-700 font-black">
              {formatCurrency(discountedTotal)}
            </span>
          </div>
        </div>

        {/* Botón Principal de Cobro en Verde Bosque Profundo o Verde Esmeralda */}
        <button
          type="button"
          disabled={cart.length === 0}
          onClick={onProceedCheckout}
          className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg transition-all ${
            cart.length > 0
              ? 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white shadow-emerald-700/25 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Cobrar ({formatCurrency(discountedTotal)})</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
