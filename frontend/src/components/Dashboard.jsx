import { useEffect, useState } from 'react';
import { fetchJson } from '../api';

function Dashboard() {
  const [stats, setStats] = useState({ vehicles: 0, mechanics: 0, workorders: 0, inventory: 0, invoices: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [vehicles, mechanics, workorders, inventory, invoices] = await Promise.all([
          fetchJson('/vehicles'),
          fetchJson('/mechanics'),
          fetchJson('/workorders'),
          fetchJson('/inventory/items'),
          fetchJson('/invoices'),
        ]);

        setStats({
          vehicles: vehicles.length,
          mechanics: mechanics.length,
          workorders: workorders.length,
          inventory: inventory.length,
          invoices: invoices.length,
        });
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  return (
    <div className="panel">
      <div className="section-header">
        <div>
          <h2>Dashboard</h2>
          <p>Resumen operativo del taller.</p>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card">
          <strong>Vehículos</strong>
          <p>{stats.vehicles}</p>
        </div>
        <div className="card">
          <strong>Mecánicos</strong>
          <p>{stats.mechanics}</p>
        </div>
        <div className="card">
          <strong>Órdenes</strong>
          <p>{stats.workorders}</p>
        </div>
        <div className="card">
          <strong>Productos</strong>
          <p>{stats.inventory}</p>
        </div>
        <div className="card">
          <strong>Facturas</strong>
          <p>{stats.invoices}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
