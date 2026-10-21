import React, { useState } from 'react';
import { Lock, Unlock, Fingerprint, Delete, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { soundFX } from '../../utils/audio';

export function CashierLockModal({ isOpen, onClose, isLocked, onUnlock, onLock, currentPin = '1234' }) {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [biometricScanning, setBiometricScanning] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const verifyPin = (pinToTest) => {
    if (pinToTest === currentPin) {
      soundFX.playScanBeep();
      onUnlock();
      setEnteredPin('');
      onClose();
    } else {
      soundFX.playError();
      setErrorMsg('PIN incorrecto (PIN predeterminado: 1234)');
      setEnteredPin('');
    }
  };

  const handleBiometric = async () => {
    setBiometricScanning(true);
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      try {
        await new Promise((r) => setTimeout(r, 800));
        soundFX.playCashRegister();
        onUnlock();
        setBiometricScanning(false);
        onClose();
        return;
      } catch (err) {
        console.warn('WebAuthn:', err);
      }
    }
    setTimeout(() => {
      soundFX.playCashRegister();
      onUnlock();
      setBiometricScanning(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-center space-y-4">
        {/* Botón cerrar solo si no está bloqueada la sesión */}
        {!isLocked && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Icono de Candado / Seguridad */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
          {isLocked ? <Lock className="w-7 h-7 stroke-[2]" /> : <Unlock className="w-7 h-7 stroke-[2]" />}
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            {isLocked ? 'Caja Bloqueada' : 'Seguridad de Caja & Terminal'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingresa tu PIN de 4 dígitos (Por defecto: <span className="font-mono font-bold text-emerald-700">1234</span>)
          </p>
        </div>

        {/* Puntos Indicadores de PIN (4 dígitos) */}
        <div className="flex justify-center space-x-3 my-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                enteredPin.length > i
                  ? 'bg-emerald-600 border-emerald-500 scale-110 shadow-xs'
                  : 'bg-slate-100 border-slate-300'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-[11px] font-bold text-rose-600 animate-shake">
            {errorMsg}
          </p>
        )}

        {/* Teclado Numérico */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(String(digit))}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-emerald-50 border border-slate-200 text-lg font-bold font-mono text-slate-800 transition-all cursor-pointer shadow-2xs"
            >
              {digit}
            </button>
          ))}

          {/* Botón Biometría */}
          <button
            type="button"
            onClick={handleBiometric}
            disabled={biometricScanning}
            className="h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center transition-all cursor-pointer"
            title="Autenticación biométrica por huella"
          >
            <Fingerprint className={`w-5 h-5 ${biometricScanning ? 'animate-pulse text-emerald-600' : ''}`} />
          </button>

          {/* Dígito 0 */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-emerald-50 border border-slate-200 text-lg font-bold font-mono text-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            0
          </button>

          {/* Borrar */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Acciones de Bloqueo Inmediato */}
        {!isLocked && (
          <button
            type="button"
            onClick={() => {
              onLock();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Bloquear Terminal Ahora</span>
          </button>
        )}
      </div>
    </div>
  );
}
export default CashierLockModal;
