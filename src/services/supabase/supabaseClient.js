import { createClient } from '@supabase/supabase-js';

// Supabase client instance (híbrido y tolerante a fallos si no hay .env)
const envUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

class SupabaseService {
  constructor() {
    this.client = null;
    this.url = envUrl;
    this.anonKey = envAnonKey;
    this.isConfigured = false;
    this.init();
  }

  init(customUrl, customKey) {
    const url = customUrl || this.url;
    const key = customKey || this.anonKey;

    if (url && key && url.startsWith('http')) {
      try {
        this.client = createClient(url, key, {
          auth: { persistSession: true },
          realtime: { params: { eventsPerSecond: 10 } },
        });
        this.url = url;
        this.anonKey = key;
        this.isConfigured = true;
      } catch (err) {
        console.warn('No se pudo inicializar Supabase, continuando en Modo Offline:', err);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      this.client = null;
      this.isConfigured = false;
    }
  }

  getClient() {
    return this.client;
  }

  // Verifica conectividad real con Supabase
  async testConnection() {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('products').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  // Sincroniza ventas de la cola local hacia Supabase
  async syncSale(sale) {
    if (!this.client) throw new Error('Supabase no conectado');
    
    // Inserción de venta
    const { data: saleData, error: saleErr } = await this.client
      .from('sales')
      .insert({
        series_correlative: sale.seriesCorrelative,
        doc_type: sale.docType,
        customer_name: sale.customerName,
        customer_doc: sale.customerDoc,
        customer_email: sale.customerEmail,
        payment_method: sale.paymentMethod,
        subtotal: sale.subtotal,
        igv: sale.igv,
        discount: sale.discount,
        total: sale.total,
        cash_tendered: sale.cashTendered,
        change_returned: sale.changeReturned,
        billing_status: sale.billingStatus,
        sunat_hash: sale.sunatHash,
        day_of_week: sale.dayOfWeek,
        created_at: sale.createdAt,
      })
      .select('id')
      .single();

    if (saleErr) throw saleErr;

    // Inserción de items de la venta
    if (sale.items && sale.items.length > 0) {
      const itemsPayload = sale.items.map((i) => ({
        sale_id: saleData.id,
        product_name: i.product_name || i.name,
        barcode: i.barcode,
        quantity: i.quantity,
        unit_price: i.unit_price,
        subtotal: i.subtotal,
      }));

      const { error: itemsErr } = await this.client.from('sale_items').insert(itemsPayload);
      if (itemsErr) console.warn('Advertencia al insertar sale_items en Supabase:', itemsErr);
    }

    return true;
  }
}

export const supabaseService = new SupabaseService();
