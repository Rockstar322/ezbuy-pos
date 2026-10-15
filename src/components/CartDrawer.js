'use client';

import { useState } from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [paso, setPaso] = useState('carrito'); // 'carrito' | 'pago' | 'confirmado'
  const [metodoPago, setMetodoPago] = useState('yape'); // 'yape' | 'plin' | 'tarjeta' | 'contra_entrega'
  const [tipoEnvio, setTipoEnvio] = useState('recojo'); // 'recojo' (0) | 'lima' (15) | 'provincia' (25)
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [clienteDireccion, setClienteDireccion] = useState('');
  const [numOperacion, setNumOperacion] = useState('');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '4557 •••• •••• 8912',
    nombre: 'JUAN PEREZ MAESTRO',
    expira: '12/28',
    cvv: '123'
  });
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  if (!isOpen) return null;

  const costoEnvio = tipoEnvio === 'recojo' ? 0 : tipoEnvio === 'lima' ? 15 : 25;
  const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const total = subtotal + costoEnvio;

  const handleProcesarPedido = (e) => {
    e.preventDefault();
    const codigoOrden = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const nuevoPedido = {
      codigo: codigoOrden,
      cliente: clienteNombre || 'Cliente FerrePro',
      telefono: clienteTelefono || '987 654 321',
      direccion: clienteDireccion || 'Entrega en Almacén Central',
      items: [...items],
      subtotal,
      costoEnvio,
      total,
      metodoPago,
      tipoEnvio,
      numOperacion: numOperacion || (metodoPago === 'tarjeta' ? 'CULQI-AUTH-9941' : 'PAG-' + Math.floor(1000 + Math.random() * 9000)),
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPedidoConfirmado(nuevoPedido);
    setPaso('confirmado');
    onClearCart();
  };

  const handleCerrarTodo = () => {
    setPaso('carrito');
    setPedidoConfirmado(null);
    onClose();
  };

  const whatsappConfirmMsg = pedidoConfirmado
    ? encodeURIComponent(
        `Hola Ferretería El Maestro! 🛠️ Acabo de realizar el pedido *${pedidoConfirmado.codigo}* por un total de *S/ ${pedidoConfirmado.total.toFixed(2)}*.\n` +
        `Método de pago: *${pedidoConfirmado.metodoPago.toUpperCase()}*.\n` +
        `Cliente: *${pedidoConfirmado.cliente}* (${pedidoConfirmado.telefono}).\n` +
        `Productos:\n` +
        pedidoConfirmado.items.map(i => `• ${i.cantidad}x ${i.nombre} (S/ ${(i.precio * i.cantidad).toFixed(2)})`).join('\n') +
        `\n\nPor favor confirmar recepción y despacho.`
      )
    : '';

  return (
    <>
      <div className="drawer-overlay" onClick={handleCerrarTodo} />
      <aside className="drawer-panel">
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0b1120'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛒</span>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                {paso === 'carrito' && 'Tu Carrito de Compra'}
                {paso === 'pago' && 'Finalizar Compra & Pago'}
                {paso === 'confirmado' && '¡Pedido Exitoso!'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {items.length} productos agregados
              </span>
            </div>
          </div>
          <button
            onClick={handleCerrarTodo}
            className="btn btn-secondary btn-icon"
            style={{ width: '34px', height: '34px' }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* PASO 1: VISTA DE CARRITO */}
          {paso === 'carrito' && (
            <div>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📦</div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
                    Tu carrito está vacío
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                    Agrega tubos PVC, cemento, herramientas o cables desde el catálogo.
                  </p>
                  <button onClick={onClose} className="btn btn-primary btn-sm">
                    Explorar Productos
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '12px',
                        backgroundColor: 'rgba(20, 29, 48, 0.7)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          backgroundColor: '#1e293b'
                        }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.nombre}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                          S/ {item.precio.toFixed(2)} <span style={{ color: 'var(--text-muted)' }}>/ {item.unidadMedida}</span>
                        </div>

                        {/* Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.cantidad - 1))}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '26px', height: '26px', fontSize: '0.8rem' }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', minWidth: '20px', textAlign: 'center' }}>
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '26px', height: '26px', fontSize: '0.8rem' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                          S/ {(item.precio * item.cantidad).toFixed(2)}
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--danger)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            marginTop: '6px'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Delivery Mode Choice */}
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: 'rgba(20, 29, 48, 0.9)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)'
                  }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: '#ffffff' }}>
                      Tipo de Entrega / Despacho
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: tipoEnvio === 'recojo' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                        border: tipoEnvio === 'recojo' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="envio"
                            checked={tipoEnvio === 'recojo'}
                            onChange={() => setTipoEnvio('recojo')}
                          />
                          <span style={{ fontSize: '0.85rem' }}>🏪 Recojo en Almacén Central</span>
                        </div>
                        <strong style={{ color: '#10b981', fontSize: '0.85rem' }}>GRATIS</strong>
                      </label>

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: tipoEnvio === 'lima' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                        border: tipoEnvio === 'lima' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="envio"
                            checked={tipoEnvio === 'lima'}
                            onChange={() => setTipoEnvio('lima')}
                          />
                          <span style={{ fontSize: '0.85rem' }}>🚚 Despacho a Obra / Domicilio Lima</span>
                        </div>
                        <strong style={{ color: '#ffffff', fontSize: '0.85rem' }}>S/ 15.00</strong>
                      </label>

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: tipoEnvio === 'provincia' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                        border: tipoEnvio === 'provincia' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name="envio"
                            checked={tipoEnvio === 'provincia'}
                            onChange={() => setTipoEnvio('provincia')}
                          />
                          <span style={{ fontSize: '0.85rem' }}>📦 Envío por Agencia a Provincias</span>
                        </div>
                        <strong style={{ color: '#ffffff', fontSize: '0.85rem' }}>S/ 25.00</strong>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: PASARELA DE PAGOS (YAPE, PLIN, CULQI, CONTRA ENTREGA) */}
          {paso === 'pago' && (
            <form onSubmit={handleProcesarPedido} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Client Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  Datos de Contacto y Entrega
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nombre y Apellidos o Razón Social"
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  className="input-field"
                />
                <input
                  type="tel"
                  required
                  placeholder="Teléfono / WhatsApp (ej. 987 654 321)"
                  value={clienteTelefono}
                  onChange={(e) => setClienteTelefono(e.target.value)}
                  className="input-field"
                />
                {tipoEnvio !== 'recojo' && (
                  <input
                    type="text"
                    required
                    placeholder="Dirección exacta de entrega o Agencia de destino"
                    value={clienteDireccion}
                    onChange={(e) => setClienteDireccion(e.target.value)}
                    className="input-field"
                  />
                )}
              </div>

              {/* Payment Methods Selector (Peruvian Gateways) */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Selecciona Método de Pago 🇵🇪
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setMetodoPago('yape')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: metodoPago === 'yape' ? '2px solid #7c3aed' : '1px solid var(--border-subtle)',
                      backgroundColor: metodoPago === 'yape' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(20, 29, 48, 0.7)',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>🟣 Yape</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('plin')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: metodoPago === 'plin' ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                      backgroundColor: metodoPago === 'plin' ? 'rgba(2, 132, 199, 0.2)' : 'rgba(20, 29, 48, 0.7)',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>🔵 Plin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('tarjeta')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: metodoPago === 'tarjeta' ? '2px solid #059669' : '1px solid var(--border-subtle)',
                      backgroundColor: metodoPago === 'tarjeta' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(20, 29, 48, 0.7)',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>💳 Tarjeta Culqi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('contra_entrega')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: metodoPago === 'contra_entrega' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: metodoPago === 'contra_entrega' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(20, 29, 48, 0.7)',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>💵 Contra Entrega</span>
                  </button>
                </div>

                {/* YAPE CARD */}
                {metodoPago === 'yape' && (
                  <div style={{
                    backgroundColor: '#4a154b',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px',
                    border: '1px solid #7c3aed',
                    color: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em' }}>YAPE BCP</span>
                      <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>Sin comisión</span>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      {/* Simulated QR Code */}
                      <div style={{
                        width: '90px',
                        height: '90px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        color: '#4a154b',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                      }}>
                        📱
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>Escanea o yapea al número:</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.04em' }}>
                          987 654 321
                        </div>
                        <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Titular: Ferretería El Maestro S.A.C.</div>
                        <div style={{ fontSize: '0.78rem', marginTop: '4px', color: '#a7f3d0' }}>
                          Monto exacto: <strong>S/ {total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <input
                        type="text"
                        placeholder="N° de Operación Yape (4 últimos dígitos)"
                        value={numOperacion}
                        onChange={(e) => setNumOperacion(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* PLIN CARD */}
                {metodoPago === 'plin' && (
                  <div style={{
                    backgroundColor: '#0369a1',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px',
                    border: '1px solid #38bdf8',
                    color: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em' }}>PLIN BBVA / INTERBANK / SCOTIABANK</span>
                      <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>Sin comisión</span>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        width: '90px',
                        height: '90px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        color: '#0369a1',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                      }}>
                        ⚡
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>Plinea al número celular:</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fef08a' }}>
                          987 654 321
                        </div>
                        <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>Titular: Ferretería El Maestro S.A.C.</div>
                        <div style={{ fontSize: '0.78rem', marginTop: '4px', color: '#bae6fd' }}>
                          Monto total: <strong>S/ {total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <input
                        type="text"
                        placeholder="N° de Operación Plin"
                        value={numOperacion}
                        onChange={(e) => setNumOperacion(e.target.value)}
                        className="input-field"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* TARJETA CULQI CARD */}
                {metodoPago === 'tarjeta' && (
                  <div style={{
                    backgroundColor: 'rgba(20, 29, 48, 0.95)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px',
                    border: '1px solid var(--border-medium)',
                  }}>
                    {/* Visual Card Preview */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                      borderRadius: '12px',
                      padding: '16px',
                      color: '#ffffff',
                      marginBottom: '14px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                        <span>Culqi Checkout Perú</span>
                        <span>VISA / MASTERCARD</span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', margin: '14px 0', letterSpacing: '2px' }}>
                        {datosTarjeta.numero}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <div>{datosTarjeta.nombre}</div>
                        <div>EXP: {datosTarjeta.expira}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Número de Tarjeta (16 dígitos)"
                        value={datosTarjeta.numero}
                        onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })}
                        className="input-field"
                        style={{ fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={datosTarjeta.expira}
                        onChange={(e) => setDatosTarjeta({ ...datosTarjeta, expira: e.target.value })}
                        className="input-field"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                      <input
                        type="password"
                        maxLength="4"
                        placeholder="CVV"
                        value={datosTarjeta.cvv}
                        onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value })}
                        className="input-field"
                        style={{ fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="DNI / RUC del Titular"
                        className="input-field"
                        defaultValue="47890123"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* CONTRA ENTREGA CARD */}
                {metodoPago === 'contra_entrega' && (
                  <div style={{
                    backgroundColor: 'rgba(249, 115, 22, 0.08)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    color: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>💵</span>
                      <strong style={{ color: 'var(--primary)' }}>Pago al Contado o POS al Recibir</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Pagas en efectivo exacto o con tarjeta en nuestro POS móvil cuando el transportista entregue la mercadería en tu obra o almacén.
                    </p>
                  </div>
                )}
              </div>

              {/* Botón enviar pedido */}
              <button
                type="submit"
                disabled={!clienteNombre.trim()}
                className="btn btn-primary"
                style={{ padding: '14px', fontSize: '1rem', marginTop: '8px' }}
              >
                <span>🔒 Confirmar y Pagar S/ {total.toFixed(2)}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaso('carrito')}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                ← Volver al resumen del carrito
              </button>
            </form>
          )}

          {/* PASO 3: CONFIRMACIÓN EXITOSA */}
          {paso === 'confirmado' && pedidoConfirmado && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                fontSize: '2.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '2px solid rgba(16, 185, 129, 0.5)'
              }}>
                ✓
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                ¡Pedido Registrado con Éxito!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Tu orden ha sido ingresada al sistema de despacho de Ferretería El Maestro.
              </p>

              {/* Voucher Card */}
              <div style={{
                backgroundColor: 'rgba(20, 29, 48, 0.95)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-medium)',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>CÓDIGO DE ORDEN</span>
                  <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{pedidoConfirmado.codigo}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Cliente: </span>
                    <strong style={{ color: '#fff' }}>{pedidoConfirmado.cliente}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Método de Pago: </span>
                    <span className="badge badge-orange">{pedidoConfirmado.metodoPago.toUpperCase()}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Monto Total: </span>
                    <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>S/ {pedidoConfirmado.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={`https://wa.me/51987654321?text=${whatsappConfirmMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                    padding: '12px'
                  }}
                >
                  <span>💬 Enviar Comprobante por WhatsApp</span>
                </a>

                <button onClick={handleCerrarTodo} className="btn btn-secondary">
                  Seguir Comprando
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer (Sticky Summary) */}
        {paso === 'carrito' && items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            backgroundColor: '#0b1120',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal productos:</span>
              <span style={{ color: '#ffffff' }}>S/ {subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Despacho / Entrega:</span>
              <span style={{ color: costoEnvio === 0 ? '#10b981' : '#ffffff' }}>
                {costoEnvio === 0 ? 'GRATIS' : `S/ ${costoEnvio.toFixed(2)}`}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>TOTAL A PAGAR:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                S/ {total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setPaso('pago')}
              className="btn btn-primary"
              style={{ padding: '14px', fontSize: '1rem', width: '100%' }}
            >
              <span>Continuar al Pago 🇵🇪 (Yape / Plin / Tarjeta)</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
