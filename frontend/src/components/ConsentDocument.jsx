import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

function ConsentDocument() {
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
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors"
        >
          <Printer className="w-5 h-5" /> Imprimir Documento
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
          Acuerdo de Exención de Responsabilidad por Repuestos de Terceros
        </h2>

        {/* Body */}
        <div className="space-y-6 text-sm text-gray-800 leading-relaxed text-justify">
          <p>
            Por medio del presente documento, suscrito el día <strong>{currentDate}</strong>, se hace constar 
            que el vehículo identificado con placas <strong>{data.vehicle?.license_plate || '______________'}</strong> ha ingresado a las 
            instalaciones del Taller Mecánico Central bajo la orden de trabajo número <strong>OT-{data.id}</strong>.
          </p>

          <p>
            El cliente declara expresamente y acepta haber suministrado sus propios repuestos y/o piezas para ser instalados o 
            utilizados en el mantenimiento/reparación del mencionado vehículo. 
          </p>

          <div className="bg-gray-50 p-4 border border-gray-300 rounded-md">
            <h3 className="font-bold mb-2 uppercase text-xs">Detalles del Servicio Asignado:</h3>
            <ul className="list-disc list-inside space-y-1 text-xs font-mono">
              <li><strong>Orden de Trabajo:</strong> #{data.id}</li>
              <li><strong>Mecánico Asignado:</strong> {data.mechanic?.name || '______________'}</li>
              <li><strong>Descripción Inicial:</strong> {data.description || 'N/A'}</li>
            </ul>
          </div>

          <p className="font-bold underline decoration-1 underline-offset-2">
            Cláusulas de Exención de Responsabilidad:
          </p>

          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong>Calidad de los Repuestos:</strong> El taller no garantiza ni avala la calidad, procedencia, o idoneidad 
              de las piezas suministradas por el cliente.
            </li>
            <li>
              <strong>Fallas Derivadas:</strong> El taller queda completamente exonerado de cualquier responsabilidad legal, civil 
              o comercial en caso de falla, desgaste prematuro, accidente o daños colaterales al vehículo causados directa o indirectamente por el mal funcionamiento del repuesto suministrado por el cliente.
            </li>
            <li>
              <strong>Garantía de Mano de Obra:</strong> La garantía ofrecida por el taller cubrirá estrictamente la mano de obra 
              (correcta instalación). Si se determina que la pieza instalada falló por defecto de fábrica, el cliente deberá 
              asumir nuevamente el costo de instalación si decide reemplazarla.
            </li>
          </ol>

          <p>
            Con la firma del presente documento, el cliente afirma haber leído, entendido y aceptado todas las condiciones 
            y exenciones aquí estipuladas.
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-20 grid grid-cols-2 gap-12">
          <div className="text-center">
            <div className="border-t border-gray-900 pt-2">
              <p className="font-bold text-sm">Firma del Cliente</p>
              <p className="text-xs text-gray-500 mt-1">C.I. / DNI: _________________</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-900 pt-2">
              <p className="font-bold text-sm">Firma del Taller</p>
              <p className="text-xs text-gray-500 mt-1">Representante Autorizado</p>
            </div>
          </div>
        </div>

        {/* Footer print */}
        <div className="mt-12 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-4 print:block hidden">
          Documento generado automáticamente por MechanicApp Engine - Ref: OT-{data.id} - {new Date().toISOString()}
        </div>
      </div>
    </div>
  );
}

export default ConsentDocument;
