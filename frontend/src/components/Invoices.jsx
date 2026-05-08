import { useEffect, useState } from 'react';
import { fetchJson } from '../api';
import { FileText, Plus, Receipt, DollarSign, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [workorders, setWorkorders] = useState([]);
  const [form, setForm] = useState({ workorder_id: '', invoice_number: '', amount: '', tax: '', status: 'Pendiente', date: '' });
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  useEffect(() => {
    const load = async () => {
      setInvoices(await fetchJson('/invoices'));
      setWorkorders(await fetchJson('/workorders'));
    };
    load().catch(console.error);
  }, []);

  const handleOrderChange = async (e) => {
    const orderId = e.target.value;
    setForm({ ...form, workorder_id: orderId });
    if (!orderId) {
      setSelectedOrderDetails(null);
      setForm(f => ({ ...f, amount: '' }));
      return;
    }
    try {
      const orderData = await fetchJson(`/workorders/${orderId}`);
      setSelectedOrderDetails(orderData);
      
      let totalAmount = 0;
      orderData.parts?.forEach(p => {
        totalAmount += (p.item?.sale_price || 0) * p.quantity;
      });
      orderData.services?.forEach(s => {
        totalAmount += s.price;
      });
      
      setForm(f => ({ ...f, amount: totalAmount.toFixed(2) }));
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetchJson('/invoices', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setInvoices(await fetchJson('/invoices'));
      setForm({ workorder_id: '', invoice_number: '', amount: '', tax: '', status: 'Pendiente', date: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Facturación</h2>
          <p className="text-sm text-gray-500 mt-1">Control de pagos y comprobantes fiscales.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-gray-50 pb-2">
          <Plus className="w-4 h-4 text-indigo-500" /> Nueva Factura
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Orden de Trabajo</label>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={form.workorder_id} onChange={handleOrderChange} required>
              <option value="">Selecciona</option>
              {workorders.map((order) => <option key={order.id} value={order.id}>{`Orden OT-${order.id}`}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Nº Factura</label>
            <input className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Monto ($)</label>
            <input type="number" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Impuestos (%)</label>
            <input type="number" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha</label>
            <input type="date" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Facturar</button>
          </div>
        </form>

        {selectedOrderDetails && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
            <h4 className="font-bold text-gray-900 mb-2">Desglose Calculado (OT-{selectedOrderDetails.id})</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase border-b pb-1 mb-1">Repuestos</p>
                {selectedOrderDetails.parts?.length === 0 ? <span className="text-xs text-gray-400">Sin repuestos.</span> : 
                  selectedOrderDetails.parts?.map(p => (
                    <div key={p.id} className="flex justify-between text-xs">
                      <span>{p.quantity}x {p.item?.name}</span>
                      <span className="font-mono">${((p.item?.sale_price || 0) * p.quantity).toFixed(2)}</span>
                    </div>
                  ))
                }
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase border-b pb-1 mb-1">Servicios</p>
                {selectedOrderDetails.services?.length === 0 ? <span className="text-xs text-gray-400">Sin servicios.</span> : 
                  selectedOrderDetails.services?.map(s => (
                    <div key={s.id} className="flex justify-between text-xs">
                      <span>{s.service?.name}</span>
                      <span className="font-mono">${s.price.toFixed(2)}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-gray-400" />
          <h3 className="text-xs font-bold text-gray-900 uppercase">Historial de Comprobantes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Referencia</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Nº Documento</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">Monto Total</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600">OT-{invoice.workorder_id}</td>
                  <td className="px-6 py-4 font-mono text-gray-500 uppercase">{invoice.invoice_number}</td>
                  <td className="px-6 py-4 text-right font-black text-gray-900">
                    ${parseFloat(invoice.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                      invoice.status === 'Pagada' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {invoice.status}
                    </span>
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

export default Invoices;
