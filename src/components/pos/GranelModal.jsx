import React, { useState } from 'react';
import { X, Scale, Plus, Check, DollarSign, Edit3, ShoppingBag, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/receiptGenerator';
import { soundFX } from '../../utils/audio';

export function GranelModal({
  isOpen,
  onClose,
  granelProducts = [],
  onAddToCart,
}) {
  const [activeTab, setActiveTab] = useState('granel'); // 'granel' o 'manual'

  // Estado para Venta por Peso
  const defaultProduct = granelProducts[0] || {
    id: 'prod-001',
    name: 'Arroz Faraón Extra en Saco',
    salePrice: 4.00,
    unit: 'KGM',
    stock: 50,
  };

  const [selectedProduct, setSelectedProduct] = useState(defaultProduct);
  const [selectedFraction, setSelectedFraction] = useState('0.25'); // '0.25', '0.50', '1.00', 'custom'
  const [customWeight, setCustomWeight] = useState('0.500');
  const [calcMode, setCalcMode] = useState('weight'); // 'weight' o 'amount'
  const [customAmountSoles, setCustomAmountSoles] = useState('2.00');

  // Estado para Ingreso Manual Exprés
  const [manualConcept, setManualConcept] = useState('Arroz Faraón 1kg');
  const [manualPrice, setManualPrice] = useState('4.00');
  const [manualQty, setManualQty] = useState('1');

  if (!isOpen) return null;

  const currentPricePerKg = selectedProduct?.salePrice || 4.0;

  // Cálculo según modo
  let finalWeight = 0.25;
  let finalPrice = 1.0;

  if (calcMode === 'weight') {
    finalWeight = selectedFraction === 'custom' ? parseFloat(customWeight || 0) : parseFloat(selectedFraction);
    finalPrice = Number((finalWeight * currentPricePerKg).toFixed(2));
  } else {
    // Por monto en Soles: peso = monto / precio_kg
    const amountNum = parseFloat(customAmountSoles || 0);
    finalWeight = currentPricePerKg > 0 ? Number((amountNum / currentPricePerKg).toFixed(3)) : 0;
    finalPrice = amountNum;
  }

  const handleAddGranelToCart = () => {
    if (finalWeight <= 0) return;
    soundFX.playScanBeep();

    const fractionLabel = 
      finalWeight === 0.25 ? '1/4 kg' :
      finalWeight === 0.50 ? '1/2 kg' :
      finalWeight === 0.75 ? '3/4 kg' :
      finalWeight === 1.00 ? '1 kg' : `${finalWeight.toFixed(3)} kg`;

    onAddToCart({
      id: `${selectedProduct.id}-g-${Date.now()}`,
      productId: selectedProduct.id,
      name: `${selectedProduct.name} (${fractionLabel})`,
      barcode: selectedProduct.barcode,
      salePrice: currentPricePerKg,
      quantity: finalWeight,
      unit: 'KGM',
      iconType: 'scale',
      isGranelItem: true,
    });

    onClose();
  };

  const handleAddManualToCart = (e) => {
    e.preventDefault();
    if (!manualConcept.trim()) return;
    soundFX.playScanBeep();

    const price = parseFloat(manualPrice || 0);
    const qty = parseFloat(manualQty || 1);

    onAddToCart({
      id: `manual-${Date.now()}`,
      productId: null,
      name: manualConcept.trim(),
      barcode: 'MANUAL',
      salePrice: price,
      quantity: qty,
      unit: 'NIU',
      iconType: 'package',
      isManualItem: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Scale className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Venta a Granel & Ingreso Exprés
              </h3>
              <p className="text-[11px] text-slate-500">
                Despacho fraccionado por peso o productos sin código
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

        {/* Selector de Pestaña */}
        <div className="flex p-2 bg-slate-100/70 border-b border-slate-100 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('granel')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'granel'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Por Peso / Fracción</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'manual'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ingreso Manual Exprés</span>
          </button>
        </div>

        {/* TAB 1: VENTA FRACCIONADA POR PESO */}
        {activeTab === 'granel' && (
          <div className="p-4 space-y-4">
            {/* 1. Selector de Producto de Saco / Granel */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Producto a Granel:</label>
              <div className="grid grid-cols-2 gap-2">
                {granelProducts.map((p) => {
                  const isSel = selectedProduct?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProduct(p)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSel
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs font-extrabold text-slate-800 line-clamp-1">{p.name}</p>
                      <p className="text-[11px] font-mono font-bold text-emerald-600 mt-0.5">
                        {formatCurrency(p.salePrice)} <span className="text-[10px] text-slate-500 font-normal">/ kg</span>
                      </p>
                      <p className="text-[10px] text-slate-400">Stock: {p.stock} kg</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Botones de Fracción en 1 Toque */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Selecciona la Fracción del Saco:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '1/4 kg', weight: '0.25', price: (currentPricePerKg * 0.25).toFixed(2) },
                  { label: '1/2 kg', weight: '0.50', price: (currentPricePerKg * 0.50).toFixed(2) },
                  { label: '1 kg', weight: '1.00', price: currentPricePerKg.toFixed(2) },
                ].map((f) => (
                  <button
                    key={f.weight}
                    type="button"
                    onClick={() => {
                      setCalcMode('weight');
                      setSelectedFraction(f.weight);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      calcMode === 'weight' && selectedFraction === f.weight
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-extrabold'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold">{f.label}</p>
                    <p className="text-sm font-mono font-extrabold mt-0.5">
                      S/ {f.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* O ingreso exacto por Dinero (ej. "Dame 3 soles de arroz") */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">O pedir por importe en Soles:</span>
                <span className="text-slate-500 font-mono text-[11px]">Calcula peso exacto</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">S/</span>
                  <input
                    type="number"
                    step="0.50"
                    placeholder="Monto (ej: 3.00)"
                    value={customAmountSoles}
                    onChange={(e) => {
                      setCalcMode('amount');
                      setCustomAmountSoles(e.target.value);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-right text-xs">
                  <span className="text-slate-500 text-[10px]">Equivale a:</span>
                  <p className="font-mono font-extrabold text-emerald-700">
                    {finalWeight.toFixed(3)} kg
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen & Botón de Agregar */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500">Total a sumar:</p>
                <p className="text-xl font-black font-mono text-emerald-600">
                  {formatCurrency(finalPrice)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddGranelToCart}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Sumar {finalWeight.toFixed(2)} kg al Carrito</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INGRESO MANUAL EXPRÉS (SIN CÓDIGO) */}
        {activeTab === 'manual' && (
          <form onSubmit={handleAddManualToCart} className="p-4 space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700">Concepto / Nombre del Producto</label>
              <input
                type="text"
                required
                value={manualConcept}
                onChange={(e) => setManualConcept(e.target.value)}
                placeholder="Ej: Pan Francés 10 unidades, Arroz Faraón 1kg"
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-emerald-700">Precio de Venta (S/) *</label>
                <input
                  type="number"
                  step="0.10"
                  required
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-emerald-300 rounded-xl px-3 py-2 text-sm font-mono font-extrabold text-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Cantidad</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={manualQty}
                  onChange={(e) => setManualQty(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span><strong>Ingreso Exprés:</strong> Permite cobrar productos del día, verduras, pan o pedidos sin código de barras al instante.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Sumar {formatCurrency(parseFloat(manualPrice || 0) * parseFloat(manualQty || 1))} al Carrito</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
