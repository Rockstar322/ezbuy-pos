'use client';

import { useState } from 'react';

export default function SepararModal({
  product,
  allProducts = [],
  isOpen,
  onClose,
  onConfirmSeparacion
}) {
  const [selectedProdId, setSelectedProdId] = useState(product?.id || allProducts[0]?.id || '');
  const [cantidad, setCantidad] = useState(5); // Default to 5 varillas like user's example!
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [tiempoReserva, setTiempoReserva] = useState('24h');
  const [nota, setNota] = useState('');
  const [reservaCreada, setReservaCreada] = useState(null);

  if (!isOpen) return null;

  const currentProduct = product || allProducts.find(p => p.id === selectedProdId) || allProducts[0];
  const maxStock = currentProduct ? currentProduct.stock : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProduct || cantidad <= 0 || !clienteNombre.trim()) return;

    const codigoReserva = `SEP-${Math.floor(1000 + Math.random() * 9000)}`;
    const reserva = {
      codigo: codigoReserva,
      producto: currentProduct,
      cantidad: Number(cantidad),
      clienteNombre: clienteNombre.trim(),
      clienteTelefono: clienteTelefono.trim() || '987 000 000',
      tiempoReserva,
      nota: nota.trim(),
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalEstimado: (currentProduct.precio * Number(cantidad)).toFixed(2)
    };

    onConfirmSeparacion(reserva);
    setReservaCreada(reserva);
  };

  const handleResetAndClose = () => {
    setReservaCreada(null);
    setClienteNombre('');
    setClienteTelefono('');
    setNota('');
    onClose();
  };

  const whatsappMessage = reservaCreada
    ? encodeURIComponent(
        `Hola ${reservaCreada.clienteNombre}! 🛠️ Te confirmamos que hemos SEPARADO ${reservaCreada.cantidad} ${reservaCreada.producto.unidadMedida}(s) de "${reservaCreada.producto.nombre}" en Ferretería El Maestro.\n\n` +
        `🔖 Código de Reserva: ${reservaCreada.codigo}\n` +
        `💰 Total a pagar: S/ ${reservaCreada.totalEstimado}\n` +
        `⏳ Tiempo de reserva: ${reservaCreada.tiempoReserva === '24h' ? '24 Horas' : 'Hasta el fin del día'}\n\n` +
        `Te esperamos en tienda o avísanos si deseas despacho a obra.`
      )
    : '';

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '1.6rem',
              backgroundColor: 'rgba(249, 115, 22, 0.15)',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              📞
            </span>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Separar Stock Express
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Reserva mercadería al instante por llamada telefónica o WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '36px', height: '36px' }}
          >
            ✕
          </button>
        </div>

        {!reservaCreada ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Case: Product selector if not predefined */}
            {!product && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Seleccionar Producto a Separar
                </label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="input-field"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} — Stock: {p.stock} {p.unidadMedida}s (S/ {p.precio.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product summary pill */}
            {currentProduct && (
              <div style={{
                padding: '14px 16px',
                backgroundColor: 'rgba(20, 29, 48, 0.8)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    {currentProduct.nombre}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    SKU: {currentProduct.codigoBarra} • Precio: S/ {currentProduct.precio.toFixed(2)} c/u
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-green">
                    {currentProduct.stock} {currentProduct.unidadMedida}s disponibles
                  </span>
                </div>
              </div>
            )}

            {/* Quantity Stepper & Quick preset pills */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Cantidad a Separar ({currentProduct?.unidadMedida}s)
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Subtotal: <strong style={{ color: 'var(--primary)' }}>S/ {((currentProduct?.precio || 0) * cantidad).toFixed(2)}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="btn btn-secondary btn-icon"
                  style={{ width: '42px', height: '42px', fontSize: '1.2rem' }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxStock}
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.min(maxStock, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="input-field"
                  style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, width: '100px' }}
                />
                <button
                  type="button"
                  onClick={() => setCantidad(Math.min(maxStock, cantidad + 1))}
                  className="btn btn-secondary btn-icon"
                  style={{ width: '42px', height: '42px', fontSize: '1.2rem' }}
                >
                  +
                </button>

                {/* Quick Shortcuts */}
                <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                  {[2, 5, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCantidad(Math.min(maxStock, num))}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    >
                      {num} {currentProduct?.unidadMedida === 'varilla' ? 'var' : 'u'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Nombre del Cliente / Maestro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez (Gasfitero)"
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="Ej. 987 654 321"
                  value={clienteTelefono}
                  onChange={(e) => setClienteTelefono(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Time limit & Note */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Plazo de Reserva
                </label>
                <select
                  value={tiempoReserva}
                  onChange={(e) => setTiempoReserva(e.target.value)}
                  className="input-field"
                >
                  <option value="6h">Hasta hoy 6:00 PM (6 Horas)</option>
                  <option value="24h">24 Horas (Recomendado)</option>
                  <option value="48h">48 Horas (Obras en marcha)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Nota / Ubicación de Entrega
                </label>
                <input
                  type="text"
                  placeholder="Ej. Pasa a recoger o enviar a Av. Sol 420"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '10px'
            }}>
              <button type="button" onClick={handleResetAndClose} className="btn btn-secondary">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!clienteNombre.trim() || cantidad <= 0}
                className="btn btn-primary"
                style={{ padding: '12px 24px' }}
              >
                <span>✅ Confirmar Separación de Stock</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation / Ticket Screen */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid rgba(16, 185, 129, 0.4)'
            }}>
              ✓
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              ¡Stock Separado con Éxito!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              El inventario ha sido reservado y descontado temporalmente del catálogo público.
            </p>

            {/* Printable/Shareable Card */}
            <div style={{
              backgroundColor: 'rgba(20, 29, 48, 0.95)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-medium)',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CÓDIGO DE RESERVA</span>
                <span className="badge badge-orange" style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {reservaCreada.codigo}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>PRODUCTO</span>
                  <strong style={{ color: '#ffffff' }}>{reservaCreada.producto.nombre}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>CANTIDAD SEPARADA</span>
                  <strong style={{ color: 'var(--primary)' }}>{reservaCreada.cantidad} {reservaCreada.producto.unidadMedida}(s)</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>CLIENTE</span>
                  <span style={{ color: '#ffffff' }}>{reservaCreada.clienteNombre}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>TOTAL ESTIMADO</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>S/ {reservaCreada.totalEstimado}</span>
                </div>
              </div>
            </div>

            {/* Actions: Send WhatsApp & Finish */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                  fontSize: '0.95rem'
                }}
              >
                <span>💬 Enviar Confirmación por WhatsApp al Cliente</span>
              </a>

              <button onClick={handleResetAndClose} className="btn btn-secondary">
                Cerrar y Volver al Catálogo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
