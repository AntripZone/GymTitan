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

const router = Router();

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
  actualizarEstado,
);

router.get(
  "/entrenador/:entrenadorId/completadas",
  verificarToken,
  autorizar("ADMINISTRACION"),
  contarSesionesCompletadas,
);

export default router;
