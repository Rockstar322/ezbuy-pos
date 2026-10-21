import { useEffect, useRef, useState, useCallback } from 'react';
import { soundFX } from '../utils/audio';

/**
 * Hook de escaneo de alta velocidad para Pistola Láser HID (USB OTG / Bluetooth / PDA)
 * Detecta ráfagas de pulsaciones de teclas terminadas en 'Enter' con intervalo < 65ms
 */
export function useBarcodeScanner({ onScan, enabled = true, minLength = 3, maxInterval = 65 }) {
  const [lastScanned, setLastScanned] = useState(null);
  const [isLaserActive, setIsLaserActive] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(false);

  const bufferRef = useRef([]);
  const lastKeyTimeRef = useRef(0);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const triggerScanSuccess = useCallback((code) => {
    const cleanCode = code.trim();
    if (cleanCode.length >= minLength) {
      soundFX.playScanBeep();
      setLastScanned({
        code: cleanCode,
        timestamp: Date.now(),
      });
      setIsScanningActive(true);
      setTimeout(() => setIsScanningActive(false), 300);

      if (onScanRef.current) {
        onScanRef.current(cleanCode);
      }
    }
  }, [minLength]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Si el usuario está escribiendo intencionalmente en un textarea o input de texto común,
      // evitamos capturar el Enter a menos que sea una ráfaga súper rápida de pistola láser
      const activeTag = document.activeElement?.tagName;
      const isInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA';
      
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      // Si ha pasado mucho tiempo desde la última tecla y no es el primer caracter, reiniciar buffer
      if (timeDiff > maxInterval && bufferRef.current.length > 0) {
        bufferRef.current = [];
      }

      if (e.key === 'Enter') {
        if (bufferRef.current.length >= minLength) {
          const barcode = bufferRef.current.join('');
          bufferRef.current = [];
          
          // Si estaba en un input normal pero fue una ráfaga láser, evitamos el submit por defecto
          if (isInput) {
            e.preventDefault();
          }
          triggerScanSuccess(barcode);
        } else {
          bufferRef.current = [];
        }
        return;
      }

      // Solo acumulamos caracteres imprimibles (alfanuméricos y guiones comunes en códigos de barra)
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        bufferRef.current.push(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    setIsLaserActive(true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [enabled, maxInterval, minLength, triggerScanSuccess]);

  // Función para simular un disparo láser en 1 clic
  const simulateScan = useCallback((barcode) => {
    triggerScanSuccess(barcode);
  }, [triggerScanSuccess]);

  return {
    lastScanned,
    isLaserActive,
    isScanningActive,
    simulateScan,
  };
}
