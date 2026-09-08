-- CreateEnum
CREATE TYPE "EstadoSocio" AS ENUM ('ASISTIO', 'FALTO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('RECEPCIONISTA', 'ENTRENADORES', 'ADMINISTRACION');

-- CreateTable
CREATE TABLE "AdquisicionDePlan" (
    "id" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "socio_Id" INTEGER NOT NULL,
    "planes_Id" INTEGER NOT NULL,

    CONSTRAINT "AdquisicionDePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "direccion" VARCHAR(255),
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesionesEntrenamiento" (
    "id" SERIAL NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoSocio" NOT NULL,
    "socio_Id" INTEGER NOT NULL,

    CONSTRAINT "sesionesEntrenamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "socios_email_key" ON "socios"("email");

-- CreateIndex
CREATE INDEX "sesionesEntrenamiento_socio_Id_fecha_hora_idx" ON "sesionesEntrenamiento"("socio_Id", "fecha_hora");

-- CreateIndex
CREATE UNIQUE INDEX "sesionesEntrenamiento_socio_Id_fecha_hora_key" ON "sesionesEntrenamiento"("socio_Id", "fecha_hora");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "AdquisicionDePlan" ADD CONSTRAINT "AdquisicionDePlan_socio_Id_fkey" FOREIGN KEY ("socio_Id") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdquisicionDePlan" ADD CONSTRAINT "AdquisicionDePlan_planes_Id_fkey" FOREIGN KEY ("planes_Id") REFERENCES "Planes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesionesEntrenamiento" ADD CONSTRAINT "sesionesEntrenamiento_socio_Id_fkey" FOREIGN KEY ("socio_Id") REFERENCES "socios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
