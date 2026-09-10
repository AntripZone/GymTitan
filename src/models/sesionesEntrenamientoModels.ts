import { prisma } from "../config/prisma";

export const sesionEntrenamientoModel = {
  getAll: async () => {
    return await prisma.sesionEntrenamiento.findMany({
      include: {
        socio: true,
        entrenador: true,
      },
      orderBy: {
        fechaHora: "asc",
      },
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
    socioId: number;
    entrenadorId: number;
    fechaHora: Date;
  }) => {
    return await prisma.sesionEntrenamiento.create({
      data: {
        socioId: data.socioId,
        entrenadorId: data.entrenadorId,
        fechaHora: data.fechaHora,
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
      socioId?: number;
      entrenadorId?: number;
      fechaHora?: Date;
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

  getSesionesDelDia: async (entrenadorId: number, inicio: Date, fin: Date) => {
    return await prisma.sesionEntrenamiento.findMany({
      where: {
        entrenadorId,
        fechaHora: {
          gte: inicio,
          lte: fin,
        },
      },
      include: {
        socio: true,
      },
      orderBy: {
        fechaHora: "asc",
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
      include: {
        socio: true,
        entrenador: true,
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
