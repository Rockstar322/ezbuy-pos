import React, { useState, useEffect } from 'react';
import { 
  X, 
  Barcode, 
  Package, 
  Plus, 
  Check, 
  Zap, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Scale
} from 'lucide-react';
import { soundFX } from '../../utils/audio';
import { formatCurrency } from '../../utils/receiptGenerator';

export function QuickStockScannerModal({
  isOpen,
  onClose,
  products = [],
  onAddStock,
  onRegisterNewProduct,
}) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [qtyToAdd, setQtyToAdd] = useState('12');
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Formulario rápido para nuevo producto
  const [newName, setNewName] = useState('');
  const [newSalePrice, setNewSalePrice] = useState('5.00');
  const [newCostPrice, setNewCostPrice] = useState('3.50');
  const [newCategory, setNewCategory] = useState('Abarrotes');
  const [newIsGranel, setNewIsGranel] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  // Listener para pistola láser dentro del modal
  useEffect(() => {
    if (!isOpen) return;

    let buffer = [];
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 65) {
        buffer = [];
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          e.preventDefault();
          const code = buffer.join('').trim();
          buffer = [];
          processScannedCode(code);
        }
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        buffer.push(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, products]);

  if (!isOpen) return null;

  const processScannedCode = (code) => {
    soundFX.playScanBeep();
    setBarcodeInput(code);
    setSuccessMessage('');

    const existing = products.find((p) => p.barcode === code);
    if (existing) {
      setScannedProduct(existing);
      setIsNewProduct(false);
      setQtyToAdd('12');
    } else {
      setScannedProduct(null);
      setIsNewProduct(true);
      setNewName('');
      setNewSalePrice('5.00');
      setNewCostPrice('3.50');
      setNewIsGranel(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      processScannedCode(barcodeInput.trim());
    }
  };

  const handleConfirmAddStock = () => {
    if (!scannedProduct) return;
    const qty = parseFloat(qtyToAdd || 0);
    if (qty <= 0) return;

    soundFX.playCashRegister();
    onAddStock(scannedProduct.id, qty);
    setSuccessMessage(`¡Se ingresaron +${qty} unidades a ${scannedProduct.name}! (Nuevo stock: ${scannedProduct.stock + qty})`);
    setTimeout(() => {
      setSuccessMessage('');
      setScannedProduct(null);
      setBarcodeInput('');
    }, 2500);
  };

  const handleConfirmRegisterNew = (e) => {
    e.preventDefault();
    if (!newName.trim() || !barcodeInput.trim()) return;

    soundFX.playCashRegister();
    const qty = parseFloat(qtyToAdd || 10);
    const newProduct = {
      name: newName.trim(),
      category: newCategory,
      barcode: barcodeInput.trim(),
      costPrice: parseFloat(newCostPrice || 0),
      salePrice: parseFloat(newSalePrice || 0),
      stock: qty,
      minStock: 5,
      unit: newIsGranel ? 'KGM' : 'NIU',
      isGranel: newIsGranel,
      iconType: newIsGranel ? 'scale' : 'package',
    };

    onRegisterNewProduct(newProduct);
    setSuccessMessage(`¡Producto "${newProduct.name}" registrado con ${qty} unidades en stock!`);
    setTimeout(() => {
      setSuccessMessage('');
      setIsNewProduct(false);
      setBarcodeInput('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>Recepción Rápida por Código de Fábrica</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full font-bold">
                  Sin Ticketar
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Escanea el código de barras impreso en la espalda del producto para reabastecer o crear al instante
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

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Mensaje de Éxito Flotante */}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Campo de Entrada de Código de Barras (Escáner o Pistola) */}
          <form onSubmit={handleManualSearch} className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Disparar Pistola Láser o Digitar Código de Fábrica:</span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <span>Pistola HID Activa</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              </span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Apunta la pistola al código de barras del producto..."
                  className="w-full bg-slate-50 border-2 border-emerald-500/40 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-all cursor-pointer"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Simuladores de Códigos de Fábrica en 1 Clic (Sin emojis) */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              O prueba disparar con un producto de muestra:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Atún Primor 140g', code: '7750100001234' },
                { label: 'Cerveza Pilsen 355ml', code: '7750200005678' },
                { label: 'Leche Gloria 400g', code: '7750600001122' },
                { label: 'Producto Nuevo', code: '7759990008888' },
              ].map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => processScannedCode(s.code)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all text-xs"
                >
                  <p className="font-bold text-slate-800 truncate">{s.label}</p>
                  <p className="text-[10px] font-mono text-slate-400">{s.code}</p>
                </button>
              ))}
            </div>
          </div>

          {/* CASO A: PRODUCTO YA EXISTE -> REABASTECIMIENTO RÁPIDO */}
          {scannedProduct && (
            <div className="p-4 rounded-3xl bg-slate-50 border border-emerald-300 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">{scannedProduct.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Código: {scannedProduct.barcode} • Cat: {scannedProduct.category}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Stock actual:</span>
                  <p className="text-sm font-mono font-black text-emerald-700">
                    {scannedProduct.stock} {scannedProduct.unit}
                  </p>
                </div>
              </div>

              {/* Selector Rápido de Cantidad a Sumar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700">
                  ¿Cuántas unidades llegaron del distribuidor?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1', '6', '12', '24'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setQtyToAdd(val)}
                      className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                        qtyToAdd === val
                          ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      +{val} {val === '1' ? 'und' : (val === '6' ? 'pack' : (val === '12' ? 'doc' : 'caja'))}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2 pt-1 text-xs">
                  <span className="text-slate-500">Cantidad manual:</span>
                  <input
                    type="number"
                    value={qtyToAdd}
                    onChange={(e) => setQtyToAdd(e.target.value)}
                    className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono font-bold text-center"
                  />
                  <span className="text-slate-500">
                    → Nuevo Stock: <strong className="text-slate-800 font-mono font-bold">{scannedProduct.stock + parseFloat(qtyToAdd || 0)}</strong>
                  </span>
                </div>
              </div>

              {/* Botón Confirmar Entrada */}
              <button
                type="button"
                onClick={handleConfirmAddStock}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ingresar +{qtyToAdd} unidades a Stock</span>
              </button>
            </div>
          )}

          {/* CASO B: PRODUCTO NUEVO DETECTADO */}
          {isNewProduct && (
            <form onSubmit={handleConfirmRegisterNew} className="p-4 rounded-3xl bg-slate-50 border border-emerald-300 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>¡Nuevo Código de Fábrica Detectado! ({barcodeInput})</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Registra su nombre y precio en 3 segundos sin necesidad de imprimir stickers:
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Nombre del Producto</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Aceite de Oliva Extra Virgen 500ml"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Costo (S/)</label>
                    <input
                      type="number"
                      step="0.10"
                      value={newCostPrice}
                      onChange={(e) => setNewCostPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-emerald-700">P. Venta (S/)</label>
                    <input
                      type="number"
                      step="0.10"
                      required
                      value={newSalePrice}
                      onChange={(e) => setNewSalePrice(e.target.value)}
                      className="w-full bg-white border border-emerald-400 rounded-xl px-2.5 py-1.5 text-xs text-emerald-800 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Stock Inicial</label>
                    <input
                      type="number"
                      value={qtyToAdd}
                      onChange={(e) => setQtyToAdd(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      if (e.target.value === 'A Granel / Peso') setNewIsGranel(true);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  >
                    <option value="Abarrotes">Abarrotes</option>
                    <option value="A Granel / Peso">A Granel / Peso</option>
                    <option value="Bebidas y Licores">Bebidas y Licores</option>
                    <option value="Snacks y Galletas">Snacks y Galletas</option>
                    <option value="Lácteos y Embutidos">Lácteos y Embutidos</option>
                    <option value="Enlatados y Conservas">Enlatados y Conservas</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Registrar en Catálogo y Guardar Stock</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
