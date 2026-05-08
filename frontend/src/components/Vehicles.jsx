import { useEffect, useState } from 'react';
import { fetchJson } from '../api';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ license_plate: '', brand: '', model: '', year: '', owner_name: '', owner_phone: '' });

  useEffect(() => {
    fetchJson('/vehicles').then(setVehicles).catch(console.error);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetchJson('/vehicles', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const list = await fetchJson('/vehicles');
      setVehicles(list);
      setForm({ license_plate: '', brand: '', model: '', year: '', owner_name: '', owner_phone: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="panel">
      <div className="section-header">
        <div>
          <h2>Vehículos</h2>
          <p>Registro y control de los vehículos del taller.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div>
          <label>Placa</label>
          <input value={form.license_plate} onChange={(e) => setForm({ ...form, license_plate: e.target.value })} required />
        </div>
        <div>
          <label>Marca</label>
          <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        </div>
        <div>
          <label>Modelo</label>
          <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        </div>
        <div>
          <label>Año</label>
          <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        </div>
        <div>
          <label>Propietario</label>
          <input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
        </div>
        <div>
          <label>Teléfono</label>
          <input value={form.owner_phone} onChange={(e) => setForm({ ...form, owner_phone: e.target.value })} />
        </div>
        <div>
          <button type="submit">Agregar vehículo</button>
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Propietario</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.license_plate}</td>
              <td>{vehicle.brand}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>{vehicle.owner_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Vehicles;
