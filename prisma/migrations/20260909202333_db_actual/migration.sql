-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRACION', 'RECEPCION', 'ENTRENADOR');

-- CreateEnum
CREATE TYPE "EstadoMembresia" AS ENUM ('ACTIVA', 'SUSPENDIDA');

-- CreateEnum
CREATE TYPE "EstadoSesion" AS ENUM ('PROGRAMADA', 'ASISTIO', 'FALTO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_mes" DECIMAL(10,2) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_nacimiento" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membresias" (
    "id" SERIAL NOT NULL,
    "socioId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "precioPagado" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoMembresia" NOT NULL DEFAULT 'ACTIVA',

    CONSTRAINT "membresias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones_entrenamiento" (
    "id" SERIAL NOT NULL,
    "socio_id" INTEGER NOT NULL,
    "entrenador_id" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoSesion" NOT NULL DEFAULT 'PROGRAMADA',

    CONSTRAINT "sesiones_entrenamiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "socios_email_key" ON "socios"("email");

-- CreateIndex
CREATE INDEX "membresias_socioId_idx" ON "membresias"("socioId");

-- CreateIndex
CREATE INDEX "membresias_planId_idx" ON "membresias"("planId");

-- CreateIndex
CREATE INDEX "membresias_estado_fechaFin_idx" ON "membresias"("estado", "fechaFin");

-- CreateIndex
CREATE INDEX "sesiones_entrenamiento_estado_fecha_hora_idx" ON "sesiones_entrenamiento"("estado", "fecha_hora");

-- CreateIndex
CREATE INDEX "sesiones_entrenamiento_fecha_hora_idx" ON "sesiones_entrenamiento"("fecha_hora");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_entrenamiento_entrenador_id_fecha_hora_key" ON "sesiones_entrenamiento"("entrenador_id", "fecha_hora");

-- AddForeignKey
ALTER TABLE "membresias" ADD CONSTRAINT "membresias_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "socios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membresias" ADD CONSTRAINT "membresias_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_entrenamiento" ADD CONSTRAINT "sesiones_entrenamiento_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_entrenamiento" ADD CONSTRAINT "sesiones_entrenamiento_entrenador_id_fkey" FOREIGN KEY ("entrenador_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
