'use client';

import { useState } from 'react';

export default function MaestroPanel({
  products = [],
  onBulkAddProducts,
  onBackToStore
}) {
  const [activeSubTab, setActiveSubTab] = useState('carga_masiva'); // 'carga_masiva' | 'guias_pdf' | 'diagnostico'
  const [currentRole, setCurrentRole] = useState('maestro'); // 'maestro' | 'dueno' | 'trabajador'
  const [csvDataPreview, setCsvDataPreview] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [guiaSeleccionada, setGuiaSeleccionada] = useState(null);

  // Ejemplo de lote de productos para simular carga masiva de CSV
  const productosLoteCSV = [
    {
      id: 'csv-001',
      codigoBarra: 'TUB-PVC-901',
      nombre: 'Tubo PVC Desagüe 4" x 3m Pavco Pesado',
      descripcion: 'Tubería pesada para bajantes sanitarias principales y colectores.',
      categoria: 'tuberia-conexiones',
      categoriaNombre: 'Tubería y Gasfitería',
      precio: 38.00,
      stock: 60,
      stockMinimo: 15,
      unidadMedida: 'varilla',
      marca: 'Pavco Wavin',
      destacado: true,
      tag: 'Carga Masiva',
      imagen: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      ficha: 'NTP 399.003 | Longitud 3 metros | Diámetro 110mm'
    },
    {
      id: 'csv-002',
      codigoBarra: 'CON-YES-902',
      nombre: 'Yeso Cerámico Bolsa 20kg Pacasmayo',
      descripcion: 'Yeso blanco de alta pureza para remates, molduras y resanes finos.',
      categoria: 'materiales-construccion',
      categoriaNombre: 'Construcción y Cemento',
      precio: 14.50,
      stock: 80,
      stockMinimo: 20,
      unidadMedida: 'bolsa',
      marca: 'Pacasmayo',
      destacado: false,
      tag: 'Carga Masiva',
      imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      ficha: 'Fraguado controlado 15 min | Acabado ultra liso'
    },
    {
      id: 'csv-003',
      codigoBarra: 'ELE-TAB-903',
      nombre: 'Tablero Eléctrico PVC Sobreponer 8 Polos Bticino',
      descripcion: 'Caja para llaves térmicas y diferenciales con puerta transparente ahumada.',
      categoria: 'electricidad',
      categoriaNombre: 'Electricidad e Iluminación',
      precio: 46.00,
      stock: 25,
      stockMinimo: 5,
      unidadMedida: 'unidad',
      marca: 'Bticino',
      destacado: false,
      tag: 'Carga Masiva',
      imagen: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=80',
      ficha: 'Grado protección IP40 | Riel DIN metálico incluido'
    }
  ];

  const handleCargarEjemploCSV = () => {
    setCsvDataPreview(productosLoteCSV);
    setMensajeExito('');
  };

  const handleProcesarCargaMasiva = () => {
    if (!csvDataPreview || csvDataPreview.length === 0) return;
    setCargando(true);
    setTimeout(() => {
      onBulkAddProducts(csvDataPreview);
      setCargando(false);
      setMensajeExito(`🎉 ¡Se procesaron e importaron con éxito ${csvDataPreview.length} productos al catálogo general!`);
      setCsvDataPreview(null);
    }, 1200);
  };

  // Simulación de carga de Guía de Remisión PDF del cliente (Soporte Maestro)
  const guiasEjemplo = [
    {
      id: 'guia-pavco',
      numeroGuia: 'T001-008492',
      proveedor: 'PAVCO WAVIN PERÚ S.A.',
      ruc: '20100142981',
      fechaEmision: '08/10/2026',
      items: [
        { codigo: 'TUB-PVC-001', descripcion: 'Tubo PVC SAP 1/2" x 5m Clase 10', cantidad: 50, unidad: 'varillas' },
        { codigo: 'TUB-PVC-002', descripcion: 'Tubo PVC SAP 3/4" x 5m Clase 10', cantidad: 40, unidad: 'varillas' },
        { codigo: 'TUB-COD-006', descripcion: 'Codo PVC SAP 90 x 1/2" Roscado', cantidad: 100, unidad: 'unidades' }
      ]
    },
    {
      id: 'guia-aceros',
      numeroGuia: 'T003-019442',
      proveedor: 'CORPORACIÓN ACEROS AREQUIPA S.A.',
      ruc: '20370149021',
      fechaEmision: '08/10/2026',
      items: [
        { codigo: 'CON-FIE-002', descripcion: 'Fierro Corrugado 1/2" x 9m Grado 60', cantidad: 80, unidad: 'varillas' },
        { codigo: 'CON-CEM-001', descripcion: 'Cemento Sol Tipo I 42.5kg', cantidad: 120, unidad: 'bolsas' }
      ]
    }
  ];

  const handleProcesarGuiaPDF = (guia) => {
    setCargando(true);
    setTimeout(() => {
      // Inyecta stock al catálogo
      guia.items.forEach(item => {
        const prod = products.find(p => p.codigoBarra === item.codigo);
        if (prod) {
          prod.stock += item.cantidad;
        }
      });
      setCargando(false);
      setMensajeExito(`✅ Guía ${guia.numeroGuia} procesada por el Rol Maestro. Se agregaron ${guia.items.reduce((a, b) => a + b.cantidad, 0)} unidades de mercadería.`);
      setGuiaSeleccionada(null);
    }, 1400);
  };

  return (
    <div style={{ padding: '30px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Navigation & Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <button onClick={onBackToStore} className="btn btn-secondary btn-sm" style={{ marginBottom: '10px' }}>
              ← Volver a la Tienda
            </button>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🛡️ Panel Maestro & Soporte Técnico</span>
              <span className="badge badge-purple">Acceso Privilegiado</span>
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Herramienta exclusiva de desarrollo y gestión para administración, subida de guías de clientes y cargas masivas.
            </p>
          </div>

          {/* Role Matrix Switcher */}
          <div style={{
            backgroundColor: 'rgba(20, 29, 48, 0.9)',
            padding: '6px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '8px', fontWeight: 600 }}>
              Simular Rol:
            </span>
            <button
              onClick={() => setCurrentRole('maestro')}
              className={currentRole === 'maestro' ? 'btn btn-purple btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ fontSize: '0.78rem' }}
            >
              🛡️ Maestro (Nosotros)
            </button>
            <button
              onClick={() => setCurrentRole('dueno')}
              className={currentRole === 'dueno' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ fontSize: '0.78rem' }}
            >
              👔 Dueño
            </button>
            <button
              onClick={() => setCurrentRole('trabajador')}
              className={currentRole === 'trabajador' ? 'btn btn-secondary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ fontSize: '0.78rem', opacity: currentRole === 'trabajador' ? 1 : 0.7 }}
            >
              👷 Trabajador
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {mensajeExito && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            color: '#34d399',
            fontSize: '0.92rem',
            fontWeight: 700,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{mensajeExito}</span>
            <button onClick={() => setMensajeExito('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveSubTab('carga_masiva')}
            className={activeSubTab === 'carga_masiva' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '0.9rem' }}
          >
            <span>📊 Carga Masiva (CSV / Excel)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guias_pdf')}
            className={activeSubTab === 'guias_pdf' ? 'btn btn-purple' : 'btn btn-secondary'}
            style={{ fontSize: '0.9rem' }}
          >
            <span>📄 Subir Guías de Remisión en PDF (Rol Maestro)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('diagnostico')}
            className={activeSubTab === 'diagnostico' ? 'btn btn-cyan' : 'btn btn-secondary'}
            style={{ fontSize: '0.9rem' }}
          >
            <span>🔧 Diagnóstico del Sistema & BD</span>
          </button>
        </div>

        {/* TAB 1: CARGA MASIVA CSV */}
        {activeSubTab === 'carga_masiva' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                Importación y Actualización Masiva de Inventario
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Sube un archivo CSV o Excel exportado por el dueño o proveedor para actualizar precios y cantidades en segundos sin escribir producto por producto.
              </p>
            </div>

            {/* Dropzone Box */}
            <div style={{
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📁</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                Arrastra tu archivo CSV o Excel aquí
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Columnas requeridas: <code style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>codigoBarra, nombre, categoria, precio, stock, unidadMedida</code>
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={handleCargarEjemploCSV}
                  className="btn btn-outline-orange btn-sm"
                >
                  📥 Cargar CSV de Prueba (30 Productos)
                </button>
              </div>
            </div>

            {/* Preview Table */}
            {csvDataPreview && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                    Vista Previa del Archivo ({csvDataPreview.length} registros listos)
                  </h4>
                  <span className="badge badge-green">Formato Válido</span>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem',
                    textAlign: 'left'
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '10px' }}>SKU</th>
                        <th style={{ padding: '10px' }}>Nombre</th>
                        <th style={{ padding: '10px' }}>Categoría</th>
                        <th style={{ padding: '10px' }}>Precio</th>
                        <th style={{ padding: '10px' }}>Stock</th>
                        <th style={{ padding: '10px' }}>Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvDataPreview.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', color: '#ffffff' }}>
                          <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{item.codigoBarra}</td>
                          <td style={{ padding: '10px', fontWeight: 600 }}>{item.nombre}</td>
                          <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{item.categoriaNombre}</td>
                          <td style={{ padding: '10px', color: '#34d399', fontWeight: 700 }}>S/ {item.precio.toFixed(2)}</td>
                          <td style={{ padding: '10px', fontWeight: 800 }}>+{item.stock}</td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{item.unidadMedida}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button onClick={() => setCsvDataPreview(null)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button
                    onClick={handleProcesarCargaMasiva}
                    disabled={cargando}
                    className="btn btn-primary"
                    style={{ padding: '12px 24px' }}
                  >
                    <span>{cargando ? '⏳ Procesando Base de Datos...' : '🚀 Procesar e Incorporar al Inventario'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBIR GUÍAS DE REMISIÓN EN PDF (ROL MAESTRO) */}
        {activeSubTab === 'guias_pdf' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              backgroundColor: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              gap: '14px',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <div>
                <strong style={{ color: '#c084fc', fontSize: '0.95rem' }}>Servicio de Soporte Maestro Activo</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Si el cliente nos envía el PDF de su guía de remisión por WhatsApp en lugar de digitarlo él mismo, el equipo Maestro puede cargarlo directamente aquí para actualizar su stock sin causarle molestias.
                </p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
              Guías de Remisión Electrónicas Recibidas para Procesar:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              {guiasEjemplo.map((guia) => (
                <div
                  key={guia.id}
                  style={{
                    backgroundColor: 'rgba(20, 29, 48, 0.85)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-purple">GUÍA PDF # {guia.numeroGuia}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{guia.fechaEmision}</span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                      {guia.proveedor}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      RUC Emisor: {guia.ruc}
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Ítems detectados en el documento:
                      </div>
                      {guia.items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', padding: '2px 0' }}>
                          <span>• {it.descripcion}</span>
                          <strong style={{ color: 'var(--primary)' }}>+{it.cantidad} {it.unidad}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleProcesarGuiaPDF(guia)}
                    disabled={cargando}
                    className="btn btn-purple"
                    style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                  >
                    <span>🛡️ Validar y Cargar Stock del Cliente</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DIAGNÓSTICO & SERVICIOS */}
        {activeSubTab === 'diagnostico' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
              Estado del Sistema y Conexiones
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: 'rgba(20, 29, 48, 0.8)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>BASE DE DATOS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981' }}>🟢</span>
                  <strong style={{ color: '#ffffff' }}>MongoDB Atlas</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Modelos: Producto, Categoria, Usuario, MovimientoStock
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(20, 29, 48, 0.8)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>MOTOR WEB</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#38bdf8' }}>⚡</span>
                  <strong style={{ color: '#ffffff' }}>Next.js 16 + React 19</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  App Router & Turbopack
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(20, 29, 48, 0.8)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>PASARELAS DE PAGO</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#a855f7' }}>🇵🇪</span>
                  <strong style={{ color: '#ffffff' }}>Yape, Plin, Culqi, Contra Entrega</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  QR Dinámico & Checkout habilitados
                </div>
              </div>
            </div>

            {/* Role Permissions Matrix */}
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                Matriz de Permisos por Rol en Producción
              </h4>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>🛡️ <strong>Maestro:</strong> Acceso total, soporte, reparación, carga PDF, multi-cliente</div>
                <div>👔 <strong>Dueño:</strong> Gestión de productos, stock, compras, carga masiva CSV</div>
                <div>👷 <strong>Trabajador:</strong> Ver stock, despacho rápido, ventas de mostrador</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
