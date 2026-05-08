import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

function SatisfactionDocument() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.workorder;

  if (!data) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Error: Datos no encontrados</h2>
        <button onClick={() => navigate('/workorders')} className="mt-4 text-blue-600 hover:underline">Volver</button>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      {/* Non-printable controls */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate('/workorders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Volver a Órdenes
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors"
        >
          <Printer className="w-5 h-5" /> Imprimir Acta
        </button>
      </div>

      {/* Printable Document */}
      <div className="max-w-3xl mx-auto bg-white p-12 shadow-xl print:shadow-none print:p-8 border border-gray-200">
        
        {/* Header */}
        <div className="text-center border-b-2 border-gray-900 pb-6 mb-8">
          <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900">MechanicApp</h1>
          <p className="text-sm text-gray-600 font-medium">Taller Mecánico Central</p>
          <p className="text-xs text-gray-500 mt-1">Av. Principal 123, Ciudad | Tel: (555) 123-4567</p>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-8 uppercase underline decoration-2 underline-offset-4">
          Acta de Entrega a Satisfacción
        </h2>

        {/* Body */}
        <div className="space-y-6 text-sm text-gray-800 leading-relaxed text-justify">
          <p>
            Por medio de la presente, suscrita el día <strong>{currentDate}</strong>, el Taller Mecánico Central hace formal entrega 
            del vehículo con placas <strong>{data.vehicle?.license_plate || '______________'}</strong>, correspondiente a la 
            orden de trabajo <strong>OT-{data.id}</strong>.
          </p>

          <div className="bg-gray-50 p-4 border border-gray-300 rounded-md">
            <h3 className="font-bold mb-2 uppercase text-xs">Resumen del Servicio:</h3>
            <ul className="list-disc list-inside space-y-1 text-xs font-mono">
              <li><strong>Vehículo:</strong> {data.vehicle?.brand} {data.vehicle?.model}</li>
              <li><strong>Mecánico Asignado:</strong> {data.mechanic?.name || '______________'}</li>
              <li><strong>Observaciones al Ingreso:</strong> {data.entry_observations || 'Sin observaciones reportadas al ingreso.'}</li>
              <li><strong>Trabajo Realizado:</strong> {data.description || 'N/A'}</li>
            </ul>
          </div>

          <p className="font-bold underline decoration-1 underline-offset-2 mt-6">
            Declaración de Conformidad del Cliente:
          </p>

          <ul className="list-none space-y-3 pl-2">
            <li>✅ Declaro que recibo mi vehículo en las mismas condiciones estéticas y de accesorios en las que fue entregado al taller, salvo las observaciones registradas al ingreso.</li>
            <li>✅ Declaro estar satisfecho(a) con los trabajos de mantenimiento y/o reparación efectuados, habiéndose realizado una prueba de ruta y/o encendido a mi entera conformidad.</li>
            <li>✅ Entiendo que cualquier reclamación por garantía debe hacerse dentro de los plazos y condiciones establecidos por el taller, presentando la factura original, y que la garantía no cubre daños por mal uso posterior a la entrega.</li>
          </ul>

        </div>

        {/* Signatures */}
        <div className="mt-24 grid grid-cols-2 gap-12">
          <div className="text-center">
            <div className="border-t border-gray-900 pt-2">
              <p className="font-bold text-sm">Firma del Cliente</p>
              <p className="text-xs text-gray-500 mt-1">C.I. / DNI: _________________</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-900 pt-2">
              <p className="font-bold text-sm">Representante del Taller</p>
              <p className="text-xs text-gray-500 mt-1">Entregado por</p>
            </div>
          </div>
        </div>

        {/* Footer print */}
        <div className="mt-12 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-4 print:block hidden">
          Acta generada por MechanicApp Engine - Ref: OT-{data.id} - {new Date().toISOString()}
        </div>
      </div>
    </div>
  );
}

export default SatisfactionDocument;
