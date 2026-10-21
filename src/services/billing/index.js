import { MockLocalAdapter } from './MockLocalAdapter';
import { NubefactAdapter } from './NubefactAdapter';
import { FactilizaAdapter, CustomRestApiAdapter } from './FactilizaAdapter';

export const BILLING_PROVIDERS = [
  { id: 'mock_sunat', name: 'Mock SUNAT Local (Recomendado Offline / Demo)', isLocal: true },
  { id: 'nubefact', name: 'Nubefact (PSE Homologado SUNAT)', isLocal: false },
  { id: 'factiliza', name: 'Factiliza (OSE / PSE Cloud)', isLocal: false },
  { id: 'custom_rest', name: 'API REST Personalizada (Cualquier Proveedor)', isLocal: false },
];

class BillingService {
  constructor() {
    this.currentProvider = 'mock_sunat';
    this.config = {
      ruc: '20609876543',
      business_name: 'BODEGA & MINIMARKET EZBUY S.A.C.',
      api_url: '',
      api_token: '',
    };
    this.adapter = new MockLocalAdapter(this.config);
  }

  setProvider(providerId, config = {}) {
    this.currentProvider = providerId;
    this.config = { ...this.config, ...config };

    switch (providerId) {
      case 'nubefact':
        this.adapter = new NubefactAdapter(this.config);
        break;
      case 'factiliza':
        this.adapter = new FactilizaAdapter(this.config);
        break;
      case 'custom_rest':
        this.adapter = new CustomRestApiAdapter(this.config);
        break;
      case 'mock_sunat':
      default:
        this.adapter = new MockLocalAdapter(this.config);
        break;
    }
    return this.adapter;
  }

  getAdapter() {
    return this.adapter;
  }

  getProviderName() {
    const p = BILLING_PROVIDERS.find((x) => x.id === this.currentProvider);
    return p ? p.name : 'Mock SUNAT';
  }

  async emit(saleData) {
    return this.adapter.emitInvoice(saleData);
  }
}

export const billingService = new BillingService();
