import { useEffect, useState } from 'react';
import { fetchJson } from '../api';
import { Settings, Plus, DollarSign, Activity } from 'lucide-react';

function ServicesCatalog() {
  const [services, setServices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', suggested_price: '' });

  useEffect(() => {
    fetchJson('/services').then(setServices).catch(console.error);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetchJson('/services', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const list = await fetchJson('/services');
      setServices(list);
      setForm({ name: '', description: '', suggested_price: '' });
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tarifario de Servicios</h2>
          <p className="text-sm text-gray-500 mt-1">Catálogo de mano de obra y servicios estándar.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Nuevo Servicio
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm ring-1 ring-indigo-50">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Registrar Servicio
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre del Servicio</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Tarifa Sugerida ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" step="0.01"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={form.suggested_price} onChange={(e) => setForm({ ...form, suggested_price: e.target.value })} required 
                />
              </div>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Guardar</button>
            </div>
            <div className="space-y-1 md:col-span-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción (Opcional)</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <Settings className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="bg-green-50 text-green-700 font-black text-lg px-3 py-1 rounded-lg border border-green-100">
                ${service.suggested_price}
              </span>
            </div>
            <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">{service.name}</h4>
            <p className="text-sm text-gray-500 min-h-[40px]">{service.description || 'Sin descripción detallada.'}</p>
          </div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 stroke-1" />
            <p>El tarifario está vacío. Agrega servicios para comenzar.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default ServicesCatalog;
