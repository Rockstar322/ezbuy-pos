import React, { useState, useEffect } from 'react';
import { X, Package, Barcode, DollarSign, Scale, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/receiptGenerator';

export function ProductModal({ isOpen, onClose, product = null, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Abarrotes');
  const [barcode, setBarcode] = useState('');
  const [costPrice, setCostPrice] = useState('0.00');
  const [salePrice, setSalePrice] = useState('0.00');
  const [stock, setStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [unit, setUnit] = useState('NIU');
  const [isGranel, setIsGranel] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'Abarrotes');
      setBarcode(product.barcode || '');
      setCostPrice(String(product.costPrice || '0.00'));
      setSalePrice(String(product.salePrice || '0.00'));
      setStock(String(product.stock || '0'));
      setMinStock(String(product.minStock || '5'));
      setUnit(product.unit || 'NIU');
      setIsGranel(product.isGranel || false);
    } else {
      setName('');
      setCategory('Abarrotes');
      setBarcode('775' + Math.floor(100000000 + Math.random() * 900000000));
      setCostPrice('3.50');
      setSalePrice('5.00');
      setStock('15');
      setMinStock('5');
      setUnit('NIU');
      setIsGranel(false);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const cost = parseFloat(costPrice || 0);
  const sale = parseFloat(salePrice || 0);
  const profitMargin = sale - cost;
  const marginPercent = cost > 0 ? ((profitMargin / cost) * 100).toFixed(1) : '100.0';

  const handleGenerateBarcode = () => {
    setBarcode('775' + Math.floor(100000000 + Math.random() * 900000000));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !barcode.trim()) return;

    onSave({
      ...(product ? { id: product.id } : {}),
      name: name.trim(),
      category,
      barcode: barcode.trim(),
      costPrice: cost,
      salePrice: sale,
      stock: isGranel ? parseFloat(stock || 0) : parseInt(stock || 0, 10),
      minStock: parseInt(minStock || 0, 10),
      unit: isGranel ? 'KGM' : unit,
      isGranel,
      iconType: isGranel ? 'scale' : 'package',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Package className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                {product ? 'Editar Producto' : 'Nuevo Producto en Catálogo'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Soporta código de fábrica original y venta a granel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto max-h-[80vh]">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nombre del Producto *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Arroz Faraón Extra 1kg, Conserva de Atún Primor"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Categoría y Código de Barras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Categoría</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value === 'A Granel / Peso') {
                    setIsGranel(true);
                    setUnit('KGM');
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="A Granel / Peso">A Granel / Peso</option>
                <option value="Abarrotes">Abarrotes</option>
                <option value="Bebidas y Licores">Bebidas y Licores</option>
                <option value="Snacks y Galletas">Snacks y Galletas</option>
                <option value="Lácteos y Embutidos">Lácteos y Embutidos</option>
                <option value="Enlatados y Conservas">Enlatados y Conservas</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Código de Fábrica / Barras *</label>
                <button
                  type="button"
                  onClick={handleGenerateBarcode}
                  className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Autogenerar</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="7750100001234"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Checkbox para Venta a Granel */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-emerald-700" />
              <div>
                <p className="text-xs font-bold text-slate-800">¿Es producto de saco o a granel?</p>
                <p className="text-[10px] text-slate-500">Permite despachar por 1/4 kg, 1/2 kg o por importe en Soles</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isGranel}
              onChange={(e) => {
                setIsGranel(e.target.checked);
                if (e.target.checked) setUnit('KGM');
              }}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Precios y Margen */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Costo Compra (S/)</label>
                <input
                  type="number"
                  step="0.10"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-700">Precio Venta (S/) *</label>
                <input
                  type="number"
                  step="0.10"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="w-full bg-white border border-emerald-400 rounded-xl px-3 py-2 text-xs text-emerald-800 font-mono font-black"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1 pt-1 border-t border-slate-200 text-slate-500">
              <span>Margen Unitario:</span>
              <span className="font-mono font-bold text-emerald-700">
                {formatCurrency(profitMargin)} (+{marginPercent}%)
              </span>
            </div>
          </div>

          {/* Stock y Stock Mínimo */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Stock Actual</label>
              <input
                type="number"
                step={isGranel ? '0.25' : '1'}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-700">Stock Mínimo</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Unidad</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800"
              >
                <option value="NIU">Unidad (NIU)</option>
                <option value="KGM">Kilos (KGM)</option>
                <option value="LT">Litros (LT)</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-700/25 cursor-pointer"
            >
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
