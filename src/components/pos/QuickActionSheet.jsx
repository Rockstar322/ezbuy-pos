import React from 'react';
import { X, Scale, Camera, Edit3, PackageCheck, Zap } from 'lucide-react';

export function QuickActionSheet({
  isOpen,
  onClose,
  onOpenGranel,
  onOpenManual,
  onOpenCamera,
  onOpenStockReception,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3 animate-slideUp">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Zap className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">Acciones Rápidas</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {/* Opción 1: Venta a Granel */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenGranel();
            }}
            className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center space-x-3 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Scale className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-950">Venta a Granel / Peso</p>
              <p className="text-[11px] text-emerald-700">Arroz por 1/4, 1/2, 1 kg o importe en Soles</p>
            </div>
          </button>

          {/* Opción 2: Escanear con Cámara */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCamera();
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center space-x-3 text-left transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-800">Escanear Código de Fábrica</p>
              <p className="text-[11px] text-slate-500">Apunta la cámara al empaque sin ticketar</p>
            </div>
          </button>

          {/* Opción 3: Ingreso Manual Exprés */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenManual();
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center space-x-3 text-left transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <Edit3 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-800">Ingreso Manual Exprés</p>
              <p className="text-[11px] text-slate-500">Cobrar un producto sin código ni registro previo</p>
            </div>
          </button>

          {/* Opción 4: Recepción de Mercadería */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenStockReception();
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center space-x-3 text-left transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
              <PackageCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-800">Recepción de Mercadería</p>
              <p className="text-[11px] text-slate-500">Disparar pistola láser para reabastecer stock</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
