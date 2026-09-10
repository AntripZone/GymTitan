import { prisma } from "../config/prisma.js";
import type {
  SocioInput,
  SocioUpdateInput,
} from "../middlewares/validarSocio.js";

export interface RegistrarSocio {
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email?: string | null | undefined;
  fechaNacimiento?: Date | null | undefined;
}

export interface ActualizarSocio {
  nombre?: string;
  apellido?: string;
  telefono?: string | null;
  email?: string | null | undefined;
  fechaNacimiento?: Date | null | undefined;
}

export const sociosModel = {
  getAll: async () => {
    return await prisma.socio.findMany({
      orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
      include: {
        membresias: {
          orderBy: { fechaFin: "desc" },
          take: 1,
          include: { plan: true },
        },
      },
    });
  },

  getById: async (id: number) => {
    return await prisma.socio.findUnique({
      where: { id },
      include: {
        membresias: {
          orderBy: { fechaInicio: "desc" },
          include: { plan: true },
        },
        sesionesEntrenamiento: {
          orderBy: { fechaHora: "desc" },
          include: {
            entrenador: {
              select: { id: true, nombre: true, apellido: true },
            },
          },
        },
      },
    });
  },

  validarCorreo: async (email: string) => {
    return await prisma.socio.findUnique({ where: { email } });
  },

  create: async (data: SocioInput) => {
    return await prisma.socio.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono ?? null,
        email: data.email ?? null,
        fechaNacimiento: data.fechaNacimiento ?? null,
      },
    });
  },
  actualizar: async (id: number, data: SocioUpdateInput) => {
    return await prisma.socio.update({
      where: { id },
      data: {
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(data.apellido !== undefined && { apellido: data.apellido }),
        ...(data.telefono !== undefined && { telefono: data.telefono }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.fechaNacimiento !== undefined && {
          fechaNacimiento: data.fechaNacimiento,
        }),
      },
    });
  },
  eliminar: async (id: number) => {
    return await prisma.socio.update({
      where: { id },
      data: { estado: false },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        estado: true,
      },
    });
  },
  porVencer: async (dias: number) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + dias);
    limite.setHours(23, 59, 59, 999);

    return await prisma.membresia.findMany({
      where: {
        estado: "ACTIVA",
        fechaFin: { gte: hoy, lte: limite },
      },
      orderBy: { fechaFin: "asc" },
      include: {
        socio: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true,
          },
        },
        plan: { select: { id: true, nombre: true } },
      },
    });
  },
};
