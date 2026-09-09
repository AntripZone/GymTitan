import type { Request, Response } from "express";
import { planesModel } from "../models/planesModels";
import type { PlanInput } from "../middlewares/validarPlan";

export const planesController = {
  create: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Planes']
      #swagger.summary = 'Registra un plan nuevo'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nombre", "descripcion"],
              properties: {
                nombre: { type: "string", example: "Plan Mensual" },
                descripcion: { type: "string", example: "Acceso al gimnasio durante un mes" },
                estado: { type: "string", example: "Activo" }
              }
            }
          }
        }
      }
      #swagger.responses[201] = { description: 'Plan creado' }
      #swagger.responses[400] = { description: 'Datos inválidos' }
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
    */

      const data = req.body as PlanInput;

      const plan = await planesModel.createPlan(data);

      return res.status(201).json(plan);
    } catch (error) {
      console.error("POST /api/planes:", error);
      return res.status(500).json({
        error: "Error al registrar el plan",
      });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Planes']
      #swagger.summary = 'Ver todos los planes'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
      */

      const planes = await planesModel.getAllPlanes();

      return res.json(planes);
    } catch (error) {
      console.error("GET /api/planes:", error);
      return res.status(500).json({
        error: "Error al obtener los planes",
      });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Planes']
      #swagger.summary = 'Ver un plan por su id'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Id del plan',
        required: true,
        type: 'integer'
      }
      #swagger.responses[400] = { description: 'Id inválido' }
      #swagger.responses[404] = { description: 'Plan no encontrado' }
      */

      const id = Number(req.params.id);

      if (!id || id <= 0) {
        return res.status(400).json({
          error: "El id debe ser un número entero positivo",
        });
      }

      const plan = await planesModel.getPlanById(id);

      if (!plan) {
        return res.status(404).json({
          error: "Plan no encontrado",
        });
      }

      return res.json(plan);
    } catch (error) {
      console.error("GET /api/planes/:id:", error);
      return res.status(500).json({
        error: "Error al obtener el plan",
      });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Planes']
      #swagger.summary = 'Actualiza un plan'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Id del plan',
        required: true,
        type: 'integer',
        example: 1
      }
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nombre", "descripcion"],
              properties: {
                nombre: {
                  type: "string",
                  example: "Plan Mensual VIP"
                },
                descripcion: {
                  type: "string",
                  example: "Acceso completo al gimnasio durante un mes"
                },
                estado: {
                  type: "string",
                  example: "Activo"
                }
              }
            }
          }
        }
      }
      #swagger.responses[200] = { description: 'Plan actualizado correctamente' }
      #swagger.responses[400] = { description: 'Id inválido o datos inválidos' }
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
      #swagger.responses[404] = { description: 'Plan no encontrado' }
      */

      const id = Number(req.params.id);

      if (!id || id <= 0) {
        return res.status(400).json({
          error: "El id debe ser un número entero positivo",
        });
      }

      const data = req.body as PlanInput;

      const planExistente = await planesModel.getPlanById(id);

      if (!planExistente) {
        return res.status(404).json({
          error: "Plan no encontrado",
        });
      }

      const plan = await planesModel.updatePlan(id, data);

      return res.json(plan);
    } catch (error) {
      console.error("PUT /api/planes/:id:", error);
      return res.status(500).json({
        error: "Error al actualizar el plan",
      });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Planes']
      #swagger.summary = 'Elimina un plan'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Id del plan',
        required: true,
        type: 'integer',
        example: 1
      }
      #swagger.responses[200] = { description: 'Plan eliminado correctamente' }
      #swagger.responses[400] = { description: 'Id inválido' }
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
      #swagger.responses[404] = { description: 'Plan no encontrado' }
      */

      const id = Number(req.params.id);

      if (!id || id <= 0) {
        return res.status(400).json({
          error: "El id debe ser un número entero positivo",
        });
      }

      const planExistente = await planesModel.getPlanById(id);

      if (!planExistente) {
        return res.status(404).json({
          error: "Plan no encontrado",
        });
      }

      await planesModel.deletePlan(id);

      return res.json({
        mensaje: "Plan eliminado correctamente",
      });
    } catch (error) {
      console.error("DELETE /api/planes/:id:", error);
      return res.status(500).json({
        error: "Error al eliminar el plan",
      });
    }
  },
};
