# MechanicApp (Plataforma de Taller Mecánico Premium)

Sistema profesional para la gestión de talleres automotrices, control de operaciones, facturación automatizada y seguimiento en tiempo real. 

## Características Principales

*   **Pantalla Pública (Flight Board):** Tablero en tiempo real diseñado para salas de espera (`/board`), mostrando el estado de los vehículos con privacidad de placas.
*   **Gestión Operativa:** Control de flujo de órdenes con estados dinámicos ("Pendiente", "En Revisión", "Suspendido por repuestos").
*   **Inventario y Requisición:** El mecánico solicita piezas que se descuentan automáticamente del inventario y se asignan a la orden activa.
*   **Tarifario de Servicios:** Catálogo estandarizado de mano de obra y servicios especializados.
*   **Documentos Legales (Print-Ready):** 
    *   *Consentimiento de Repuestos:* Exoneración cuando el cliente trae sus propias piezas.
    *   *Acta de Entrega a Satisfacción:* Documento formal de entrega con observaciones del estado del vehículo.
*   **Facturación Automatizada:** Generación instantánea de la cuenta sumando el costo de los repuestos consumidos y los servicios prestados.
*   **Diseño Visual Premium:** Interfaz de alta densidad de información estilo "Avalon/Datadog" con componentes modernos y responsivos.

## Stack Tecnológico

*   **Backend:** Node.js, Express, Prisma ORM
*   **Base de Datos:** PostgreSQL (Neon Serverless)
*   **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide Icons

## Instalación y Configuración

1.  Instala las dependencias principales y del frontend:
    ```bash
    npm install
    cd frontend && npm install && cd ..
    ```

2.  Configura tu base de datos PostgreSQL en el archivo `.env`:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/neondb?schema=public"
    ```

3.  Sincroniza la base de datos con Prisma:
    ```bash
    npx prisma db push
    ```

4.  Inicia la aplicación (Backend y Frontend en modo desarrollo):
    ```bash
    npm run dev
    # (Asegúrate de ejecutar 'npm run frontend:dev' en otra terminal si 'npm run dev' no lo levanta concurrentemente)
    ```

## Estructura del Proyecto

*   `backend/` - Servidor Express y rutas API REST.
*   `frontend/src/components/` - Vistas React (Dashboard, Inventario, Órdenes, etc.).
*   `prisma/schema.prisma` - Modelo de datos de la plataforma.

## Bitácora de Desarrollo
Consulta el archivo `bitacora.md` para ver el historial completo de cambios y las actualizaciones operativas.
