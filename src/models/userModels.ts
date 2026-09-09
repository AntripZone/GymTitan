import { prisma } from "../config/prisma.js";
import { Rol } from "../generated/prisma/enums.js";

export interface RegistrarUsuario {
  nombre: string;
  apellido: string;
  email: string;
  passwordHash: string;
  rol: Rol;
}

export interface ActualizarUsuario {
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: Rol;
}

export const userModel = {
  getAll: async (rol?: Rol) => {
    return await prisma.usuario.findMany({
      where: rol ? { rol } : {},
      orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        estado: true,
        creadoEn: true,
      },
    });
  },
  validarCorreo: async (email: string) => {
    return await prisma.usuario.findFirst({ where: { email, estado: true } });
  },
  validarCorreoDuplicado: async (email: string) => {
    return await prisma.usuario.findUnique({ where: { email } });
  },
  create: async (data: RegistrarUsuario) => {
    return await prisma.usuario.create({
      data,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        estado: true,
        creadoEn: true,
      },
    });
  },
  actualizar: async (id: number, data: ActualizarUsuario) => {
    return await prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        creadoEn: true,
      },
    });
  },
  eliminar: async (id: number) => {
    return await prisma.usuario.update({
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
  restaurar: async (id: number) => {
    return await prisma.usuario.update({
      where: { id },
      data: { estado: true },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        estado: true,
      },
    });
  },
};
