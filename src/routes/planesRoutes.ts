import { Router } from "express";
import { planesController } from "../controllers/planesController.js";
import { validatePlan } from "../middlewares/validarPlan.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";

const router = Router();

router.post(
  "/",
  verificarToken,
  autorizar("ADMINISTRACION"),
  validatePlan,
  planesController.create,
);

router.get(
  "/",
  verificarToken,
  autorizar("RECEPCION"),
  planesController.getAll,
);

router.get(
  "/:id",
  verificarToken,
  autorizar("RECEPCION"),
  planesController.getById,
);

router.put(
  "/:id",
  verificarToken,
  autorizar("ADMINISTRACION"),
  validatePlan,
  planesController.update,
);

router.delete(
  "/:id",
  verificarToken,
  autorizar("ADMINISTRACION"),
  planesController.delete,
);

export default router;
