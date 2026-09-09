import { Router } from "express";

import { planesController } from "../controllers/planesController.js";

import { validatePlan } from "../middlewares/validarPlan.js";

import { verificarToken } from "../middlewares/authMiddleware.js";

import { autorizar } from "../middlewares/authRolMiddleware.js";

const router = Router();

router.post(
  "/",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  validatePlan,
  planesController.create,
);

router.get(
  "/",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  planesController.getAll,
);

router.get(
  "/:id",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  planesController.getById,
);

router.put(
  "/:id",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  validatePlan,
  planesController.update,
);

router.delete(
  "/:id",
  verificarToken,
  autorizar("RECEPCIONISTA"),
  planesController.delete,
);

export default router;
