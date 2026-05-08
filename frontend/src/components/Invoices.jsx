import { useEffect, useState } from 'react';
import { fetchJson } from '../api';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [workorders, setWorkorders] = useState([]);
  const [form, setForm] = useState({ workorder_id: '', invoice_number: '', amount: '', tax: '', status: 'Pendiente', date: '' });

  useEffect(() => {
    const load = async () => {
      setInvoices(await fetchJson('/invoices'));
      setWorkorders(await fetchJson('/workorders'));
    };
    load().catch(console.error);
  }, []);

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
    <div className="panel">
      <div className="section-header">
        <div>
          <h2>Facturación</h2>
          <p>Registro de facturas y su estado contable.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div>
          <label>Orden</label>
          <select value={form.workorder_id} onChange={(e) => setForm({ ...form, workorder_id: e.target.value })} required>
            <option value="">Selecciona</option>
            {workorders.map((order) => (
              <option key={order.id} value={order.id}>{`Orden ${order.id}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Factura</label>
          <input value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} required />
        </div>
        <div>
          <label>Monto</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <label>Impuesto</label>
          <input type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} />
        </div>
        <div>
          <label>Estado</label>
          <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
        <div>
          <label>Fecha</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <button type="submit">Crear factura</button>
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Orden</th>
            <th>Factura</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.workorder_id}</td>
              <td>{invoice.invoice_number}</td>
              <td>{invoice.amount}</td>
              <td>{invoice.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Invoices;
