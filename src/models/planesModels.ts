import { prisma } from "../config/prisma.js";
import type { PlanInput } from "../middlewares/validarPlan.js";

export const planesModel = {
  createPlan: async (data: PlanInput) => {
    return await prisma.planes.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: data.estado ?? "Activo",
      },
    });
  },

  getAllPlanes: async () => {
    return await prisma.planes.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  getPlanById: async (id: number) => {
    return await prisma.planes.findUnique({
      where: { id },
    });
  },
};
