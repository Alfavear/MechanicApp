import { useEffect, useState } from 'react';
import { fetchJson } from '../api';
import { 
  Plus, 
  Wrench, 
  Car, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';

import { useNavigate } from 'react-router-dom';

const statuses = ['Pendiente', 'En revision', 'En prueba de Ruta', 'Pendiente por entregar', 'Entregado', 'Suspendido por repuestos'];

function Workorders() {
  const navigate = useNavigate();
  const [workorders, setWorkorders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ vehicle_id: '', mechanic_id: '', status: 'Pendiente', description: '', estimated_delivery: '', customer_provided_parts: false, entry_observations: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [orders, vehs, mechs] = await Promise.all([
          fetchJson('/workorders'),
          fetchJson('/vehicles'),
          fetchJson('/mechanics')
        ]);
        setWorkorders(orders);
        setVehicles(vehs);
        setMechanics(mechs);
      } catch (e) {
        console.error(e);
      }
    };
    load();
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
      setForm({ vehicle_id: '', mechanic_id: '', status: 'Pendiente', description: '', estimated_delivery: '', customer_provided_parts: false, entry_observations: '' });
      setIsAdding(false);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'En revision': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'En prueba de Ruta': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Pendiente por entregar': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Suspendido por repuestos': return 'bg-red-50 text-red-600 border-red-100 animate-pulse';
      case 'Entregado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h2>
          <p className="text-sm text-gray-500 mt-1">Monitoreo en tiempo real del flujo operativo.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
        >
          {isAdding ? <Filter className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cerrar Panel' : 'Crear Orden'}
        </button>
      </div>

      {/* Add Form Panel */}
      {isAdding && (
        <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm ring-1 ring-indigo-50">
          <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Apertura de Orden de Servicio
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Vehículo</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} required>
                <option value="">Seleccionar vehículo</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.license_plate} - {v.brand}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Mecánico Asignado</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.mechanic_id} onChange={(e) => setForm({ ...form, mechanic_id: e.target.value })} required>
                <option value="">Asignar mecánico</option>
                {mechanics.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Entrega Estimada</label>
              <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.estimated_delivery} onChange={(e) => setForm({ ...form, estimated_delivery: e.target.value })} />
            </div>
            <div className="space-y-1 md:col-span-2 lg:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción Inicial</label>
              <input className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Falla reportada..." />
            </div>
            <div className="space-y-1 md:col-span-2 lg:col-span-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Observaciones al Ingreso (Abolladuras, Luces, Estado)</label>
              <input className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" value={form.entry_observations} onChange={(e) => setForm({ ...form, entry_observations: e.target.value })} placeholder="Ej. Rayón en puerta derecha, falta antena..." />
            </div>
            <div className="lg:col-span-4 flex items-center gap-2 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
              <input 
                type="checkbox" 
                id="partsFlag"
                checked={form.customer_provided_parts}
                onChange={(e) => setForm({ ...form, customer_provided_parts: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="partsFlag" className="text-xs font-bold text-gray-700">El cliente proporciona sus propios repuestos (Requiere firma de consentimiento legal)</label>
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-8 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/10">Generar Orden</button>
            </div>
          </form>
        </div>
      )}

      {/* Main List Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> {workorders.filter(o => o.status === 'Entregado').length} Completados
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> {workorders.filter(o => o.status !== 'Entregado').length} En Proceso
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-300" />
            <input type="text" placeholder="Buscar OT..." className="bg-transparent border-none text-xs focus:ring-0 w-32" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Orden de Servicio</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehículo</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mecánico</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado de Flujo</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actualizar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workorders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex flex-col items-center justify-center border border-indigo-100">
                        <span className="text-[10px] font-black text-indigo-400 leading-none">OT</span>
                        <span className="text-sm font-black text-indigo-700">{order.id}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400">Creado el {new Date(order.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">{order.description || 'Sin descripción'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-300" />
                      <span className="text-sm font-bold text-gray-900 tracking-wide uppercase">{order.vehicle?.license_plate || order.vehicle_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                         {order.mechanic?.name?.charAt(0) || 'M'}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{order.mechanic?.name || `Mecánico #${order.mechanic_id}`}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                      getStatusStyle(order.status)
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {order.status === 'Suspendido por repuestos' ? (
                        <button onClick={() => updateStatus(order.id, 'En revision')} className="flex items-center gap-1 bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all">
                          Reanudar <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        ['Pendiente', 'En revision', 'En prueba de Ruta'].includes(order.status) && (
                          <button onClick={() => updateStatus(order.id, 'Suspendido por repuestos')} className="flex items-center gap-1 bg-white border border-gray-200 hover:border-red-500 hover:text-red-600 text-gray-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all">
                            Suspender
                          </button>
                        )
                      )}
                      
                      {statuses.indexOf(order.status) < 4 && (
                        <button 
                          onClick={() => updateStatus(order.id, statuses[statuses.indexOf(order.status) + 1])}
                          className="flex items-center gap-1 bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 text-gray-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all"
                        >
                          Avanzar <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {order.customer_provided_parts && (
                        <button 
                          onClick={() => navigate('/consent', { state: { workorder: order } })}
                          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all border border-blue-200"
                        >
                          Consentimiento
                        </button>
                      )}

                      {order.status === 'Entregado' && (
                        <>
                          <button 
                            onClick={() => navigate('/satisfaction', { state: { workorder: order } })}
                            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all border border-emerald-200 mr-2"
                          >
                            Acta Entrega
                          </button>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </>
                      )}
                    </div>
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

export default Workorders;
