import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  X, 
  Camera, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Box, 
  CupSoda, 
  Cookie, 
  Milk, 
  Scale, 
  SwitchCamera, 
  Image as ImageIcon,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { soundFX } from '../../utils/audio';

export function CameraScannerModal({ isOpen, onClose, onScanSuccess, products = [] }) {
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scannedCodeFeedback, setScannedCodeFeedback] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(null);

  const html5QrCodeRef = useRef(null);
  const isClosingRef = useRef(false);
  const fileInputRef = useRef(null);

  const isSecure = typeof window !== 'undefined' 
    ? (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    : true;

  // Cierre 100% seguro sin lanzar excepciones sincrónicas que cuelguen React
  const handleSafeClose = useCallback(async () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    try {
      if (html5QrCodeRef.current) {
        const state = html5QrCodeRef.current.getState?.();
        // 2 = SCANNING, 3 = PAUSED
        if (state === 2 || state === 3) {
          await html5QrCodeRef.current.stop();
        }
        try {
          html5QrCodeRef.current.clear?.();
        } catch {
          // ignora si el DOM ya cambió
        }
      }
    } catch (err) {
      console.warn('Cierre seguro de cámara:', err);
    } finally {
      html5QrCodeRef.current = null;
      onClose();
    }
  }, [onClose]);

  // Inicializar o cambiar cámara de video
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    isClosingRef.current = false;
    setScannedCodeFeedback(null);
    setPhotoError(null);

    const elementId = 'ezbuy-html5-qr-reader';

    const initScanner = async () => {
      try {
        setCameraError(null);

        // Si no estamos en HTTPS y no es localhost, los navegadores móviles bloquean getUserMedia
        if (!isSecure && !navigator?.mediaDevices?.getUserMedia) {
          setCameraError(
            'Navegador en HTTP local: Chrome y Safari en celulares bloquean el streaming continuo por seguridad. Usa el botón "Tomar Foto con Cámara" para escanear con 1 clic.'
          );
          setScannerActive(false);
          return;
        }

        const formatsToSupport = [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE,
        ];

        // Crear instancia si no existe
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode(elementId, {
            formatsToSupport,
            verbose: false,
          });
        }

        const qrInstance = html5QrCodeRef.current;

        // Intentar obtener lista de cámaras físicas del celular
        let cameras = [];
        try {
          cameras = await Html5Qrcode.getCameras();
          if (isMounted) {
            setAvailableCameras(cameras || []);
          }
        } catch (camErr) {
          console.warn('No se pudieron enumerar cámaras:', camErr);
        }

        // Selección de cámara: preferir la trasera ('back', 'rear', 'trasera', 'environment')
        let cameraIdOrConfig = { facingMode: 'environment' };
        if (cameras && cameras.length > 0) {
          const rearCam = cameras.find((c) =>
            /back|rear|trasera|environment/i.test(c.label)
          );
          const chosen = rearCam || cameras[cameras.length - 1]; // en Android la última suele ser trasera
          if (chosen?.id) {
            cameraIdOrConfig = chosen.id;
          }
        }

        const config = {
          fps: 15,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.333334,
        };

        await qrInstance.start(
          cameraIdOrConfig,
          config,
          (decodedText) => {
            if (isMounted && !isClosingRef.current) {
              soundFX.playScanBeep();
              setScannedCodeFeedback(decodedText);
              setTimeout(() => {
                onScanSuccess(decodedText);
                handleSafeClose();
              }, 450);
            }
          },
          () => {}
        );

        if (isMounted) {
          setScannerActive(true);
        }
      } catch (err) {
        console.warn('No se pudo iniciar el stream de video de la cámara:', err);
        if (isMounted) {
          const msg = String(err?.message || err || '');
          if (msg.includes('Permission') || msg.includes('NotAllowedError')) {
            setCameraError('Permiso denegado: activa el acceso a la cámara en los ajustes de tu navegador.');
          } else {
            setCameraError(
              'No se pudo activar el video en vivo. Puedes usar el botón "Tomar Foto con Cámara" para escanear sin restricciones.'
            );
          }
          setScannerActive(false);
        }
      }
    };

    const timer = setTimeout(() => {
      initScanner();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      try {
        if (html5QrCodeRef.current) {
          const state = html5QrCodeRef.current.getState?.();
          if (state === 2 || state === 3) {
            html5QrCodeRef.current.stop().catch(() => {}).finally(() => {
              try { html5QrCodeRef.current?.clear?.(); } catch {}
            });
          } else {
            try { html5QrCodeRef.current?.clear?.(); } catch {}
          }
        }
      } catch (e) {
        // Ignora silenciosamente para evitar que React desmonte con error
      }
    };
  }, [isOpen, selectedCameraIndex, isSecure, onScanSuccess, handleSafeClose]);

  if (!isOpen) return null;

  // Escaneo instantáneo por foto tomada con la cámara nativa del celular
  const handleFileScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    setPhotoError(null);

    try {
      const formatsToSupport = [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.QR_CODE,
      ];

      // Instancia temporal para procesar el archivo sin interferir con el stream
      const fileScanner = new Html5Qrcode('ezbuy-file-scan-sandbox', {
        formatsToSupport,
        verbose: false,
      });

      const decodedText = await fileScanner.scanFile(file, false);
      if (decodedText) {
        soundFX.playScanBeep();
        setScannedCodeFeedback(decodedText);
        setTimeout(() => {
          onScanSuccess(decodedText);
          handleSafeClose();
        }, 400);
      }
    } catch (err) {
      console.warn('Error al decodificar foto:', err);
      setPhotoError('No se encontró un código de barras nítido en la imagen. Acerca la cámara al código y vuelve a disparar.');
    } finally {
      setIsProcessingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Simulación directa con 1 toque
  const handleSimulatedScan = (barcode) => {
    soundFX.playScanBeep();
    setScannedCodeFeedback(barcode);
    setTimeout(() => {
      onScanSuccess(barcode);
      handleSafeClose();
    }, 300);
  };

  // Alternar entre cámaras si hay más de una
  const handleSwitchCamera = () => {
    if (availableCameras.length > 1) {
      setSelectedCameraIndex((prev) => (prev + 1) % availableCameras.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Camera className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>Escáner de Código de Fábrica</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold">
                  EAN-13 / UPC
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Apunta la cámara al empaque del producto sin ticketar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSafeClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Cerrar escáner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visor de Cámara y Controles */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {/* Advertencia si está en HTTP y no se puede usar video en vivo */}
          {!isSecure && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Navegador en Red Local (HTTP)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                Los celulares exigen HTTPS para activar la transmisión de video continuo. Sin embargo, puedes usar el botón de abajo para <strong>abrir la cámara nativa y tomar la foto del código</strong> al instante.
              </p>
            </div>
          )}

          {/* Área del Visor */}
          <div className="relative w-full h-[220px] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
            {/* Contenedor del video Html5Qrcode */}
            <div id="ezbuy-html5-qr-reader" className="w-full h-full" />
            <div id="ezbuy-file-scan-sandbox" className="hidden" />

            {/* Feedback de Lectura Exitosa */}
            {scannedCodeFeedback && (
              <div className="absolute inset-0 z-30 bg-emerald-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-white animate-bounce" />
                <p className="text-sm font-extrabold tracking-wide">¡Código Detectado!</p>
                <p className="text-xs font-mono bg-black/40 px-3 py-1 rounded-full border border-white/20">
                  {scannedCodeFeedback}
                </p>
              </div>
            )}

            {/* Error o modo sin video en vivo */}
            {cameraError && !scannedCodeFeedback && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-900 z-20 space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300">
                  <Camera className="w-5 h-5" />
                </div>
                <p className="text-xs text-white font-bold">Visor Listo para Fotos</p>
                <p className="text-[11px] text-slate-400 max-w-xs leading-tight">
                  {cameraError}
                </p>
              </div>
            )}

            {/* Retícula de Enfoque con Línea Láser */}
            {!scannedCodeFeedback && !cameraError && (
              <div className="pointer-events-none absolute z-20 w-56 h-36 border-2 border-emerald-500/80 rounded-2xl flex items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1 rounded-tl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1 rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1 rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1 rounded-br"></div>
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-laser"></div>
              </div>
            )}

            {/* Botón de alternar cámara si hay más de una */}
            {availableCameras.length > 1 && !cameraError && (
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="absolute top-2 right-2 z-30 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs transition-colors"
                title="Cambiar entre cámaras del celular"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* BOTÓN PRIMARIO MÓVIL: Tomar foto con la cámara nativa del celular */}
          <div className="space-y-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileScan}
              className="hidden"
              id="ezbuy-camera-file-input"
            />

            <button
              type="button"
              disabled={isProcessingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-extrabold text-xs shadow-lg shadow-emerald-700/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 stroke-[2.2]" />
              <span>
                {isProcessingPhoto ? 'Decodificando código de barra...' : 'Abrir Cámara del Celular / Tomar Foto'}
              </span>
            </button>

            {photoError && (
              <p className="text-[11px] font-bold text-rose-600 text-center animate-shake">
                {photoError}
              </p>
            )}
          </div>

          {/* Acordeón de Productos de Fábrica con Códigos Demo */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                O probar con códigos reales en 1 toque:
              </span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Simulador Express</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Conserva Atún Primor', icon: Box, code: '7750100001234', price: 'S/ 5.00' },
                { label: 'Cerveza Pilsen Lata', icon: CupSoda, code: '7750200005678', price: 'S/ 6.00' },
                { label: 'Galleta Soda San Jorge', icon: Cookie, code: '7750300009012', price: 'S/ 1.50' },
                { label: 'Arroz Faraón Extra 1kg', icon: Scale, code: '7750400003456', price: 'S/ 4.00' },
                { label: 'Leche Gloria Tarro', icon: Milk, code: '7750600001122', price: 'S/ 4.20' },
              ].map((prod) => {
                const Icon = prod.icon;
                return (
                  <button
                    key={prod.code}
                    type="button"
                    onClick={() => handleSimulatedScan(prod.code)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5">
                      <Icon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <p className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-800 truncate">
                        {prod.label}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                      <span className="text-slate-400">{prod.code}</span>
                      <span className="text-emerald-700 font-extrabold">{prod.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraScannerModal;
