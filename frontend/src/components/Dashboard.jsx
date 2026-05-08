import { useEffect, useState } from 'react';
import { fetchJson } from '../api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({ vehicles: 0, mechanics: 0, workorders: 0, inventory: 0, invoices: 0 });
  const [data, setData] = useState([]);

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

        const safeLength = (arr) => Array.isArray(arr) ? arr.length : 0;
        setStats({
          vehicles: safeLength(vehicles),
          mechanics: safeLength(mechanics),
          workorders: safeLength(workorders),
          inventory: safeLength(inventory),
          invoices: safeLength(invoices),
        });

        // Fake data for the chart to simulate "Real User Monitoring"
        setData([
          { name: '08:00', orders: 4, activity: 65 },
          { name: '10:00', orders: 7, activity: 80 },
          { name: '12:00', orders: 5, activity: 45 },
          { name: '14:00', orders: 9, activity: 90 },
          { name: '16:00', orders: 12, activity: 70 },
          { name: '18:00', orders: 6, activity: 30 },
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const MetricCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className={`rounded-xl p-5 shadow-lg shadow-${colorClass.split('-')[1]}-500/20 text-white flex flex-col gap-3 ${colorClass} relative overflow-hidden transition-transform hover:-translate-y-1`}>
      {/* Decorative background element */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-white/90">{title}</span>
        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm shadow-inner">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex items-end gap-2 relative z-10 mt-2">
        <span className="text-3xl font-black tracking-tight">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Metrics Grid - Avalon Style Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Vehículos en Taller" value={stats.vehicles} icon={TrendingUp} colorClass="bg-gradient-to-br from-blue-500 to-blue-600" />
        <MetricCard title="Órdenes Activas" value={stats.workorders} icon={Clock} colorClass="bg-gradient-to-br from-green-500 to-emerald-600" />
        <MetricCard title="Mecánicos" value={stats.mechanics} icon={CheckCircle2} colorClass="bg-gradient-to-br from-orange-400 to-orange-500" />
        <MetricCard title="Facturación Hoy" value={`$${(stats.invoices * 125).toLocaleString()}`} icon={ArrowUpRight} colorClass="bg-gradient-to-br from-purple-500 to-purple-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md shadow-gray-200/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">Actividad del Taller</h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-600">
              <option>Últimas 24 horas</option>
              <option>Última semana</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Bar Chart / Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50">
          <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-6">Distribución por Estado</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Pendiente', value: 12 },
                { name: 'Revisión', value: 8 },
                { name: 'Reparación', value: 15 },
                { name: 'Lista', value: 5 }
              ]} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Bottom Row - Avalon style recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50">
          <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-4">Tareas Recientes</h3>
          <div className="space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Actualización de estado OT-{200 + i}</p>
                  <p className="text-xs text-gray-500">Completado por Admin</p>
                </div>
                <span className="text-xs font-bold text-gray-400">Hace {i*15} min</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50">
          <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-4">Mecánicos Activos</h3>
          <div className="space-y-4">
             {[1,2,3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Mec${i}`} alt="Avatar" className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Técnico #{i}</p>
                  <p className="text-xs text-gray-500">Mantenimiento General</p>
                </div>
                <div className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-bold">Disponible</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
