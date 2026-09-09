import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const planSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  descripcion: z.string().trim().min(1, "La descripcion es obligatoria"),
  estado: z.string().trim().optional(),
});
export type PlanInput = z.infer<typeof planSchema>;

export const validatePlan = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const resultado = planSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: resultado.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });
  }
  req.body = resultado.data;
  next();
};
