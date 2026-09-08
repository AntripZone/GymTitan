import { prisma } from "../config/prisma";

export const sesionEntrenamientoModel = {
  getAll: async () => {
    return await prisma.sesionEntrenamiento.findMany({
      include: {
        socio: true,
        entrenador: true,
      },
      orderBy: [
        {
          fecha: "asc",
        },
        {
          hora: "asc",
        },
      ],
    });
  },

  getById: async (id: number) => {
    return await prisma.sesionEntrenamiento.findUnique({
      where: {
        id,
      },
      include: {
        socio: true,
        entrenador: true,
      },
    });
  },

  create: async (data: {
    fecha: Date;
    hora: Date;
    socioId: number;
    entrenadorId: number;
  }) => {
    return await prisma.sesionEntrenamiento.create({
      data: {
        fecha: data.fecha,
        hora: data.hora,
        socioId: data.socioId,
        entrenadorId: data.entrenadorId,
        estado: "PROGRAMADA",
      },
      include: {
        socio: true,
        entrenador: true,
      },
    });
  },

  update: async (
    id: number,
    data: {
      fecha?: Date;
      hora?: Date;
      socioId?: number;
      entrenadorId?: number;
    },
  ) => {
    return await prisma.sesionEntrenamiento.update({
      where: {
        id,
      },
      data,
      include: {
        socio: true,
        entrenador: true,
      },
    });
  },

  getSesionesDelEntrenador: async (entrenadorId: number, fecha: Date) => {
    return await prisma.sesionEntrenamiento.findMany({
      where: {
        entrenadorId,
        fecha,
      },
      include: {
        socio: true,
      },
      orderBy: {
        hora: "asc",
      },
    });
  },

  actualizarEstado: async (id: number, estado: "ASISTIO" | "FALTO") => {
    return await prisma.sesionEntrenamiento.update({
      where: {
        id,
      },
      data: {
        estado,
      },
    });
  },

  contarSesionesCompletadas: async (entrenadorId: number) => {
    return await prisma.sesionEntrenamiento.count({
      where: {
        entrenadorId,
        estado: "ASISTIO",
      },
    });
  },
};
