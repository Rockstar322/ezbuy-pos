import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/common/Header';
import { BottomNavBar } from './components/common/BottomNavBar';
import { SplashScreen } from './components/splash/SplashScreen';
import { POSView } from './components/pos/POSView';
import { InventoryView } from './components/inventory/InventoryView';
import { CRMView } from './components/crm/CRMView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { SaleSuccessModal } from './components/checkout/SaleSuccessModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { CashierLockModal } from './components/security/CashierLockModal';
import { QuickActionSheet } from './components/pos/QuickActionSheet';
import { GranelModal } from './components/pos/GranelModal';
import { CameraScannerModal } from './components/pos/CameraScannerModal';
import { QuickStockScannerModal } from './components/inventory/QuickStockScannerModal';
import { db } from './services/storage/database';
import { useBarcodeScanner } from './hooks/useBarcodeScanner';
import { soundFX } from './utils/audio';
export function App() {
  // Estado de Pantalla 0: Portada de Bienvenida (Splash & Login con persistencia de sesión)
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ezbuy_entered') !== 'true';
    }
    return true;
  });

  const handleEnterPos = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ezbuy_entered', 'true');
    }
    setShowSplash(false);
  };

  const handleShowSplash = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ezbuy_entered');
    }
    setShowSplash(true);
  };

  // Estado de Datos Globales Reactivos
  const [products, setProducts] = useState(db.getProducts());
  const [customers, setCustomers] = useState(db.getCustomers());
  const [sales, setSales] = useState(db.getSales());
  const [config, setConfig] = useState(db.getConfig());

  // Estado de Navegación Principal y Vistas
  const [activeTab, setActiveTab] = useState('pos'); // 'pos', 'inventory', 'crm', 'analytics'
  const [viewMode, setViewMode] = useState('auto'); // 'auto', 'mobile-portrait', 'mobile-landscape', 'desktop'
  const [isLocked, setIsLocked] = useState(false);

  // Estado del Carrito en Vivo
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);

  // Estado de Modales y Acciones Rápidas
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isGranelModalOpen, setIsGranelModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isStockReceptionOpen, setIsStockReceptionOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSaleSuccessOpen, setIsSaleSuccessOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinLockOpen, setIsPinLockOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  // Suscripción a cambios en la base de datos local y sincronizada
  useEffect(() => {
    const unsubscribe = db.subscribe((event) => {
      if (event === 'products_updated' || event === 'data_reset') {
        setProducts(db.getProducts());
      }
      if (event === 'customers_updated' || event === 'data_reset') {
        setCustomers(db.getCustomers());
      }
      if (event === 'sales_updated' || event === 'data_reset') {
        setSales(db.getSales());
      }
      if (event === 'config_updated' || event === 'data_reset') {
        setConfig(db.getConfig());
      }
    });
    return unsubscribe;
  }, []);

  // Agregar al carrito (Soporte para productos estándar, códigos de fábrica, venta a granel e ingreso manual)
  const handleAddToCart = useCallback((product) => {
    if (!product.isManualItem && product.stock <= 0) {
      soundFX.playError();
      alert(`El producto ${product.name} se encuentra agotado.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          productId: product.productId || product.id,
          name: product.name,
          barcode: product.barcode,
          salePrice: Number(product.salePrice),
          quantity: product.quantity || 1,
          unit: product.unit || 'NIU',
          isGranelItem: Boolean(product.isGranelItem),
          isManualItem: Boolean(product.isManualItem),
        },
      ];
    });
  }, []);

  // Listener Global de Pistola Láser HID Externa
  const handleBarcodeScan = useCallback((barcode) => {
    const product = db.getProductByBarcode(barcode);
    if (product) {
      handleAddToCart(product);
    } else {
      soundFX.playError();
      console.warn(`Código de barras desconocido: ${barcode}`);
    }
  }, [handleAddToCart]);

  const { lastScanned, isLaserActive, isScanningActive, simulateScan } = useBarcodeScanner({
    onScan: handleBarcodeScan,
    enabled: !isLocked && !showSplash,
  });

  // Operaciones del Carrito
  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart((prev) => prev.filter((it) => it.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  // Cálculos del Carrito
  const cartSubtotal = cart.reduce((sum, it) => sum + it.salePrice * it.quantity, 0);
  const cartTotal = Math.max(0, cartSubtotal - discount);
  const cartCount = cart.reduce((sum, it) => sum + (it.isGranelItem ? 1 : it.quantity), 0);

  // Confirmar y Registrar Venta
  const handleConfirmSale = (saleData) => {
    const registeredSale = db.addSale(saleData);
    setCompletedSale(registeredSale);
    setCart([]);
    setDiscount(0);
    setIsCheckoutOpen(false);
    setIsSaleSuccessOpen(true);
  };

  // Guardar / Eliminar Producto en Inventario
  const handleSaveProduct = (prodData) => {
    db.saveProduct(prodData);
  };

  const handleDeleteProduct = (prodId) => {
    db.deleteProduct(prodId);
  };

  const handleSaveConfig = (newConfig) => {
    db.saveConfig(newConfig);
  };

  const handleResetDemoData = () => {
    db.resetToSeedData();
    setCart([]);
    setDiscount(0);
  };

  // Productos a granel disponibles para el modal
  const granelProducts = products.filter((p) => p.isGranel || p.category === 'A Granel / Peso');

  // Si está activa la Pantalla 0 (Portada de Acceso / Bienvenida)
  if (showSplash) {
    return (
      <SplashScreen
        onEnterPos={handleEnterPos}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-16 sm:pb-0">
      {/* Top Bar Blanca Limpia */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPinLock={() => setIsPinLockOpen(true)}
        isLocked={isLocked}
        lastScannedCode={lastScanned?.code}
        isScanningPulse={isScanningActive}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => {
          if (cart.length > 0) {
            setIsCheckoutOpen(true);
          } else {
            setActiveTab('pos');
          }
        }}
        onShowSplash={handleShowSplash}
      />

      {/* Contenedor Principal Adaptativo */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 transition-all">
        <div className={`transition-all ${
          viewMode === 'mobile-portrait'
            ? 'max-w-[420px] mx-auto bg-white p-3 rounded-3xl border border-slate-200 shadow-xl my-2'
            : viewMode === 'mobile-landscape'
            ? 'max-w-4xl mx-auto bg-white p-4 rounded-3xl border border-slate-200 shadow-xl my-2'
            : ''
        }`}>
          {/* 1. Vista POS / Inicio */}
          {activeTab === 'pos' && (
            <POSView
              products={products}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onProceedCheckout={() => setIsCheckoutOpen(true)}
              discount={discount}
              onSetDiscount={setDiscount}
              viewMode={viewMode}
              lastScanned={lastScanned}
              isLaserActive={isLaserActive}
              isScanningActive={isScanningActive}
              onSimulateBarcode={simulateScan}
              onOpenGranel={() => setIsGranelModalOpen(true)}
              onOpenCamera={() => setIsCameraModalOpen(true)}
            />
          )}

          {/* 2. Vista de Inventario */}
          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {/* 3. Vista de Comprobantes / Historial CRM */}
          {activeTab === 'crm' && (
            <CRMView
              customers={customers}
              sales={sales}
              config={config}
            />
          )}

          {/* 4. Vista de Analítica de Negocio */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              products={products}
              sales={sales}
              customers={customers}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation Bar Fija con Botón Central [+] */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickActionMenu={() => setIsQuickActionOpen(true)}
      />

      {/* Menú de Acciones Rápidas (Slide-up desde el botón [+]) */}
      <QuickActionSheet
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onOpenGranel={() => setIsGranelModalOpen(true)}
        onOpenManual={() => setIsGranelModalOpen(true)}
        onOpenCamera={() => setIsCameraModalOpen(true)}
        onOpenStockReception={() => setIsStockReceptionOpen(true)}
      />

      {/* Modal de Venta a Granel & Ingreso Exprés */}
      <GranelModal
        isOpen={isGranelModalOpen}
        onClose={() => setIsGranelModalOpen(false)}
        granelProducts={granelProducts}
        onAddToCart={handleAddToCart}
      />

      {/* Modal de Escaneo con Cámara Móvil */}
      <CameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onScanSuccess={(code) => {
          simulateScan(code);
        }}
        products={products}
      />

      {/* Modal de Recepción Rápida de Stock */}
      <QuickStockScannerModal
        isOpen={isStockReceptionOpen}
        onClose={() => setIsStockReceptionOpen(false)}
        products={products}
        onAddStock={(productId, addedQty) => {
          const prod = products.find((p) => p.id === productId);
          if (prod) {
            db.saveProduct({ ...prod, stock: Number(prod.stock) + Number(addedQty) });
          }
        }}
        onRegisterNewProduct={(newProd) => {
          db.saveProduct(newProd);
        }}
      />

      {/* Modal de Resumen y Emisión de Comprobante (Checkout) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={cartTotal}
        customers={customers}
        onConfirmSale={handleConfirmSale}
        config={config}
      />

      {/* Modal de Venta Exitosa con Ticket Térmico y PDF SUNAT */}
      <SaleSuccessModal
        isOpen={isSaleSuccessOpen}
        onClose={() => setIsSaleSuccessOpen(false)}
        sale={completedSale}
        config={config}
        onNewSale={() => {
          setIsSaleSuccessOpen(false);
          setActiveTab('pos');
        }}
      />

      {/* Modal de Configuración */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetDemoData={handleResetDemoData}
      />

      {/* Modal de Seguridad / Bloqueo con PIN */}
      <CashierLockModal
        isOpen={isPinLockOpen || isLocked}
        onClose={() => setIsPinLockOpen(false)}
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        onLock={() => setIsLocked(true)}
        currentPin={config.cashier_pin || '1234'}
      />
    </div>
  );
}

export default App;
