import { prisma } from "../config/prisma.js";
import type { PlanInput } from "../middlewares/validarPlan.js";

export const planesModel = {
  createPlan: async (data: PlanInput) => {
    return await prisma.plan.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioMes: data.precioMes,
        estado: data.estado ?? true,
      },
    });
  },

  getAllPlanes: async () => {
    return await prisma.plan.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  getPlanById: async (id: number) => {
    return await prisma.plan.findUnique({
      where: { id },
    });
  },
  updatePlan: async (id: number, data: PlanInput) => {
    return await prisma.plan.update({
      where: { id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioMes: data.precioMes,
        estado: data.estado ?? true,
      },
    });
  },

  deletePlan: async (id: number) => {
    return await prisma.plan.update({
      where: { id },
      data: { estado: false },
      select: {
        nombre: true,
        descripcion: true,
      },
    });
  },
};
