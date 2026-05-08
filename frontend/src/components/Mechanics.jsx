import { useEffect, useState } from 'react';
import { fetchJson } from '../api';
import { 
  Plus, 
  User, 
  Settings, 
  Phone, 
  ShieldCheck, 
  Wrench,
  Search,
  Filter
} from 'lucide-react';

function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
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
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipo Técnico</h2>
          <p className="text-sm text-gray-500 mt-1">Gestión de especialistas y disponibilidad.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
        >
          {isAdding ? <Filter className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cerrar Panel' : 'Agregar Especialista'}
        </button>
      </div>

      {/* Add Form Panel */}
      {isAdding && (
        <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm ring-1 ring-indigo-50">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <User className="w-4 h-4" /> Nuevo Miembro del Equipo
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre Completo</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Especialidad</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} 
                placeholder="Ej. Motores, Suspensión..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Teléfono de Contacto</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-8 rounded-lg text-sm hover:bg-indigo-700 transition-colors">Dar de Alta</button>
            </div>
          </form>
        </div>
      )}

      {/* Mechanics Grid/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map((mechanic) => (
          <div key={mechanic.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group relative">
            <div className="absolute top-4 right-4">
               <button className="text-gray-300 hover:text-gray-500">
                  <Settings className="w-4 h-4" />
               </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                 <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${mechanic.name}`} alt="avatar" className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 leading-none mb-1">{mechanic.name}</h4>
                <p className="text-xs font-bold text-indigo-500 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {mechanic.specialty || 'Técnico General'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                 <span className="text-gray-400 font-medium flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Teléfono
                 </span>
                 <span className="text-gray-900 font-semibold">{mechanic.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                 <span className="text-gray-400 font-medium flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5" /> Estado
                 </span>
                 {mechanic.status === 'Disponible' ? (
                   <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Disponible
                   </span>
                 ) : (
                   <span className="flex items-center gap-1.5 text-amber-500 font-black text-[10px] uppercase">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span> Ocupado
                   </span>
                 )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50">
               <button className="w-full py-2 bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 text-xs font-bold rounded-lg transition-colors border border-transparent hover:border-indigo-100">
                  Ver Historial de Órdenes
               </button>
            </div>
          </div>
        ))}
        {mechanics.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-3 text-gray-400">
             <User className="w-12 h-12 stroke-1" />
             <p className="font-medium text-sm">No hay mecánicos registrados en el sistema.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Mechanics;
