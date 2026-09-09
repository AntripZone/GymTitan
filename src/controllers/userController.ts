import type { Request, Response } from "express";
import { userModel } from "../models/userModels.js";
import { Rol } from "../generated/prisma/enums.js";
import type { UsuarioUpdateInput } from "../middlewares/validarUser.js";

export const usuariosController = {
  getAll: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Usuarios']
      #swagger.summary = 'Lista el personal, con filtro opcional por rol'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['rol'] = { in: 'query', description: 'Filtra por rol', required: false, type: 'string', enum: ['ADMINISTRACION', 'RECEPCION', 'ENTRENADOR'] }
      #swagger.responses[400] = { description: 'Rol inválido' }
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
    */
      const rol = req.query.rol as string | undefined;

      //El query no pasa por zod, se valida aquí
      if (rol && !Object.values(Rol).includes(rol as Rol)) {
        return res.status(400).json({
          error: `El rol debe ser uno de: ${Object.values(Rol).join(", ")}`,
        });
      }

      const usuarios = await userModel.getAll(rol as Rol | undefined);
      return res.json(usuarios);
    } catch (error) {
      console.error("GET /usuarios:", error);
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Usuarios']
      #swagger.summary = 'Devuelve un usuario por id'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['id'] = { in: 'path', description: 'Id del usuario', required: true, type: 'integer' }
      #swagger.responses[404] = { description: 'Usuario no encontrado' }
    */
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: "El id debe ser un número entero positivo" });
      }

      const usuario = await userModel.getById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      return res.json(usuario);
    } catch (error) {
      console.error("GET /usuarios/:id:", error);
      return res.status(500).json({ error: "Error al obtener el usuario" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Usuarios']
      #swagger.summary = 'Actualiza nombre, apellido, correo o rol de un usuario'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['id'] = { in: 'path', description: 'Id del usuario', required: true, type: 'integer' }
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                nombre: { type: "string", example: "Carla" },
                apellido: { type: "string", example: "Ríos Vega" },
                email: { type: "string", example: "carla.rios@gym.com" },
                rol: { type: "string", enum: ["ADMINISTRACION", "RECEPCION", "ENTRENADOR"], example: "ADMINISTRACION" }
              }
            }
          }
        }
      }
      #swagger.responses[404] = { description: 'Usuario no encontrado' }
      #swagger.responses[409] = { description: 'Correo en uso o último administrador' }
    */
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: "El id debe ser un número entero positivo" });
      }

      const data = req.body as UsuarioUpdateInput;

      const usuario = await userModel.getById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      if (data.email && data.email !== usuario.email) {
        const enUso = await userModel.validarCorreoDuplicado(data.email);
        if (enUso) {
          return res
            .status(409)
            .json({ error: "Ese correo pertenece a otro usuario" });
        }
      }
      const actualizado = await userModel.actualizar(id, data);
      return res.json(actualizado);
    } catch (error) {
      console.error("PUT /usuarios/:id:", error);
      return res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Usuarios']
      #swagger.summary = 'Da de baja una cuenta de personal'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['id'] = { in: 'path', description: 'Id del usuario', required: true, type: 'integer' }
      #swagger.responses[404] = { description: 'Usuario no encontrado' }
      #swagger.responses[409] = { description: 'Cuenta propia o último administrador' }
    */
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: "El id debe ser un número entero positivo" });
      }

      if (req.user?.id === id) {
        return res
          .status(409)
          .json({ error: "No puedes dar de baja tu propia cuenta" });
      }

      const usuario = await userModel.getById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const eliminado = await userModel.eliminar(id);
      return res.json(eliminado);
    } catch (error) {
      console.error("DELETE /usuarios/:id:", error);
      return res.status(500).json({ error: "Error al dar de baja el usuario" });
    }
  },

  restaurar: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Usuarios']
      #swagger.summary = 'Reactiva una cuenta dada de baja'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['id'] = { in: 'path', description: 'Id del usuario', required: true, type: 'integer' }
      #swagger.responses[404] = { description: 'Usuario no encontrado' }
    */
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ error: "El id debe ser un número entero positivo" });
      }

      //getById filtra estado: true, así que aquí busco por el id sin ese filtro
      const restaurado = await userModel.restaurar(id);
      return res.json(restaurado);
    } catch (error) {
      console.error("PATCH /usuarios/:id/restaurar:", error);
      return res.status(500).json({ error: "Error al restaurar el usuario" });
    }
  },
};
