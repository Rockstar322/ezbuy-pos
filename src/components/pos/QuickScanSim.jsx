import React from 'react';
import { Zap, Sparkles, Box, CupSoda, Cookie } from 'lucide-react';
import { soundFX } from '../../utils/audio';

export function QuickScanSim({ onAddProduct, products = [] }) {
  const atun = products.find((p) => p.barcode === '7750100001234') || {
    name: 'Conserva de Atún 140g',
    salePrice: 5.00,
    barcode: '7750100001234',
  };

  const cerveza = products.find((p) => p.barcode === '7750200005678') || {
    name: 'Lata de Cerveza Pilsen',
    salePrice: 6.00,
    barcode: '7750200005678',
  };

  const galleta = products.find((p) => p.barcode === '7750300009012') || {
    name: 'Galleta Soda San Jorge',
    salePrice: 1.50,
    barcode: '7750300009012',
  };

  const demoItems = [
    { item: atun, label: 'Conserva Atún 140g', icon: Box, price: 'S/ 5.00' },
    { item: cerveza, label: 'Lata Cerveza 355ml', icon: CupSoda, price: 'S/ 6.00' },
    { item: galleta, label: 'Galleta Soda Familiar', icon: Cookie, price: 'S/ 1.50' },
  ];

  const handleClick = (item) => {
    soundFX.playScanBeep();
    onAddProduct(item);
  };

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Simulador de Escaneo Rápido (Demo en 1 Toque)</span>
        </div>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Suma al ticket al instante
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {demoItems.map((d, idx) => {
          const Icon = d.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleClick(d.item)}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-1.5 truncate pr-2">
                <Icon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 truncate">
                  {d.label}
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-emerald-700 flex-shrink-0">
                {d.price}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default QuickScanSim;
