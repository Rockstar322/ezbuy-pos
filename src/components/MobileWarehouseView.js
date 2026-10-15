'use client';

import { useState } from 'react';

export default function MobileWarehouseView({
  products = [],
  onUpdateStock,
  onOpenSeparar,
  onBackToStore
}) {
  const [mobileSearch, setMobileSearch] = useState('');
  const [soloBajo, setSoloBajo] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const [kardexHistorial, setKardexHistorial] = useState([
    { id: 1, hora: '19:42', producto: 'Tubo PVC 1/2" Pavco', delta: '+25 varillas', tipo: 'entrada', motivo: 'Llegada proveedor Pavco' },
    { id: 2, hora: '19:15', producto: 'Cemento Sol 42.5kg', delta: '-10 bolsas', tipo: 'salida', motivo: 'Despacho a obra' },
    { id: 3, hora: '18:50', producto: 'Tubo PVC 3/4" Pavco', delta: '-5 varillas', tipo: 'reserva', motivo: 'Separado por llamada cliente' }
  ]);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const filteredProducts = products.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(mobileSearch.toLowerCase()) ||
                        p.codigoBarra.toLowerCase().includes(mobileSearch.toLowerCase());
    const matchBajo = soloBajo ? (p.stock <= (p.stockMinimo || 10)) : true;
    return matchSearch && matchBajo;
  });

  const handleStockChange = (prod, delta) => {
    const nuevoStock = Math.max(0, prod.stock + delta);
    onUpdateStock(prod.id, nuevoStock);

    const nuevoMovimiento = {
      id: kardexHistorial.length > 0 ? (kardexHistorial[0].id + 1) : 1,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      producto: prod.nombre,
      delta: `${delta > 0 ? '+' : ''}${delta} ${prod.unidadMedida}s`,
      tipo: delta > 0 ? 'entrada' : 'salida',
      motivo: delta > 0 ? 'Ingreso rápido almacén' : 'Ajuste / Venta mostrador'
    };
    setKardexHistorial([nuevoMovimiento, ...kardexHistorial.slice(0, 15)]);

    setFeedbackMsg(`✓ Stock de ${prod.nombre} actualizado: ${nuevoStock} ${prod.unidadMedida}s`);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const simularEscaneo = () => {
    setEscaneando(true);
    setTimeout(() => {
      setEscaneando(false);
      // Simula escanear TUB-PVC-001
      setMobileSearch('TUB-PVC-001');
      setFeedbackMsg('📷 Código de barra detectado: TUB-PVC-001');
      setTimeout(() => setFeedbackMsg(''), 2500);
    }, 1200);
  };

  return (
    <div style={{ padding: '24px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Navigation Bar back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={onBackToStore} className="btn btn-secondary btn-sm">
            ← Volver a la Tienda Pública
          </button>
          <span className="badge badge-orange">
            📱 Modo Smartphone Almacén (PWA)
          </span>
        </div>

        {/* Smartphone Simulated Frame Container */}
        <div style={{
          backgroundColor: '#0a0f1d',
          borderRadius: '36px',
          border: '3px solid #1e293b',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '740px'
        }}>
          {/* Smartphone Status Bar */}
          <div style={{
            backgroundColor: '#070b14',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span>19:45</span>
            <div style={{
              width: '120px',
              height: '18px',
              backgroundColor: '#111827',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              color: 'var(--text-muted)'
            }}>
              ● Cámara / Sensor
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span>5G 📶</span>
              <span>100% 🔋</span>
            </div>
          </div>

          {/* App Header */}
          <div style={{
            padding: '18px 20px',
            backgroundColor: '#0f172a',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                📦
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                  FerrePro Almacén
                </h2>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>👔 Dueño de Tienda</span>
                  <span>•</span>
                  <span style={{ color: '#10b981' }}>🟢 En Línea</span>
                </div>
              </div>
            </div>

            <button
              onClick={simularEscaneo}
              className="btn btn-primary btn-sm"
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}
            >
              <span>{escaneando ? '⏳' : '📷'}</span>
              <span>{escaneando ? 'Leyendo...' : 'Escanear'}</span>
            </button>
          </div>

          {/* Fast Toast Feedback */}
          {feedbackMsg && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.95)',
              color: '#ffffff',
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textAlign: 'center',
              animation: 'fadeIn 0.2s ease'
            }}>
              {feedbackMsg}
            </div>
          )}

          {/* Search & Filter Bar */}
          <div style={{ padding: '14px 20px', backgroundColor: '#0b1222', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
              <input
                type="text"
                placeholder="Buscar SKU, código o nombre en almacén..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem', borderRadius: '10px' }}
              />
              {mobileSearch && (
                <button
                  onClick={() => setMobileSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSoloBajo(false)}
                className={!soloBajo ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ flex: 1, padding: '6px', fontSize: '0.78rem' }}
              >
                Todos ({products.length})
              </button>
              <button
                onClick={() => setSoloBajo(true)}
                className={soloBajo ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ flex: 1, padding: '6px', fontSize: '0.78rem' }}
              >
                ⚠️ Stock Bajo ({products.filter(p => p.stock <= (p.stockMinimo || 10)).length})
              </button>
            </div>
          </div>

          {/* Product Items List with Big Touch Buttons */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: 'rgba(20, 29, 48, 0.85)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Product Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      SKU: {prod.codigoBarra}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>
                      {prod.nombre}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>
                      S/ {prod.precio.toFixed(2)} por {prod.unidadMedida}
                    </span>
                  </div>

                  {/* Stock Quantity Highlight */}
                  <div style={{
                    textAlign: 'center',
                    backgroundColor: prod.stock <= (prod.stockMinimo || 10) ? 'rgba(234, 88, 12, 0.25)' : 'rgba(16, 185, 129, 0.2)',
                    padding: '6px 14px',
                    borderRadius: '12px',
                    border: prod.stock <= (prod.stockMinimo || 10) ? '1px solid rgba(234, 88, 12, 0.5)' : '1px solid rgba(16, 185, 129, 0.4)'
                  }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      {prod.stock}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {prod.unidadMedida}s
                    </div>
                  </div>
                </div>

                {/* Tactile Adjuster Buttons for Warehouse Hand Use */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '6px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <button
                    onClick={() => handleStockChange(prod, -5)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 2px', fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}
                    title="Restar 5 unidades"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleStockChange(prod, -1)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 2px', fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}
                    title="Restar 1 unidad"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => handleStockChange(prod, 1)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 2px', fontSize: '0.78rem', fontWeight: 700, color: '#4ade80' }}
                    title="Sumar 1 unidad"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleStockChange(prod, 5)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 2px', fontSize: '0.78rem', fontWeight: 700, color: '#4ade80' }}
                    title="Sumar 5 unidades"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleStockChange(prod, 10)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 2px', fontSize: '0.78rem', fontWeight: 700, color: '#4ade80' }}
                    title="Sumar 10 unidades"
                  >
                    +10
                  </button>
                </div>

                {/* Quick Phone Hold Action */}
                <button
                  onClick={() => onOpenSeparar(prod)}
                  className="btn btn-outline-orange btn-sm"
                  style={{ width: '100%', fontSize: '0.78rem', padding: '6px' }}
                >
                  <span>📞 Separar Stock para Llamada de Cliente</span>
                </button>
              </div>
            ))}
          </div>

          {/* Real-time Kardex Movement Strip */}
          <div style={{
            backgroundColor: '#070b14',
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                📋 Kardex en Vivo (Movimientos Recientes)
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                Sincronizado
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto' }}>
              {kardexHistorial.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255,255,255,0.02)'
                  }}
                >
                  <span>
                    <strong style={{ color: '#fff' }}>{item.hora}</strong> • {item.producto}
                  </span>
                  <strong style={{ color: item.tipo === 'entrada' ? '#4ade80' : '#f87171' }}>
                    {item.delta}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
