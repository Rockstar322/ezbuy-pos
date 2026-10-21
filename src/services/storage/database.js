import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_SALES } from './seedData';
import { supabaseService } from '../supabase/supabaseClient';

const STORAGE_KEYS = {
  PRODUCTS: 'ezbuy_products_v2',
  CUSTOMERS: 'ezbuy_customers_v2',
  SALES: 'ezbuy_sales_v2',
  SYNC_QUEUE: 'ezbuy_sync_queue_v2',
  CONFIG: 'ezbuy_config_v2',
};

const DEFAULT_CONFIG = {
  business_name: 'BODEGA & MINIMARKET EZBUY S.A.C.',
  ruc: '20609876543',
  address: 'Av. Las Gardenias 450, Surco, Lima',
  phone: '987654321',
  email: 'ventas@ezbuy.pe',
  printer_type: '58mm', // '58mm' o '80mm'
  billing_provider: 'mock_sunat', // 'mock_sunat', 'nubefact', 'factiliza', 'custom_rest'
  billing_api_url: '',
  billing_api_token: '',
  supabase_url: '',
  supabase_anon_key: '',
  cashier_pin: '1234',
  require_pin_for_reports: true,
};

class LocalDatabase {
  constructor() {
    this.subscribers = new Set();
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.initNetworkListeners();
  }

  initNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notify('network_change');
        this.processSyncQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notify('network_change');
      });
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(eventType, data) {
    this.subscribers.forEach((cb) => {
      try {
        cb(eventType, data);
      } catch (err) {
        console.error('Error en suscriptor de BD:', err);
      }
    });
  }

  // --- CONFIGURACIÓN ---
  getConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  saveConfig(newConfig) {
    try {
      const current = this.getConfig();
      const updated = { ...current, ...newConfig };
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
      
      // Si se actualizaron credenciales de Supabase, re-inicializar cliente
      if (newConfig.supabase_url || newConfig.supabase_anon_key) {
        supabaseService.init(updated.supabase_url, updated.supabase_anon_key);
      }
      
      this.notify('config_updated', updated);
      return updated;
    } catch (e) {
      console.error(e);
      return DEFAULT_CONFIG;
    }
  }

  // --- PRODUCTOS ---
  getProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!stored) {
        this.setProducts(INITIAL_PRODUCTS);
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  setProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notify('products_updated', products);
    } catch (e) {
      console.error(e);
    }
  }

  getProductByBarcode(barcode) {
    const products = this.getProducts();
    const clean = String(barcode).trim();
    return products.find((p) => p.barcode === clean);
  }

  saveProduct(productData) {
    const products = this.getProducts();
    let updated;
    if (productData.id) {
      // Editar
      updated = products.map((p) => (p.id === productData.id ? { ...p, ...productData } : p));
    } else {
      // Nuevo
      const newProd = {
        ...productData,
        id: 'prod-' + Date.now(),
        stock: parseInt(productData.stock || 0, 10),
        minStock: parseInt(productData.minStock || 5, 10),
        salePrice: parseFloat(productData.salePrice || 0),
        costPrice: parseFloat(productData.costPrice || 0),
      };
      updated = [newProd, ...products];
    }
    this.setProducts(updated);
    return updated;
  }

  deleteProduct(productId) {
    const products = this.getProducts();
    const updated = products.filter((p) => p.id !== productId);
    this.setProducts(updated);
    return updated;
  }

  // --- CLIENTES CRM ---
  getCustomers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (!stored) {
        this.setCustomers(INITIAL_CUSTOMERS);
        return INITIAL_CUSTOMERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_CUSTOMERS;
    }
  }

  setCustomers(customers) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      this.notify('customers_updated', customers);
    } catch (e) {
      console.error(e);
    }
  }

  saveCustomer(customerData) {
    const customers = this.getCustomers();
    let updated;
    if (customerData.id) {
      updated = customers.map((c) => (c.id === customerData.id ? { ...c, ...customerData } : c));
    } else {
      const newCust = {
        ...customerData,
        id: 'cust-' + Date.now(),
        totalSpent: 0,
        ordersCount: 0,
        lastVisit: new Date().toISOString(),
      };
      updated = [newCust, ...customers];
    }
    this.setCustomers(updated);
    return updated;
  }

  // --- VENTAS ---
  getSales() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SALES);
      if (!stored) {
        this.setSales(INITIAL_SALES);
        return INITIAL_SALES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SALES;
    }
  }

  setSales(sales) {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
      this.notify('sales_updated', sales);
    } catch (e) {
      console.error(e);
    }
  }

  // Registrar una venta completa (Descuenta stock, actualiza CRM y encola sincronización)
  addSale(salePayload) {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDay = daysOfWeek[new Date().getDay()];

    const sale = {
      ...salePayload,
      id: salePayload.id || 'sale-' + Date.now(),
      createdAt: salePayload.createdAt || new Date().toISOString(),
      dayOfWeek: salePayload.dayOfWeek || currentDay,
      syncStatus: 'pending',
    };

    // 1. Guardar en lista de ventas
    const sales = this.getSales();
    const updatedSales = [sale, ...sales];
    this.setSales(updatedSales);

    // 2. Descontar Stock de Productos en tiempo real
    const products = this.getProducts();
    const updatedProducts = products.map((prod) => {
      const itemSold = (sale.items || []).find((it) => it.productId === prod.id || it.barcode === prod.barcode);
      if (itemSold) {
        const qty = parseFloat(itemSold.quantity || 1);
        return {
          ...prod,
          stock: Math.max(0, Number((prod.stock - qty).toFixed(3))),
        };
      }
      return prod;
    });
    this.setProducts(updatedProducts);

    // 3. Actualizar totales del cliente en CRM
    if (sale.customerId || sale.customerDoc) {
      const customers = this.getCustomers();
      const updatedCustomers = customers.map((cust) => {
        const match = (sale.customerId && cust.id === sale.customerId) || (sale.customerDoc && cust.docNumber === sale.customerDoc);
        if (match) {
          return {
            ...cust,
            totalSpent: Number((cust.totalSpent + sale.total).toFixed(2)),
            ordersCount: cust.ordersCount + 1,
            lastVisit: sale.createdAt,
          };
        }
        return cust;
      });
      this.setCustomers(updatedCustomers);
    }

    // 4. Agregar a la cola de sincronización
    this.addToSyncQueue(sale);

    // 5. Intentar sincronizar inmediatamente si hay conexión
    this.processSyncQueue();

    return sale;
  }

  // --- COLA DE SINCRONIZACIÓN (SYNC QUEUE) ---
  getSyncQueue() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  addToSyncQueue(sale) {
    try {
      const queue = this.getSyncQueue();
      queue.push(sale);
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
      this.notify('queue_updated', queue);
    } catch (e) {
      console.error(e);
    }
  }

  async processSyncQueue() {
    const queue = this.getSyncQueue();
    if (queue.length === 0) return;
    if (!this.isOnline || !supabaseService.getClient()) return;

    try {
      const remaining = [];
      for (const sale of queue) {
        try {
          await supabaseService.syncSale(sale);
          // Marcar como sincronizado en la lista local de ventas
          const sales = this.getSales();
          const updated = sales.map((s) => (s.id === sale.id ? { ...s, syncStatus: 'synced' } : s));
          this.setSales(updated);
        } catch {
          remaining.push(sale);
        }
      }
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(remaining));
      this.notify('queue_updated', remaining);
    } catch (err) {
      console.warn('Error al procesar cola de sincronización:', err);
    }
  }

  // Restaurar datos semilla de prueba
  resetToSeedData() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    this.setProducts(INITIAL_PRODUCTS);
    this.setCustomers(INITIAL_CUSTOMERS);
    this.setSales(INITIAL_SALES);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
    this.notify('data_reset', true);
  }
}

export const db = new LocalDatabase();
