'use client';

export default function Hero({ onExploreCatalog, onOpenMobileMode, onOpenSepararGeneral }) {
  return (
    <section style={{
      position: 'relative',
      padding: '48px 0 32px 0',
      overflow: 'hidden',
    }}>
      <div className="container">
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(20, 30, 52, 0.95) 0%, rgba(10, 16, 28, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '44px 36px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          {/* Subtle background industrial pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '45%',
            height: '100%',
            opacity: 0.12,
            backgroundImage: 'radial-gradient(#f97316 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Left Column: Headline and Call to action */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="badge badge-orange">
                  ⚡ Stock Actualizado en Tiempo Real
                </span>
                <span className="badge badge-cyan">
                  🇵🇪 Factura & Guía Electrónica
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                marginBottom: '18px',
                color: '#ffffff'
              }}>
                Distribuidora Ferretera <br />
                <span className="gradient-text-orange">El Maestro Pro</span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '540px',
                marginBottom: '28px'
              }}>
                Abastecemos tu obra, taller y proyectos de gasfitería, electricidad y construcción. Precios competitivos por mayor y menor con despacho el mismo día en Lima y provincias.
              </p>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={onExploreCatalog}
                  className="btn btn-primary"
                  style={{ padding: '14px 26px', fontSize: '1rem' }}
                >
                  <span>📦 Explorar Catálogo</span>
                </button>

                <button
                  onClick={onOpenSepararGeneral}
                  className="btn btn-outline-orange"
                  style={{ padding: '13px 22px', fontSize: '0.95rem' }}
                >
                  <span>📞 Separar Stock Express</span>
                </button>

                <button
                  onClick={onOpenMobileMode}
                  className="btn btn-secondary"
                  style={{ padding: '13px 20px', fontSize: '0.95rem' }}
                >
                  <span>📱 Modo Almacén Móvil</span>
                </button>
              </div>

              {/* Supported Peruvian Payment icons */}
              <div style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                flexWrap: 'wrap',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Pagos inmediatos:</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ background: '#7c3aed', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>YAPE</span>
                  <span style={{ background: '#0284c7', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>PLIN</span>
                  <span style={{ background: '#059669', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>CULQI TARJETAS</span>
                  <span style={{ background: '#334155', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>CONTRA ENTREGA</span>
                </div>
              </div>
            </div>

            {/* Right Column: Key Value Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚰</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Pavco Wavin</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Varillas de Tubo PVC SAP & Conexiones en stock permanente
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>DeWalt & Makita</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Herramientas eléctricas con garantía de fábrica y servicio
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🧱</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Sol & Aceros</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Cemento Sol Tipo I y Fierro Corrugado Arequipa a pie de obra
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(249, 115, 22, 0.4)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📱</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>Control Móvil</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Actualiza tu stock desde tu smartphone dentro del almacén
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
