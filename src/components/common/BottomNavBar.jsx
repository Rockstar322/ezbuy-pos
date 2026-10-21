import React from 'react';
import { Home, Package, Plus, FileText, Users } from 'lucide-react';

export function BottomNavBar({
  activeTab,
  setActiveTab,
  onOpenQuickActionMenu,
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-lg px-2 sm:px-6 py-1.5 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* 1. Inicio / POS */}
        <button
          type="button"
          onClick={() => setActiveTab('pos')}
          className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 transition-all ${
            activeTab === 'pos' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'pos' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px]">Inicio</span>
        </button>

        {/* 2. Inventario */}
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 transition-all ${
            activeTab === 'inventory' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Package className={`w-5 h-5 ${activeTab === 'inventory' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px]">Inventario</span>
        </button>

        {/* 3. Botón Central Destacado [ + ] */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            type="button"
            onClick={onOpenQuickActionMenu}
            className="w-12 h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-700/35 flex items-center justify-center transform active:scale-95 transition-all cursor-pointer border-2 border-white ring-2 ring-emerald-500/20"
            title="Acción Rápida: Venta a Granel, Escanear Cámara o Ingreso Manual"
          >
            <Plus className="w-6 h-6 stroke-[2.8]" />
          </button>
        </div>

        {/* 4. Comprobantes / Historial */}
        <button
          type="button"
          onClick={() => setActiveTab('crm')}
          className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 transition-all ${
            activeTab === 'crm' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === 'crm' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px]">Historial</span>
        </button>

        {/* 5. Clientes / Analítica */}
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 transition-all ${
            activeTab === 'analytics' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === 'analytics' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px]">Analítica</span>
        </button>
      </div>
    </nav>
  );
}
