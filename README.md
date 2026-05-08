# Plataforma de Taller Mecánico

Aplicación para gestionar el flujo de vehículos desde la entrada hasta la salida, control de estados, asignación de mecánicos, uso de repuestos, inventarios y facturación.

## Características iniciales

- Gestión de órdenes de trabajo con estados: Pendiente, En revisión, En prueba de ruta, Pendiente por entregar, Entregado.
- Registro de vehículos y su historial.
- Control de mecánicos asignados.
- Inventario de repuestos y consumo por orden de trabajo.
- API REST para módulos administrativos y contables.

## Instalación

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Configura la conexión a PostgreSQL en `.env`:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/mechanicapp?schema=public"
   ```

3. Genera el cliente Prisma y crea el esquema en la base de datos:

   ```bash
   npm run db:generate
   npm run migrate
   ```

4. Inicia el servidor:

   ```bash
   npm run dev
   ```

4. Inicia el frontend:

   ```bash
   npm run frontend:dev
   ```

## Estructura

- `backend/server.js` - servidor principal.
- `backend/db.js` - Prisma client con PostgreSQL.
- `backend/routes/` - endpoints de vehículos, órdenes, inventario, mecánicos y facturación.
- `frontend/` - aplicación React/Vite para administración.

## Próximos pasos

- Implementar autenticación y roles.
- Añadir módulo de facturación y reports contables.

## Bitácora

- Consulta el archivo `bitacora.md` para ver el historial de cambios y el estado del desarrollo.
