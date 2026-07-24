# Chequeo Facturación — Web App

Aplicación web para gestionar la facturación de pacientes de una clínica. Reemplaza el flujo manual de comparar dos
Excels por un sistema centralizado en PostgreSQL, donde cada atención registrada genera automáticamente su factura
en estado **Pendiente**, y el equipo administrativo la marca como **Facturada** desde la pantalla de Facturación.

## Stack

- **Frontend:** React 18 + Vite + TypeScript + TailwindCSS + React Query + React Hook Form + Zod + Recharts
- **Backend:** Node.js + Express + TypeScript, arquitectura en capas (routes → controllers → services → repositories)
- **Base de datos:** PostgreSQL + Prisma ORM
- **Excel:** ExcelJS (importación de pacientes, exportación de reportes)
- **Infraestructura local:** Docker Compose (solo para PostgreSQL)

## Estructura del proyecto

```
.
├── docker-compose.yml          # PostgreSQL local
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de datos (Usuario, Cliente, Atencion, Factura)
│   │   └── seed.ts             # Datos de ejemplo
│   └── src/
│       ├── config/             # env, prisma client, multer
│       ├── middlewares/        # auth (JWT + roles), manejo de errores
│       ├── validators/         # esquemas Zod por módulo
│       ├── repositories/       # acceso a datos (Prisma)
│       ├── services/           # lógica de negocio
│       ├── controllers/        # handlers HTTP
│       └── routes/             # definición de endpoints
└── frontend/
    └── src/
        ├── components/         # ui/, layout/, clientes/, atenciones/, facturacion/
        ├── pages/               # una página por pantalla
        ├── context/             # Auth y Theme (dark mode)
        ├── hooks/               # useDebounce, etc.
        ├── services/            # clientes de la API (axios)
        └── schemas/             # validación de formularios (Zod)
```

## Requisitos previos

- Node.js 18+
- Docker (para levantar PostgreSQL) — o un PostgreSQL propio si preferís no usar Docker
- Conexión a internet la primera vez que instalás dependencias (Prisma descarga sus motores de base de datos)

## Puesta en marcha (paso a paso)

```bash
# 1. Instalar dependencias del monorepo (backend + frontend) y generar el cliente de Prisma
npm install

# 2. Levantar PostgreSQL con Docker
docker compose up -d

# 3. Crear las tablas (migraciones)
npm run db:migrate

# 4. Cargar datos de ejemplo (pacientes, atenciones, usuarios de prueba)
npm run db:seed

# 5. Levantar backend + frontend en simultáneo
npm run dev
```

Con eso:
- Backend corriendo en **http://localhost:4000**
- Frontend corriendo en **http://localhost:5173**

También podés ejecutar los pasos 1 a 4 con un solo comando: `npm run setup`.

### Usuarios de prueba (creados por el seed)

| Usuario     | Contraseña | Rol             |
|-------------|------------|-----------------|
| `admin`     | `admin123` | Administrador   |
| `recepcion` | `staff123` | Administrativo  |

Solo el rol **Administrador** puede eliminar pacientes/atenciones y cancelar o reabrir facturas.

## Variables de entorno

El backend usa un archivo `.env` (ya incluido con valores por defecto para desarrollo local, ver `backend/.env.example`):

```
DATABASE_URL="postgresql://facturacion:facturacion@localhost:5432/facturacion?schema=public"
PORT=4000
JWT_SECRET="change-this-secret-in-production"
JWT_EXPIRES_IN="8h"
CORS_ORIGIN="http://localhost:5173"
```

Si vas a desplegar en producción, cambiá `JWT_SECRET` y `DATABASE_URL`.

## Comandos útiles

| Comando                | Descripción                                             |
|-------------------------|----------------------------------------------------------|
| `npm run dev`           | Backend + frontend en modo desarrollo                    |
| `npm run db:up`         | Levanta el contenedor de PostgreSQL                       |
| `npm run db:down`       | Apaga el contenedor de PostgreSQL                         |
| `npm run db:migrate`    | Corre las migraciones de Prisma                           |
| `npm run db:seed`       | Carga los datos de ejemplo                                 |
| `npm run db:studio`     | Abre Prisma Studio para explorar la base de datos visualmente |
| `npm run build`         | Compila backend y frontend para producción                |

## Modelo de datos

- **Cliente** (paciente): nombre, apellido, DNI (único), obra social, teléfono, email, observaciones.
- **Atención**: fecha, profesional, prestación, importe, vinculada a un paciente. **Al crearse, genera automáticamente
  una Factura en estado `PENDIENTE`** — así es como la pantalla de Facturación sabe qué mostrar.
- **Factura**: número de factura, fecha de factura, importe facturado, estado (`PENDIENTE` / `FACTURADO` /
  `CANCELADO`), vinculada 1 a 1 con una atención.

## Funcionalidades incluidas

- **Dashboard**: cantidad de pacientes, atenciones, pendientes/facturadas, montos, gráfico de ingresos por mes.
- **Pacientes**: CRUD completo con búsqueda por nombre, DNI u obra social, paginación e historial de atenciones.
- **Atenciones**: alta con selección de paciente (buscador), filtros por profesional/estado, eliminación (solo admin).
- **Facturación**: pantalla con las atenciones pendientes; "Marcar como facturada" pide número, fecha e importe.
- **Reportes**: exportación a Excel de pacientes, atenciones, facturadas, pendientes e ingresos por mes.
- **Importación**: carga de un Excel de pacientes con mapeo automático de columnas (nombre, apellido, DNI, obra
  social, teléfono, email, observaciones — tolera variantes de encabezado como "Teléfono"/"Celular").
- **Buscador global**: encuentra pacientes, atenciones y facturas desde la barra superior.
- **Autenticación**: login con JWT y dos roles (Administrador / Administrativo).
- **UI**: modo oscuro, toasts, confirmaciones antes de eliminar, skeletons de carga, paginación y ordenamiento.

## Despliegue en producción

Ver la sección "Despliegue en producción" más abajo, o seguí la guía que te dio Claude en el chat. En resumen:
base de datos en Neon/Supabase, backend en Render/Railway, frontend en Vercel, configurando `VITE_API_URL` en el
frontend y `CORS_ORIGIN` en el backend para que apunten entre sí.

## Notas de migración desde el flujo anterior

El proyecto original (`Chequeo-Facturacion`) comparaba dos archivos Excel para detectar atenciones sin facturar.
Ese flujo queda completamente reemplazado: ahora toda la información vive en PostgreSQL, y Excel se usa únicamente
para **importar** el histórico de pacientes y para **exportar** reportes — tal como se pidió en el brief original.

## Notas técnicas y decisiones de diseño

- Los importes se guardan como `Float` en la base de datos (no `Decimal`) para simplificar el manejo en JS/TS; para
  un sistema de facturación con auditoría contable estricta, se recomienda migrar a `Decimal` + una librería como
  `decimal.js` en el frontend.
- Cada `Atencion` crea su `Factura` pendiente en la misma transacción, por lo que no van a encontrar atenciones sin
  factura asociada.
- El buscador global y las búsquedas de listados usan `contains` con `mode: "insensitive"` de Prisma (requiere
  PostgreSQL, ya contemplado en el stack).
