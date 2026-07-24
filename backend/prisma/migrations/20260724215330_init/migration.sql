-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRADOR', 'ADMINISTRATIVO');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('PENDIENTE', 'FACTURADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMINISTRATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "obra_social" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atenciones" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "profesional" TEXT NOT NULL,
    "prestacion" TEXT NOT NULL,
    "importe" DOUBLE PRECISION NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atenciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id" SERIAL NOT NULL,
    "atencion_id" INTEGER NOT NULL,
    "numero_factura" TEXT,
    "fecha_factura" TIMESTAMP(3),
    "importe_facturado" DOUBLE PRECISION,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_dni_key" ON "clientes"("dni");

-- CreateIndex
CREATE INDEX "clientes_nombre_apellido_idx" ON "clientes"("nombre", "apellido");

-- CreateIndex
CREATE INDEX "atenciones_fecha_idx" ON "atenciones"("fecha");

-- CreateIndex
CREATE INDEX "atenciones_profesional_idx" ON "atenciones"("profesional");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_atencion_id_key" ON "facturas"("atencion_id");

-- CreateIndex
CREATE INDEX "facturas_estado_idx" ON "facturas"("estado");

-- AddForeignKey
ALTER TABLE "atenciones" ADD CONSTRAINT "atenciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_atencion_id_fkey" FOREIGN KEY ("atencion_id") REFERENCES "atenciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
