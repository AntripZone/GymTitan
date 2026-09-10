import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const socioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(255),
  apellido: z.string().trim().min(1, "El apellido es obligatorio").max(255),
  telefono: z
    .string()
    .trim()
    .min(6, "El teléfono es demasiado corto")
    .max(20, "El teléfono es demasiado largo")
    .optional(),
  email: z
    .string()
    .trim()
    .max(150, "El correo es demasiado largo")
    .pipe(z.email("El correo no tiene un formato valido"))
    .optional(),
  fechaNacimiento: z.coerce
    .date({ message: "La fecha de nacimiento no es una fecha válida" })
    .max(new Date(), "La fecha de nacimiento no puede ser futura")
    .optional(),
});

export const socioUpdateSchema = socioSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export type SocioInput = z.infer<typeof socioSchema>;
export type SocioUpdateInput = z.infer<typeof socioUpdateSchema>;

const validar =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);

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

export const validarSocio = validar(socioSchema);
export const validarSocioUpdate = validar(socioUpdateSchema);
