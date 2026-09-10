import z from "zod";

export const createPlanesSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre del plan es obligatorio"),
  precioMes: z.coerce
    .number({ message: "El precio no es un número válido" })
    .positive("El precio debe ser mayor a cero")
    .max(99999999.99, "El precio es muy alto"),
  descripcion: z.string().trim().min(1, "La descripcion es obligatoria"),
  estado: z.boolean().optional(),
});

export const updatePlanSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre del plan es obligatorio")
    .optional(),
  precioMes: z.coerce
    .number({ message: "El precio no es un número válido" })
    .positive("El precio debe ser mayor a cero")
    .max(99999999.99, "El precio es muy alto")
    .optional(),
  descripcion: z
    .string()
    .trim()
    .min(1, "La descripcion es obligatoria")
    .optional(),
  estado: z.boolean().optional(),
});

export type PlanInput = z.infer<typeof createPlanesSchema>;
