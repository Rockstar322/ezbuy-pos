import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Sparkles, Store, ShieldCheck, Check } from 'lucide-react';

export function SplashScreen({ onEnterPos }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [storeName, setStoreName] = useState('Bodega "La Primera"');
  const [ownerPin, setOwnerPin] = useState('1234');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onEnterPos();
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 text-white flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none">
      {/* Formas Geométricas / Hojas Orgánicas Decorativas en Esquinas */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl"></div>
      <div className="pointer-events-none absolute top-12 right-12 w-48 h-48 rounded-3xl rotate-45 border-2 border-white/15 bg-white/5"></div>
      <div className="pointer-events-none absolute -bottom-28 -left-28 w-96 h-96 rounded-full bg-emerald-900/40 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-16 left-10 w-36 h-36 rounded-full border-2 border-white/15"></div>

      {/* 1. Selector Superior Centrado: Píldora Blanca Bandera de Perú */}
      <header className="relative z-10 w-full flex justify-center pt-2">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white text-slate-800 text-xs font-bold shadow-md shadow-emerald-950/20 border border-white cursor-pointer hover:bg-slate-50 transition-all">
          <span className="text-sm">🇵🇪</span>
          <span>Perú</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </header>

      {/* 2. Centro: Logo Tipográfico Grande EzBuy+ y Subtítulo */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center my-auto py-8">
        {/* Isotipo Circular */}
        <div className="w-20 h-20 rounded-3xl bg-white text-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-950/30 mb-6 border-4 border-white/20 transform hover:scale-105 transition-transform">
          <Store className="w-10 h-10 stroke-[2.2]" />
        </div>

        {/* Marca Tipográfica */}
        <div className="flex items-baseline justify-center space-x-1">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm font-sans">
            EzBuy
          </h1>
          <span className="text-4xl sm:text-5xl font-black text-amber-300 drop-shadow-sm">
            +
          </span>
        </div>

        <p className="text-emerald-100 text-base sm:text-lg font-medium mt-3 max-w-xs sm:max-w-md tracking-wide">
          Tu bodega inteligente, más simple
        </p>

        {/* Badge Sencillo de Confianza */}
        <div className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold border border-white/20">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>Homologado SUNAT • Offline-First</span>
        </div>
      </main>

      {/* 3. Botones Inferiores Full-Width Redondeados */}
      <footer className="relative z-10 w-full max-w-sm mx-auto space-y-3 pb-4">
        {/* Botón 1: Iniciar Sesión en mi Tienda */}
        <button
          type="button"
          onClick={() => setShowLoginModal(true)}
          className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-[0.99] text-emerald-700 font-extrabold text-sm tracking-wide shadow-xl shadow-emerald-950/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <span>Iniciar sesión en mi tienda</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Botón 2: Registrar mi Negocio */}
        <button
          type="button"
          onClick={() => {
            alert('¡Bienvenido! Iniciando asistente rápido de registro para tu bodega en Perú.');
            onEnterPos();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-slate-900 font-extrabold text-sm tracking-wide shadow-lg shadow-amber-900/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Registrar mi negocio</span>
        </button>

        {/* Botón 3: Entrar Directo al POS (Demo Rápida) */}
        <button
          type="button"
          onClick={onEnterPos}
          className="w-full py-3 px-4 rounded-xl bg-transparent hover:bg-white/10 active:scale-[0.99] border border-white/80 text-white font-bold text-xs tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <span>Entrar directo al Punto de Venta (Demo Rápida)</span>
        </button>
      </footer>

      {/* Modal Rápido de Inicio de Sesión */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-slate-800 shadow-2xl border border-slate-100 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Iniciar Sesión</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ingresa a tu terminal de punto de venta</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Nombre de la Tienda</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">PIN de Cajero (Predeterminado: 1234)</label>
                <input
                  type="password"
                  value={ownerPin}
                  onChange={(e) => setOwnerPin(e.target.value)}
                  maxLength={4}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 text-center tracking-widest text-base focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Abrir Tienda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
