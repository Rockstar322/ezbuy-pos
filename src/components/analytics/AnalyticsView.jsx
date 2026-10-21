import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  ShoppingCart, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Printer, 
  Truck, 
  Sparkles, 
  ArrowUpRight,
  Package,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, triggerPrint } from '../../utils/receiptGenerator';

export function AnalyticsView({ products = [], sales = [], customers = [] }) {
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;

    sales.forEach((s) => {
      totalRevenue += Number(s.total || 0);
      (s.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.productId || p.barcode === item.barcode);
        const cost = prod ? prod.costPrice : item.unit_price * 0.7;
        totalCost += cost * (item.quantity || 1);
      });
    });

    const netProfit = Math.max(0, totalRevenue - totalCost);
    const avgTicket = sales.length > 0 ? totalRevenue / sales.length : 0;
    const profitMarginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

    return { totalRevenue, netProfit, avgTicket, profitMarginPercent };
  }, [sales, products]);

  const topDemandRanking = useMemo(() => {
    const itemMap = {};

    sales.forEach((s) => {
      (s.items || []).forEach((it) => {
        const id = it.productId || it.barcode || it.product_name;
        if (!itemMap[id]) {
          const prod = products.find((p) => p.id === it.productId || p.barcode === it.barcode);
          itemMap[id] = {
            id,
            name: it.product_name || it.name,
            barcode: it.barcode,
            unitsSold: 0,
            revenue: 0,
            cost: 0,
            unitPrice: it.unit_price,
            costPrice: prod ? prod.costPrice : it.unit_price * 0.7,
            unit: it.unit || 'und',
          };
        }
        itemMap[id].unitsSold += Number(it.quantity || 1);
        itemMap[id].revenue += Number(it.subtotal || it.unit_price * it.quantity);
        itemMap[id].cost += itemMap[id].costPrice * Number(it.quantity || 1);
      });
    });

    const list = Object.values(itemMap).map((item) => {
      const profit = Math.max(0, item.revenue - item.cost);
      const margin = item.revenue > 0 ? ((profit / item.revenue) * 100).toFixed(1) : 0;
      return {
        ...item,
        profit,
        margin,
        share: metrics.totalRevenue > 0 ? ((item.revenue / metrics.totalRevenue) * 100).toFixed(1) : 0,
      };
    });

    return list.sort((a, b) => b.unitsSold - a.unitsSold);
  }, [sales, products, metrics.totalRevenue]);

  const purchaseRecommendations = useMemo(() => {
    return products
      .map((p) => {
        const demandItem = topDemandRanking.find((t) => t.barcode === p.barcode || t.name === p.name);
        const unitsSold = demandItem ? demandItem.unitsSold : 1;
        const dailyVelocity = Math.max(0.5, unitsSold / 4);
        const daysOfInventory = dailyVelocity > 0 ? (p.stock / dailyVelocity).toFixed(1) : 99;

        const isUrgent = p.stock <= p.minStock || daysOfInventory < 3;
        const suggestedPurchase = Math.max(
          p.minStock * 2,
          Math.ceil(dailyVelocity * 10 - p.stock)
        );

        return {
          ...p,
          dailyVelocity: dailyVelocity.toFixed(1),
          daysOfInventory,
          isUrgent,
          suggestedPurchase,
          estimatedCost: suggestedPurchase * p.costPrice,
        };
      })
      .filter((p) => p.isUrgent)
      .sort((a, b) => a.daysOfInventory - b.daysOfInventory);
  }, [products, topDemandRanking]);

  const handleExportCsv = () => {
    const headers = ['Serie', 'Tipo', 'Cliente', 'Documento', 'Metodo', 'Total_Soles', 'Fecha'];
    const rows = sales.map((s) => [
      s.seriesCorrelative,
      s.docType,
      `"${s.customerName}"`,
      s.customerDoc || '-',
      s.paymentMethod,
      s.total,
      s.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ezbuy_ventas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportJson = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      products,
      sales,
      customers,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ezbuy_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Tarjetas Principales de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500">Ventas Totales</p>
          <p className="text-xl font-black font-mono text-slate-900 mt-0.5">
            {formatCurrency(metrics.totalRevenue)}
          </p>
          <p className="text-[10px] text-emerald-700 flex items-center gap-0.5 mt-0.5 font-bold">
            <ArrowUpRight className="w-3 h-3" /> {sales.length} comprobantes
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500">Ganancia Neta Estimada</p>
          <p className="text-xl font-black font-mono text-emerald-700 mt-0.5">
            {formatCurrency(metrics.netProfit)}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Margen: <strong className="text-emerald-700 font-bold">+{metrics.profitMarginPercent}%</strong>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500">Ticket Promedio</p>
          <p className="text-xl font-black font-mono text-slate-800 mt-0.5">
            {formatCurrency(metrics.avgTicket)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Consumo por cliente</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-amber-700">Abastecimiento</p>
          <p className="text-xl font-black font-mono text-amber-700 mt-0.5">
            {purchaseRecommendations.length} productos
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Pedir a distribuidores</p>
        </div>
      </div>

      {/* 2. ASISTENTE DE COMPRAS INTELIGENTE */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Truck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>Asistente de Compras Inteligente (Anti-Desabastecimiento)</span>
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.2 rounded-full font-bold">
                  Sugerido
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Qué debes comprar hoy a tus proveedores según la velocidad de venta diaria
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-700 font-mono font-bold">
            Presupuesto Sugerido: {formatCurrency(purchaseRecommendations.reduce((s, p) => s + p.estimatedCost, 0))}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {purchaseRecommendations.length === 0 ? (
            <p className="col-span-full py-4 text-center text-xs text-slate-400">
              ¡Excelente! Todo el stock cubre la demanda de los próximos 7 días.
            </p>
          ) : (
            purchaseRecommendations.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between space-x-2"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-slate-800 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Stock: <strong className={item.stock === 0 ? 'text-rose-600' : 'text-amber-700'}>{item.stock} {item.unit}</strong> • Cobertura: ~{item.daysOfInventory} días
                  </p>
                  <p className="text-[11px] font-black text-emerald-700 mt-1 flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Pedir al distribuidor: +{item.suggestedPurchase} {item.unit}</span>
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">Inversión:</span>
                  <p className="text-xs font-mono font-black text-slate-800">
                    {formatCurrency(item.estimatedCost)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. RANKING DE PRODUCTOS MÁS VENDIDOS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Ranking Top Demanda</h3>
              <p className="text-[11px] text-slate-500">Productos con mayor rotación, margen y volumen en Soles</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Descargar CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Descargar JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-600" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={triggerPrint}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              title="Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-2.5 px-4"># Puesto & Producto</th>
                <th className="py-2.5 px-3 text-center font-mono">Unidades</th>
                <th className="py-2.5 px-3 font-mono">Ingresos</th>
                <th className="py-2.5 px-3 font-mono">Margen %</th>
                <th className="py-2.5 px-4 font-mono text-right">% Cuota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {topDemandRanking.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        index === 0 ? 'bg-amber-400 text-slate-900' : (index === 1 ? 'bg-slate-300 text-slate-800' : 'bg-slate-100 text-slate-600')
                      }`}>
                        {index + 1}
                      </span>
                      <p className="font-extrabold text-slate-800 text-xs truncate max-w-[240px]">{item.name}</p>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                    {item.unitsSold}
                  </td>

                  <td className="py-3 px-3 font-mono font-extrabold text-emerald-700">
                    {formatCurrency(item.revenue)}
                  </td>

                  <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                    +{item.margin}%
                  </td>

                  <td className="py-3 px-4 font-mono text-right font-extrabold text-slate-700">
                    {item.share}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
