import { useEffect, useState } from 'react';
import { fetchJson } from '../api';

const statuses = ['Pendiente', 'En revision', 'En prueba de Ruta', 'Pendiente por entregar', 'Entregado'];

function Workorders() {
  const [workorders, setWorkorders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [form, setForm] = useState({ vehicle_id: '', mechanic_id: '', status: 'Pendiente', description: '', estimated_delivery: '' });

  useEffect(() => {
    const load = async () => {
      setWorkorders(await fetchJson('/workorders'));
      setVehicles(await fetchJson('/vehicles'));
      setMechanics(await fetchJson('/mechanics'));
    };
    load().catch(console.error);
  }, []);

  const refresh = async () => setWorkorders(await fetchJson('/workorders'));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetchJson('/workorders', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      await refresh();
      setForm({ vehicle_id: '', mechanic_id: '', status: 'Pendiente', description: '', estimated_delivery: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetchJson(`/workorders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      await refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="panel">
      <div className="section-header">
        <div>
          <h2>Órdenes de Trabajo</h2>
          <p>Control de flujo desde la entrada hasta la entrega.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div>
          <label>Vehículo</label>
          <select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} required>
            <option value="">Selecciona</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>{`${vehicle.license_plate} - ${vehicle.brand || ''} ${vehicle.model || ''}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Mecánico</label>
          <select value={form.mechanic_id} onChange={(e) => setForm({ ...form, mechanic_id: e.target.value })} required>
            <option value="">Selecciona</option>
            {mechanics.map((mechanic) => (
              <option key={mechanic.id} value={mechanic.id}>{mechanic.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Estado</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Descripción</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="2" />
        </div>
        <div>
          <label>Entrega estimada</label>
          <input type="date" value={form.estimated_delivery} onChange={(e) => setForm({ ...form, estimated_delivery: e.target.value })} />
        </div>
        <div>
          <button type="submit">Crear orden</button>
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehículo</th>
            <th>Mecánico</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {workorders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.vehicle_id}</td>
              <td>{order.mechanic_id}</td>
              <td>{order.status}</td>
              <td>
                {statuses.map((status) => (
                  <button key={status} className="secondary" type="button" onClick={() => updateStatus(order.id, status)}>
                    {status}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Workorders;
