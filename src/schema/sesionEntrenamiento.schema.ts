import z from "zod";
import { EstadoSesion } from "../generated/prisma/enums";

export const createSesionSchema = z.object({
  socioId: z
    .number({
      message: "El socioId es obligatorio",
    })
    .int("El socioId debe ser un número entero")
    .positive("El socioId debe ser positivo"),

  entrenadorId: z
    .number({
      message: "El entrenadorId es obligatorio",
    })
    .int("El entrenadorId debe ser un número entero")
    .positive("El entrenadorId debe ser positivo"),

  fechaHora: z
    .string({
      message: "La fecha y hora son obligatorias",
    })
    .datetime({
      message:
        "La fechaHora debe tener un formato válido, ejem:(YYYY-MM-DDTHH:MM:SS)",
    }),
});

export const UpdateSesionEstadoSchema = z.object({
  estado: z.enum(EstadoSesion),
});
