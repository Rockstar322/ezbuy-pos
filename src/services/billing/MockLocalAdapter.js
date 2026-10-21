import { BillingAdapter } from './BillingAdapter';

/**
 * Adaptador Local de Simulación SUNAT (Activo por defecto)
 * Calcula IGV 18%, genera firma hash CPE y Constancia de Recepción (CDR) aceptada.
 */
export class MockLocalAdapter extends BillingAdapter {
  constructor(config = {}) {
    super(config);
    this.name = 'MockLocalAdapter';
    this.rucEmisor = config.ruc || '20609876543';
    this.razonSocial = config.business_name || 'BODEGA & MINIMARKET EZBUY S.A.C.';
  }

  // Generador de Hash CPE simulado (Hexadecimal de 40 caracteres similar a SHA-1 SUNAT)
  generateCpeHash(seed) {
    let hash = '';
    const chars = '0123456789abcdef';
    for (let i = 0; i < 40; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  async emitInvoice(saleData) {
    // Simular latencia de red de ~200ms
    await new Promise((resolve) => setTimeout(resolve, 220));

    const total = parseFloat(saleData.total || 0);
    // En Perú: Total = Subtotal (Operación Gravada) + IGV (18%)
    // Base Imponible = Total / 1.18
    const baseImponible = parseFloat((total / 1.18).toFixed(2));
    const igv = parseFloat((total - baseImponible).toFixed(2));

    const docTypeCodes = {
      ticket: '00', // Nota de venta
      boleta: '03', // Boleta de Venta Electrónica
      factura: '01', // Factura Electrónica
    };

    const docTypeCode = docTypeCodes[saleData.docType] || '03';
    const seriesCorrelative = saleData.seriesCorrelative || `B001-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    const [serie, correlativo] = seriesCorrelative.split('-');

    const hashCPE = this.generateCpeHash(seriesCorrelative + total);

    // Formato de cadena QR estándar SUNAT:
    // RUC | TIPO_COMPROBANTE | SERIE | CORRELATIVO | IGV | TOTAL | FECHA | TIPO_DOC_CLIENTE | NUM_DOC_CLIENTE | HASH
    const clientDocType = saleData.docType === 'factura' ? '6' : '1';
    const clientDocNum = saleData.customerDoc || '00000000';
    const dateFormatted = new Date().toISOString().split('T')[0];

    const qrData = `${this.rucEmisor}|${docTypeCode}|${serie}|${correlativo}|${igv.toFixed(2)}|${total.toFixed(2)}|${dateFormatted}|${clientDocType}|${clientDocNum}|${hashCPE}`;

    return {
      success: true,
      provider: 'Mock SUNAT Local (Offline-Ready)',
      ticketNumber: seriesCorrelative,
      docTypeCode,
      baseImponible,
      igv,
      total,
      hashCPE,
      sunatStatus: 'ACEPTADO',
      cdrCode: '0',
      cdrDescription: 'La Boleta/Factura número ' + seriesCorrelative + ' ha sido ACEPTADA por SUNAT con éxito.',
      qrData,
      timestamp: new Date().toISOString(),
    };
  }

  async checkStatus(ticketId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      success: true,
      ticketId,
      status: 'ACEPTADO',
      message: 'Comprobante válido y registrado en el padrón electrónico de SUNAT.',
    };
  }

  async cancelInvoice(ticketId, reason) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      ticketId,
      status: 'ANULADO',
      reason: reason || 'Anulación por error en emisión',
      message: 'Comunicación de baja registrada satisfactoriamente.',
    };
  }
}
