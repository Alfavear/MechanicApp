import { useEffect, useState } from 'react';
import { fetchJson } from '../api';

function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [form, setForm] = useState({ name: '', specialty: '', phone: '' });

  useEffect(() => {
    fetchJson('/mechanics').then(setMechanics).catch(console.error);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetchJson('/mechanics', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setMechanics(await fetchJson('/mechanics'));
      setForm({ name: '', specialty: '', phone: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="panel">
      <div className="section-header">
        <div>
          <h2>Mecánicos</h2>
          <p>Registro y seguimiento de los mecánicos asignados.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div>
          <label>Nombre</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label>Especialidad</label>
          <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
        </div>
        <div>
          <label>Teléfono</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <button type="submit">Agregar mecánico</button>
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {mechanics.map((mechanic) => (
            <tr key={mechanic.id}>
              <td>{mechanic.name}</td>
              <td>{mechanic.specialty}</td>
              <td>{mechanic.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Mechanics;
