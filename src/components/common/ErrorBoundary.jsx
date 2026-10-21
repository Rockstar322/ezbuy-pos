import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó una excepción:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 text-center font-sans">
          <div className="max-w-md w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Restauración de Punto de Venta</h2>
              <p className="text-xs text-slate-500 mt-1">
                Se detectó una interrupción temporal en la interfaz. Tu inventario y ventas registradas están 100% seguras en la base de datos local.
              </p>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Volver al Punto de Venta</span>
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recargar Aplicación</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
