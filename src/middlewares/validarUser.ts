import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Rol } from "../generated/prisma/enums.js";

export const usuarioUpdateSchema = z
  .object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio").max(255),
    apellido: z.string().trim().min(1, "El apellido es obligatorio").max(255),
    email: z
      .string()
      .trim()
      .max(150, "El correo es demasiado largo")
      .pipe(z.email("El correo no tiene un formato valido")),
    rol: z.enum(Rol, {
      message: "El rol debe ser ADMINISTRACION, RECEPCION o ENTRENADOR",
    }),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export type UsuarioUpdateInput = z.infer<typeof usuarioUpdateSchema>;

export const validarUsuarioUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const resultado = usuarioUpdateSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({
      error: "Datos invalidos",
      detalles: resultado.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });
  }

  req.body = resultado.data;
  return next();
};
