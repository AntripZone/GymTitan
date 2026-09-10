import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Rol } from "../generated/prisma/enums.js";

export const registroSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(255),
  apellido: z.string().trim().min(1, "El apellido es obligatorio").max(255),
  email: z
    .string()
    .trim()
    .max(150, "El correo es demasiado largo")
    .pipe(z.email("El correo no tiene un formato valido")),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol: z.enum(Rol, {
    message: "El rol debe ser ADMINISTRACION, RECEPCION o ENTRENADOR",
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("El correo no tiene un formato valido")),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type RegistroInput = z.infer<typeof registroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

const validar =
  (schema: typeof registroSchema | typeof loginSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success)
      return res.status(400).json({
        error: "Datos invalidos",
        detalles: resultado.error.issues.map((i) => ({
          campo: i.path.join("."),
          mensaje: i.message,
        })),
      });

    req.body = resultado.data;
    return next();
  };

export const validarRegistro = validar(registroSchema);
export const validarLogin = validar(loginSchema);
