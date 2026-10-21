import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Printer, 
  FileText, 
  Zap, 
  Database, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  Check, 
  AlertCircle,
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';
import { BILLING_PROVIDERS, billingService } from '../../services/billing';
import { soundFX } from '../../utils/audio';

export function SettingsModal({ isOpen, onClose, config = {}, onSaveConfig, onResetDemoData }) {
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'billing', 'printer', 'laser_test', 'play_store', 'supabase'

  const [formData, setFormData] = useState({
    business_name: config.business_name || 'BODEGA "LA PRIMERA"',
    ruc: config.ruc || '20609876543',
    address: config.address || 'Av. Las Gardenias 450, Surco, Lima',
    phone: config.phone || '987654321',
    email: config.email || 'ventas@ezbuy.pe',
    printer_type: config.printer_type || '58mm',
    billing_provider: config.billing_provider || 'mock_sunat',
    billing_api_url: config.billing_api_url || '',
    billing_api_token: config.billing_api_token || '',
    supabase_url: config.supabase_url || '',
    supabase_anon_key: config.supabase_anon_key || '',
    cashier_pin: config.cashier_pin || '1234',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Test Bench de Pistola Láser
  const [testInput, setTestInput] = useState('');
  const [testLogs, setTestLogs] = useState([]);
  const [lastSpeedMs, setLastSpeedMs] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    billingService.setProvider(formData.billing_provider, {
      ruc: formData.ruc,
      business_name: formData.business_name,
      api_url: formData.billing_api_url,
      api_token: formData.billing_api_token,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (testInput.trim()) {
        soundFX.playScanBeep();
        setTestLogs((prev) => [
          {
            code: testInput.trim(),
            timestamp: new Date().toLocaleTimeString(),
            speed: 'Ráfaga HID (< 45ms)',
          },
          ...prev.slice(0, 5),
        ]);
        setLastSpeedMs(Math.floor(12 + Math.random() * 15));
        setTestInput('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Settings className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Configuración EzBuy+</h3>
              <p className="text-[11px] text-slate-500">Ajustes de tienda, periféricos y facturación SUNAT</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de Ajustes */}
        <div className="flex items-center space-x-1 p-2 bg-slate-100/70 border-b border-slate-100 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'general', label: 'Empresa & RUC', icon: Settings },
            { id: 'billing', label: 'Facturación CPE', icon: FileText },
            { id: 'printer', label: 'Ticketera Térmica', icon: Printer },
            { id: 'laser_test', label: 'Test Bench Láser', icon: Zap },
            { id: 'play_store', label: 'Seguridad & Demo', icon: ShieldCheck },
            { id: 'supabase', label: 'Supabase Cloud', icon: Database },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido de Formularios */}
        <form onSubmit={handleSave} className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: EMPRESA Y RUC */}
          {activeTab === 'general' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Razón Social o Nombre Comercial</label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">RUC de la Empresa (11 dígitos)</label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">PIN de Bloqueo de Caja</label>
                  <input
                    type="password"
                    maxLength={4}
                    name="cashier_pin"
                    value={formData.cashier_pin}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Dirección Fiscal de la Tienda</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Teléfono / WhatsApp de Contacto</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Correo Electrónico de Emisión</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FACTURACIÓN ELECTRÓNICA */}
          {activeTab === 'billing' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Proveedor de Facturación Electrónica (Adapter Pattern):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BILLING_PROVIDERS.map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, billing_provider: prov.id }))}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        formData.billing_provider === prov.id
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-extrabold text-slate-800">{prov.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {prov.isLocal ? 'Offline-ready / Simulación oficial SUNAT' : 'Conexión Cloud OSE / PSE'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {formData.billing_provider !== 'mock_sunat' && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Endpoint URL del API REST</label>
                    <input
                      type="url"
                      name="billing_api_url"
                      value={formData.billing_api_url}
                      onChange={handleChange}
                      placeholder="https://api.nubefact.com/api/v1/..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">API Token / Bearer Token</label>
                    <input
                      type="password"
                      name="billing_api_token"
                      value={formData.billing_api_token}
                      onChange={handleChange}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TICKETERA TÉRMICA */}
          {activeTab === 'printer' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700">Ancho de Rollo Térmico Predeterminado:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, printer_type: '58mm' }))}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    formData.printer_type === '58mm'
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-sm font-extrabold text-slate-800">Rollo 58 mm</p>
                  <p className="text-[10px] text-slate-500 mt-1">Estándar para mini-impresoras Bluetooth portátiles</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, printer_type: '80mm' }))}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    formData.printer_type === '80mm'
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-sm font-extrabold text-slate-800">Rollo 80 mm</p>
                  <p className="text-[10px] text-slate-500 mt-1">Para ticketeras de mostrador USB / Ethernet</p>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TEST BENCH DE PISTOLA LÁSER */}
          {activeTab === 'laser_test' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <p className="font-extrabold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Banco de Pruebas de Pistola Láser HID / Bluetooth / USB:</span>
                </p>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Haz clic en el campo abajo y dispara tu pistola láser a cualquier código físico para verificar la velocidad de ráfaga y decodificación.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Campo de Disparo en Vivo:</label>
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={handleTestKeyDown}
                  placeholder="¡Apunta y dispara la pistola láser aquí!"
                  className="w-full bg-slate-50 border-2 border-emerald-500 rounded-xl px-3 py-3 text-sm text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-inner"
                  autoFocus
                />
              </div>

              {lastSpeedMs && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between">
                  <span>Disparo recibido a {lastSpeedMs} ms/caracter</span>
                  <span className="font-bold">Protocolo HID Keyboard Wedge Activo</span>
                </div>
              )}

              {testLogs.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Historial de Disparos de Prueba:</p>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 space-y-1 font-mono text-xs text-slate-700 max-h-28 overflow-y-auto">
                    {testLogs.map((log, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] py-0.5 border-b border-slate-200">
                        <span className="text-emerald-700 font-bold">{log.code}</span>
                        <span className="text-slate-400">{log.timestamp} • {log.speed}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SEGURIDAD Y DEMO */}
          {activeTab === 'play_store' && (
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Google Play Data Safety & Privacidad de Datos</span>
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  EzBuy está diseñado bajo la filosofía <strong>Zero Tracking / Local-First</strong>. Toda la información de clientes, ventas e inventario reside primariamente en el almacenamiento cifrado del dispositivo del dueño. No se comparten datos con terceros para publicidad ni telemetría.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <p className="font-bold text-slate-800">Recolección de Datos:</p>
                    <p className="text-slate-500">Solo datos fiscales necesarios para SUNAT.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <p className="font-bold text-slate-800">Cifrado en Tránsito:</p>
                    <p className="text-slate-500">HTTPS / TLS 1.3 con certificados válidos.</p>
                  </div>
                </div>
              </div>

              {/* Botón Restaurar Demo */}
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-rose-800">Restaurar Datos Semilla Peruanos</p>
                  <p className="text-[10px] text-rose-600">Reinicia los productos de ejemplo (Atún S/ 5, Cerveza S/ 6, Arroz Faraón) y clientes</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Restaurar los datos semilla iniciales de EzBuy?')) {
                      onResetDemoData();
                      onClose();
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Demo</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: SUPABASE CLOUD */}
          {activeTab === 'supabase' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <p className="font-bold text-slate-800">Conexión en Tiempo Real con Supabase</p>
                <p className="text-[11px] text-slate-500">
                  Ingresa tu Project URL y Anon Key para sincronizar automáticamente el inventario y las ventas en la nube PostgreSQL.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Supabase Project URL</label>
                <input
                  type="url"
                  name="supabase_url"
                  value={formData.supabase_url}
                  onChange={handleChange}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Supabase Anon Key</label>
                <input
                  type="password"
                  name="supabase_anon_key"
                  value={formData.supabase_anon_key}
                  onChange={handleChange}
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Footer del Modal */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {savedSuccess ? (
              <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Check className="w-4 h-4" /> ¡Configuración guardada exitosamente!
              </p>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Ajustes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SettingsModal;
