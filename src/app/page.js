'use client';

import { useState, useTransition } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CatalogGrid from '@/components/CatalogGrid';
import CatalogCarousel from '@/components/CatalogCarousel';
import CartDrawer from '@/components/CartDrawer';
import SepararModal from '@/components/SepararModal';
import MobileWarehouseView from '@/components/MobileWarehouseView';
import MaestroPanel from '@/components/MaestroPanel';
import CategoryGalleryView from '@/components/CategoryGalleryView';
import ProductTableView from '@/components/ProductTableView';
import CreateProductModal from '@/components/CreateProductModal';
import CreateCategoryModal from '@/components/CreateCategoryModal';
import { CATEGORIAS_DEFAULT, PRODUCTOS_DEFAULT } from '@/lib/catalogoData';

export default function Home() {
  const [activeTab, setActiveTab] = useState('tienda'); // 'tienda' | 'galeria' | 'productos_tabla' | 'almacen' | 'maestro'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'carousel'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [products, setProducts] = useState(PRODUCTOS_DEFAULT);
  const [categories, setCategories] = useState(CATEGORIAS_DEFAULT);

  // Modales de creación / edición manual
  const [createProductModal, setCreateProductModal] = useState({
    isOpen: false,
    initialCategory: '',
    editProduct: null
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState([
    { ...PRODUCTOS_DEFAULT[0], cantidad: 10 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Separar Stock Modal State
  const [separarModal, setSepararModal] = useState({ isOpen: false, product: null });

  // Toast Notification State
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
    showToast(`🛒 "${product.nombre}" agregado al carrito`);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, cantidad: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    showToast('🗑️ Producto retirado del carrito');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Stock update from warehouse or reservation
  const handleUpdateStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  // Reservation confirmed
  const handleConfirmSeparacion = (reserva) => {
    // Deduce el stock reservado
    setProducts((prev) =>
      prev.map((p) =>
        p.id === reserva.producto.id
          ? { ...p, stock: Math.max(0, p.stock - reserva.cantidad) }
          : p
      )
    );
    showToast(`✅ Reserva ${reserva.codigo} registrada. Stock reservado: ${reserva.cantidad} unid.`);
  };

  // Product & Category Management Handlers
  const handleOpenCreateProduct = (categorySlug = '') => {
    setCreateProductModal({
      isOpen: true,
      initialCategory: categorySlug,
      editProduct: null
    });
  };

  const handleEditProduct = (product) => {
    setCreateProductModal({
      isOpen: true,
      initialCategory: product.categoria,
      editProduct: product
    });
  };

  const handleSaveProduct = (productData) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === productData.id);
      if (exists) {
        return prev.map((p) => (p.id === productData.id ? productData : p));
      }
      return [productData, ...prev];
    });
    showToast(`✅ Producto "${productData.nombre}" guardado con éxito`);
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('🗑️ Producto eliminado del catálogo');
  };

  const handleToggleProductActive = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, activo: p.activo === false ? true : false } : p
      )
    );
  };

  const handleSaveCategory = (categoryData) => {
    setCategories((prev) => [...prev, categoryData]);
    showToast(`✅ Categoría "${categoryData.nombre}" creada con éxito`);
  };

  const handleToggleCategoryActive = (categorySlug) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.slug === categorySlug ? { ...c, activa: c.activa === false ? true : false } : c
      )
    );
  };

  // Bulk add from CSV / PDF
  const handleBulkAddProducts = (newProducts) => {
    setProducts((prev) => [...newProducts, ...prev]);
    showToast(`🎉 ¡${newProducts.length} productos agregados al inventario!`);
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigoBarra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoriaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'todos' || p.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div className="toast-notice">
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toast}</span>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categorias={categories}
      />

      {/* MAIN VIEW CONTENT */}
      <main style={{ flex: 1 }}>
        {/* TAB 1: TIENDA PÚBLICA / E-COMMERCE */}
        {activeTab === 'tienda' && (
          <div>
            {/* Hero Section */}
            <Hero
              onExploreCatalog={() => {
                const el = document.getElementById('catalogo-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenMobileMode={() => setActiveTab('almacen')}
              onOpenSepararGeneral={() => setSepararModal({ isOpen: true, product: null })}
            />

            {/* Catalog Section */}
            <section id="catalogo-section" style={{ padding: '30px 0 60px 0' }}>
              <div className="container">
                {/* Section Header with Category Chips */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span className="badge badge-orange">Catálogo en Vivo</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          • Sincronizado con Almacén
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>
                        Productos & Materiales Disponibles
                      </h2>
                    </div>

                    {/* View Switcher Controls */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(20, 29, 48, 0.7)',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Modo de Vista:
                      </span>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                        style={{ padding: '6px 12px' }}
                      >
                        ▦ Cuadrícula
                      </button>
                      <button
                        onClick={() => setViewMode('carousel')}
                        className={viewMode === 'carousel' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                        style={{ padding: '6px 12px' }}
                      >
                        ◫ Carrusel por Categorías
                      </button>
                    </div>
                  </div>

                  {/* Category Pills Scroller */}
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    scrollbarWidth: 'none'
                  }}>
                    <button
                      onClick={() => setSelectedCategory('todos')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-full)',
                        border: selectedCategory === 'todos' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedCategory === 'todos' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(20, 29, 48, 0.6)',
                        color: selectedCategory === 'todos' ? '#fb923c' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      🌟 Todos los Productos ({products.length})
                    </button>

                    {categories.map((cat) => {
                      const count = products.filter(p => p.categoria === cat.slug).length;
                      const isActive = selectedCategory === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.slug)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-full)',
                            border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                            backgroundColor: isActive ? 'rgba(249, 115, 22, 0.2)' : 'rgba(20, 29, 48, 0.6)',
                            color: isActive ? '#fb923c' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span>{cat.icono}</span>
                          <span>{cat.nombre}</span>
                          <span style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            padding: '1px 6px',
                            borderRadius: '10px',
                            fontSize: '0.72rem'
                          }}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ACTIVE CATALOG VIEW (GRID vs CAROUSEL) */}
                {viewMode === 'grid' ? (
                  <CatalogGrid
                    products={filteredProducts}
                    onAddToCart={handleAddToCart}
                    onSepararStock={(product) => setSepararModal({ isOpen: true, product })}
                    selectedCategory={selectedCategory}
                    onResetFilter={() => {
                      setSelectedCategory('todos');
                      setSearchTerm('');
                    }}
                  />
                ) : (
                  <CatalogCarousel
                    products={filteredProducts}
                    categories={selectedCategory === 'todos'
                      ? categories
                      : categories.filter(c => c.slug === selectedCategory)}
                    onAddToCart={handleAddToCart}
                    onSepararStock={(product) => setSepararModal({ isOpen: true, product })}
                    onSelectCategory={setSelectedCategory}
                  />
                )}
              </div>
            </section>
          </div>
        )}

        {/* VISTA 2: GALERÍA VISUAL POR CATEGORÍAS (IMAGEN 1 - DON TITO STYLE) */}
        {activeTab === 'galeria' && (
          <CategoryGalleryView
            products={products}
            categories={categories}
            onOpenCreateProduct={handleOpenCreateProduct}
            onOpenCreateCategory={() => setIsCategoryModalOpen(true)}
            onOpenTableView={() => setActiveTab('productos_tabla')}
            onToggleCategoryActive={handleToggleCategoryActive}
            onToggleProductActive={handleToggleProductActive}
            onEditProduct={handleEditProduct}
            onBackToStore={() => setActiveTab('tienda')}
          />
        )}

        {/* VISTA 3: APARTADO DE PRODUCTOS (IMAGEN 2 - TABLA Y CRUD COMPLETO) */}
        {activeTab === 'productos_tabla' && (
          <ProductTableView
            products={products}
            onOpenCreateProduct={handleOpenCreateProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleProductActive={handleToggleProductActive}
            onOpenGalleryView={() => setActiveTab('galeria')}
            onBackToStore={() => setActiveTab('tienda')}
          />
        )}

        {/* TAB 4: ALMACÉN MÓVIL (PWA SMARTPHONE SIMULATOR) */}
        {activeTab === 'almacen' && (
          <MobileWarehouseView
            products={products}
            onUpdateStock={handleUpdateStock}
            onOpenSeparar={(product) => setSepararModal({ isOpen: true, product })}
            onBackToStore={() => setActiveTab('tienda')}
          />
        )}

        {/* TAB 5: PANEL MAESTRO & CARGA MASIVA */}
        {activeTab === 'maestro' && (
          <MaestroPanel
            products={products}
            onBulkAddProducts={handleBulkAddProducts}
            onBackToStore={() => setActiveTab('tienda')}
          />
        )}
      </main>

      {/* Modal de Ingreso Manual y Edición de Producto */}
      <CreateProductModal
        isOpen={createProductModal.isOpen}
        onClose={() => setCreateProductModal({ isOpen: false, initialCategory: '', editProduct: null })}
        onSaveProduct={handleSaveProduct}
        categories={categories}
        initialCategory={createProductModal.initialCategory}
        editProduct={createProductModal.editProduct}
      />

      {/* Modal de Creación de Categoría */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSaveCategory={handleSaveCategory}
      />

      {/* Slide-Over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Separar Stock Express Modal */}
      <SepararModal
        isOpen={separarModal.isOpen}
        product={separarModal.product}
        allProducts={products}
        onClose={() => setSepararModal({ isOpen: false, product: null })}
        onConfirmSeparacion={handleConfirmSeparacion}
      />

      {/* Professional Peruvian Footer */}
      <footer style={{
        backgroundColor: '#05080e',
        borderTop: '1px solid var(--border-subtle)',
        padding: '48px 0 24px 0',
        marginTop: '60px'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px',
            marginBottom: '36px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>🛠️</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
                  FERRE<span style={{ color: 'var(--primary)' }}>PRO</span> EL MAESTRO
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Tu socio confiable en materiales de construcción, tuberías Pavco, electricidad Indeco y herramientas de potencia con despacho inmediato en Lima y provincias.
              </p>
              <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                RUC: 20608945123 • Ferretería El Maestro S.A.C.
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
                Atención al Cliente
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>📍 Av. Pachacútec 1420, Villa El Salvador, Lima</li>
                <li>📞 Central: (01) 450-8920</li>
                <li>📱 WhatsApp: +51 987 654 321</li>
                <li>⏰ Lun - Sáb: 7:00 AM - 7:00 PM</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
                Métodos de Pago 🇵🇪
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div>🟣 Yape BCP (Al instante)</div>
                <div>🔵 Plin (BBVA, Interbank, Scotiabank)</div>
                <div>💳 Tarjetas Visa, Mastercard vía Culqi</div>
                <div>💵 Pago Contra Entrega en Obra</div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
                Seguridad & Soporte
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🛡️</span>
                  <span>Plataforma con Soporte Maestro 24/7</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📖</span>
                  <span>Libro de Reclamaciones Virtual</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔒</span>
                  <span>Conexión Encriptada SSL</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              © 2026 FerrePro El Maestro S.A.C. Todos los derechos reservados.
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => setActiveTab('maestro')}
                style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                🛡️ Acceso Equipo Maestro
              </button>
              <button
                onClick={() => setActiveTab('almacen')}
                style={{ background: 'none', border: 'none', color: '#fb923c', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                📱 App Almacén Móvil
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
