# Bitácora del proyecto

## 2026-05-08

- Inicialización del workspace y estructura base del proyecto.
- Creación del backend con Express y SQLite.
- Implementación de rutas para vehículos, mecánicos, órdenes de trabajo, inventario y facturación.
- Creación de script de migración para inicializar la base de datos.
- Instalación de dependencias y validación del servidor backend.
- Inicio del desarrollo del frontend React/Vite.
- Creación de componentes React para Dashboard, Vehículos, Mecánicos, Órdenes, Inventario y Facturación.
- Configuración inicial de Vite y scripts de frontend.
- Instalación de dependencias del frontend y verificación de compilación con Vite build.
- Verificación del script raíz `frontend:build` para garantizar que el frontend se puede compilar desde el directorio principal.
- Migración de backend a PostgreSQL con Prisma y creación del esquema.
- Ajuste de versiones de Prisma a 6.19.3 para compatibilidad con Node 20.17.

## 2026-05-08 (Continuación)

- Inicio del rediseño visual completo (Estilo Monitoring/Datadog).
- Instalación de dependencias: `lucide-react`, `recharts`, `clsx` y `tailwind-merge`.
- Definición del nuevo sistema de diseño (Tema Claro, alta densidad).
- Actualización de `index.css` con variables de color y estilos base inspirados en Datadog.
- Rediseño completo de `AppLayout.jsx` con sidebar minimalista, topbar de navegación y sistema de breadcrumbs.
- Rediseño de `Dashboard.jsx` con widgets de métricas operativas y gráficos de actividad utilizando `recharts`.
- Transformación de los módulos de `Vehículos`, `Mecánicos`, `Órdenes`, `Inventario` y `Facturación` a un estilo de alta densidad con iconografía `lucide`.
- Limpieza de estilos obsoletos y unificación del sistema de diseño en todo el frontend.

## 2026-05-08 (Requerimientos Operativos Avanzados)

- **Actualización del Esquema:** Modificación de `schema.prisma` agregando `entry_observations`, `customer_provided_parts` a `Workorder` y nuevos modelos `ServiceCatalog`, `WorkorderService` y `WorkorderPhoto`.
- **Pantalla Pública (Flight Board):** Creación del endpoint `/api/public/workorders` y la vista `/board` en frontend para uso en salas de espera (oculta parcialmente las placas por privacidad).
- **Gestión de Consentimientos:** Desarrollo de `ConsentDocument.jsx` y `SatisfactionDocument.jsx` para generar documentos imprimibles de exoneración y actas de entrega formales.
- **Flujo de Suspensión:** Implementación del estado "Suspendido por repuestos" en órdenes de trabajo, que libera automáticamente al mecánico y lo marca como "Disponible".
- **Historial de Vehículos:** Integración de un modal rápido en la vista de vehículos para ver todas las reparaciones históricas.
- **Requisición y Deducción de Inventario:** El sistema ahora permite a los mecánicos agregar repuestos a su orden activa (`WorkorderPart`), lo que deduce automáticamente el stock en el inventario.
- **Catálogo de Servicios:** Nuevo módulo `ServicesCatalog.jsx` y rutas API para manejar el tarifario estándar (mano de obra, escaneo, etc.).
- **Facturación Automatizada:** La vista de facturación (`Invoices.jsx`) ahora genera automáticamente el desglose y suma el total al seleccionar una orden de trabajo (repuestos consumidos + servicios prestados).
