import { Router } from "express";
import { planesController } from "../controllers/planesController.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createPlanesSchema,
  updatePlanSchema,
} from "../schemas/planesSchema.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";

const router = Router();

router.post(
  "/",
  verificarToken,
  autorizar("ADMINISTRACION"),
  validate(createPlanesSchema),
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
  validate(updatePlanSchema),
  planesController.update,
);

router.delete(
  "/:id",
  verificarToken,
  autorizar("ADMINISTRACION"),
  planesController.delete,
);

export default router;
