import { useEffect, useState } from 'react';
import { fetchJson } from '../api';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Car, 
  User, 
  Phone,
  Calendar,
  ExternalLink,
  History,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ license_plate: '', brand: '', model: '', year: '', owner_name: '', owner_phone: '' });
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

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
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewHistory = async (vehicle) => {
    try {
      const data = await fetchJson(`/vehicles/${vehicle.id}/history`);
      setSelectedHistory({ vehicle, records: data });
      setHistoryModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header Area */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flota de Vehículos</h2>
          <p className="text-sm text-gray-500 mt-1">Gestión y monitoreo de unidades registradas.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
        >
          {isAdding ? <Filter className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cerrar Panel' : 'Nuevo Vehículo'}
        </button>
      </div>

      {/* Add Form Panel (Collapsible) */}
      {isAdding && (
        <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm ring-1 ring-indigo-50">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Car className="w-4 h-4" /> Registro de Unidad
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Placa</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={form.license_plate} onChange={(e) => setForm({ ...form, license_plate: e.target.value })} required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Marca</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Modelo</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Año</label>
              <input 
                type="number" 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Propietario</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} 
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Filters/Search */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filtrar por placa o dueño..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full md:w-80 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 text-xs font-bold text-gray-400 uppercase items-center">
            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded">{filteredVehicles.length}</span> Unidades mostradas
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificación</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehículo</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Propietario</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-[10px] border border-gray-200">
                        {vehicle.license_plate.slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-indigo-600 tracking-wider uppercase">{vehicle.license_plate}</p>
                        <p className="text-[10px] text-gray-400 font-medium">ID: #{vehicle.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {vehicle.year || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{vehicle.owner_name}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 italic">
                           <Phone className="w-3 h-3" /> {vehicle.owner_phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => viewHistory(vehicle)}
                        className="flex items-center gap-1 p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg border border-transparent hover:border-indigo-200 shadow-sm transition-all text-xs font-bold"
                      >
                        <History className="w-4 h-4" /> Historial
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 shadow-sm transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <Search className="w-10 h-10 stroke-1" />
                      <p className="text-sm font-medium">No se encontraron vehículos registrados.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      {historyModalOpen && selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Historial de Servicio</h3>
                <p className="text-sm text-gray-500 mt-1">Placa: <span className="font-bold text-indigo-600">{selectedHistory.vehicle.license_plate}</span></p>
              </div>
              <button onClick={() => setHistoryModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              {selectedHistory.records.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 stroke-1" />
                  <p>No hay registros de servicio para este vehículo.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedHistory.records.map((record) => (
                    <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase">Orden #{record.id}</span>
                          <h4 className="font-bold text-gray-900 mt-1">{record.description || 'Sin descripción'}</h4>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {record.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-4 mt-3">
                         <span><strong className="text-gray-700">Mecánico:</strong> {record.mechanic?.name || 'N/A'}</span>
                         <span><strong className="text-gray-700">Fecha:</strong> {new Date(record.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Vehicles;
