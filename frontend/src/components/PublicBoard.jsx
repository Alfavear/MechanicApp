import { useEffect, useState } from 'react';
import { PlaneTakeoff, Wrench, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { apiBase } from '../api';

function PublicBoard() {
  const [workorders, setWorkorders] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Clock tick
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch data every 30 seconds
    const fetchBoard = async () => {
      try {
        const res = await fetch(`${apiBase}/public/workorders`);
        if (res.ok) {
          const data = await res.json();
          setWorkorders(data);
        }
      } catch (err) {
        console.error('Error fetching public board:', err);
      }
    };
    
    fetchBoard();
    const interval = setInterval(fetchBoard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pendiente': return 'text-amber-400';
      case 'En revision': return 'text-blue-400';
      case 'En prueba de Ruta': return 'text-purple-400';
      case 'Suspendido por repuestos': return 'text-red-500 animate-pulse';
      case 'Pendiente por entregar': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pendiente': return <Clock className="w-5 h-5 inline mr-2" />;
      case 'En revision': return <Wrench className="w-5 h-5 inline mr-2" />;
      case 'En prueba de Ruta': return <PlaneTakeoff className="w-5 h-5 inline mr-2" />;
      case 'Suspendido por repuestos': return <AlertTriangle className="w-5 h-5 inline mr-2" />;
      case 'Pendiente por entregar': return <CheckCircle2 className="w-5 h-5 inline mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-700 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center gap-4">
            <Wrench className="text-blue-500 w-10 h-10" />
            MECÁNICA CENTRAL - ESTADO DE VEHÍCULOS
          </h1>
          <p className="text-gray-400 mt-2 tracking-widest text-sm uppercase">Actualización en tiempo real</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-light text-blue-100 tracking-tight">
            {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-gray-400 uppercase tracking-widest text-sm mt-1">
            {time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* Board Headers */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-700/50 text-gray-500 font-bold uppercase tracking-widest text-xs">
        <div className="col-span-3">Vehículo (Placa)</div>
        <div className="col-span-5">Estado Operativo</div>
        <div className="col-span-4 text-right">Técnico Asignado</div>
      </div>

      {/* Board Rows */}
      <div className="flex flex-col mt-4 space-y-2">
        {workorders.length === 0 ? (
          <div className="text-center text-gray-600 py-20 text-xl font-light">
            NO HAY VEHÍCULOS EN TALLER
          </div>
        ) : (
          workorders.map((wo) => (
            <div 
              key={wo.id} 
              className="grid grid-cols-12 gap-4 px-6 py-5 bg-[#1e293b] rounded-lg items-center border border-gray-700/50 shadow-lg"
            >
              <div className="col-span-3 text-2xl font-bold tracking-widest text-gray-100">
                {wo.license_plate}
              </div>
              <div className={`col-span-5 text-xl font-bold uppercase tracking-wider ${getStatusColor(wo.status)} flex items-center`}>
                {getStatusIcon(wo.status)}
                {wo.status}
              </div>
              <div className="col-span-4 text-right text-lg text-gray-300 tracking-wide">
                {wo.mechanic_name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PublicBoard;
