import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";
import { sociosController } from "../controllers/sociosController.js";
import {
  validarSocio,
  validarSocioUpdate,
} from "../middlewares/validarSocio.js";

const router = Router();

router.get(
  "/por-vencer",
  verificarToken,
  autorizar("ADMINISTRACION"),
  sociosController.porVencer,
);

router.post(
  "/",
  verificarToken,
  autorizar("RECEPCION", "ADMINISTRACION"),
  validarSocio,
  sociosController.create,
);

router.get(
  "/",
  verificarToken,
  autorizar("RECEPCION", "ADMINISTRACION"),
  sociosController.getAll,
);

export default router;
