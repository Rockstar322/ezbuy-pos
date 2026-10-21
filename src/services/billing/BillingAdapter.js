/**
 * Interfaz base / Clase abstracta para los Proveedores de Facturación Electrónica (PSE / OSE / SUNAT)
 * Aplica el patrón Strategy / Adapter para permitir el intercambio de proveedores en caliente.
 */
export class BillingAdapter {
  constructor(config = {}) {
    this.name = 'BaseAdapter';
    this.config = config;
  }

  /**
   * Emite un Comprobante de Pago Electrónico (Boleta, Factura, Nota de Venta)
   * @param {Object} saleData Datos de la venta, cliente, items y totales
   * @returns {Promise<{
   *   success: boolean,
   *   ticketNumber: string,
   *   hashCPE: string,
   *   sunatStatus: 'ACEPTADO' | 'RECHAZADO' | 'PENDIENTE',
   *   message: string,
   *   qrData: string,
   *   pdfUrl?: string
   * }>}
   */
  async emitInvoice(saleData) {
    throw new Error(`Método emitInvoice() no implementado en ${this.constructor.name}`);
  }

  /**
   * Consulta el estado de un comprobante ante SUNAT
   * @param {string} ticketId Identificador o serie-correlativo del comprobante
   */
  async checkStatus(ticketId) {
    throw new Error(`Método checkStatus() no implementado en ${this.constructor.name}`);
  }

  /**
   * Comunica la baja / anulación de un comprobante
   * @param {string} ticketId Identificador del comprobante
   * @param {string} reason Motivo de la anulación
   */
  async cancelInvoice(ticketId, reason) {
    throw new Error(`Método cancelInvoice() no implementado en ${this.constructor.name}`);
  }
}
