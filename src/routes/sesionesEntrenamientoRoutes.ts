import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  getSesionesDelDia,
  actualizarEstado,
  contarSesionesCompletadas,
} from "../controllers/sesionesEntrenamientoController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";
import { validate } from "../middlewares/validateSE.js";
import {
  createSesionSchema,
  UpdateSesionEstadoSchema,
} from "../schema/sesionEntrenamiento.schema.js";

const router: Router = Router();

router.get(
  "/",
  verificarToken,
  autorizar("ENTRENADOR", "ADMINISTRACION"),
  getAll,
);

router.get(
  "/:id",
  verificarToken,
  autorizar("RECEPCION", "ADMINISTRACION"),
  getById,
);

router.post(
  "/",
  verificarToken,
  autorizar("RECEPCION", "ADMINISTRACION"),
  validate(createSesionSchema, "body"),
  create,
);

router.put("/:id", verificarToken, autorizar("ADMINISTRACION"), update);

router.get(
  "/entrenador/:entrenadorId",
  verificarToken,
  autorizar("ADMINISTRACION", "ENTRENADOR"),
  getSesionesDelDia,
);

router.patch(
  "/:id/estado",
  verificarToken,
  autorizar("ENTRENADOR", "ADMINISTRACION"),
  validate(UpdateSesionEstadoSchema, "body"),
  actualizarEstado,
);

router.get(
  "/entrenador/:entrenadorId/completadas",
  verificarToken,
  autorizar("ADMINISTRACION"),
  contarSesionesCompletadas,
);

export default router;
