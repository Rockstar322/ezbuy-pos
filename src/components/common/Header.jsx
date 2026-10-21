import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Wifi, 
  WifiOff, 
  Printer, 
  FileText, 
  Lock, 
  Unlock, 
  Settings, 
  Smartphone, 
  Monitor, 
  ShoppingBag,
  Store,
  ChevronDown
} from 'lucide-react';
import { db } from '../../services/storage/database';
import { billingService } from '../../services/billing';
import { formatCurrency } from '../../utils/receiptGenerator';

export function Header({ 
  onOpenSettings, 
  onOpenPinLock, 
  isLocked,
  lastScannedCode,
  isScanningPulse,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  onShowSplash,
  viewMode,
  setViewMode
}) {
  const [syncQueue, setSyncQueue] = useState(db.getSyncQueue());
  const [config, setConfig] = useState(db.getConfig());
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const unsub = db.subscribe((event, data) => {
      if (event === 'queue_updated') setSyncQueue(data || []);
      if (event === 'config_updated') setConfig(data || db.getConfig());
      if (event === 'network_change') setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    });
    return unsub;
  }, []);

  const pendingCount = syncQueue.length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Izquierda: Nombre del negocio + Píldoras discretas de estado */}
          <div className="flex items-center space-x-3 min-w-0">
            {/* Logo o Isotipo Verde Esmeralda */}
            <button
              type="button"
              onClick={onShowSplash}
              className="w-9 h-9 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm flex-shrink-0 transition-transform active:scale-95"
              title="Ver portada de bienvenida EzBuy+"
            >
              <Store className="w-5 h-5 stroke-[2.2]" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight truncate">
                  {config.business_name || 'Bodega "La Primera"'}
                </h1>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full border border-emerald-200 hidden sm:inline">
                  EzBuy+
                </span>
              </div>

              {/* Indicadores discretos: Online / Pistola Lista */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                <span className="inline-flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  <span className="font-medium text-[10px] text-slate-600">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </span>

                <span className="text-slate-300">•</span>

                <span className={`inline-flex items-center space-x-1 ${isScanningPulse ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  <Zap className={`w-3 h-3 ${isScanningPulse ? 'text-emerald-600 fill-emerald-600 animate-bounce' : 'text-slate-400'}`} />
                  <span className="text-[10px]">
                    {isScanningPulse ? '¡Lectura Láser!' : 'Pistola Lista'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Derecha: Selector de Modo, Bloqueo y Carrito de Compras en Vivo */}
          <div className="flex items-center space-x-2">
            {/* Botón rápido para volver a Portada */}
            <button
              type="button"
              onClick={onShowSplash}
              className="hidden md:flex px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold items-center space-x-1 transition-colors"
              title="Volver a la portada de bienvenida"
            >
              <span>🇵🇪 Portada</span>
            </button>

            {/* Selector de Modo de Dispositivo */}
            <div className="hidden lg:flex bg-slate-100 p-0.5 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setViewMode('auto')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  viewMode === 'auto' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setViewMode('mobile-landscape')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  viewMode === 'mobile-landscape' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Kiosco
              </button>
            </div>

            {/* Candado / PIN Cajero */}
            <button
              type="button"
              onClick={onOpenPinLock}
              className={`p-2 rounded-xl border transition-all ${
                isLocked 
                  ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={isLocked ? 'Caja bloqueada' : 'Bloquear caja con PIN'}
            >
              {isLocked ? <Lock className="w-4 h-4 text-rose-600" /> : <Unlock className="w-4 h-4" />}
            </button>

            {/* Ajustes */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all"
              title="Configuración de tienda, ticketera y SUNAT"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Ícono de Carrito de Compras con Badge Numérico y Monto Acumulado */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              title="Ver ticket de venta actual"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-mono text-xs hidden sm:inline">
                {formatCurrency(cartTotal)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
