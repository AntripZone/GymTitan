import { Router } from "express";
import { usuariosController } from "../controllers/userController.js";
import { validarUsuarioUpdate } from "../middlewares/validarUser.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { autorizar } from "../middlewares/authRolMiddleware.js";

const router = Router();

router.get(
  "/",
  verificarToken,
  autorizar("ADMINISTRACION"),
  usuariosController.getAll,
);
router.get(
  "/:id",
  verificarToken,
  autorizar("ADMINISTRACION"),
  usuariosController.getById,
);
router.put(
  "/:id",
  verificarToken,
  autorizar("ADMINISTRACION"),
  validarUsuarioUpdate,
  usuariosController.update,
);
router.delete(
  "/:id",
  verificarToken,
  autorizar("ADMINISTRACION"),
  usuariosController.eliminar,
);
router.patch(
  "/:id/restaurar",
  verificarToken,
  autorizar("ADMINISTRACION"),
  usuariosController.restaurar,
);

export default router;
