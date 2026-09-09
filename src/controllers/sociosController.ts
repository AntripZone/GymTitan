import type { Request, Response } from "express";
import { sociosModel } from "../models/sociosModels.js";
import type {
  SocioInput,
  SocioUpdateInput,
} from "../middlewares/validarSocio.js";

export const sociosController = {
  create: async (req: Request, res: Response) => {
    /*
      #swagger.tags = ['Socios']
      #swagger.summary = 'Inscribe un socio nuevo'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nombre", "apellido", "ci"],
              properties: {
                nombre: { type: "string", example: "Valeria" },
                apellido: { type: "string", example: "Ccahuana" },
                telefono: { type: "string", example: "976543210" },
                email: { type: "string", example: "valeria@example.com" },
                fechaNacimiento: { type: "string", format: "date", example: "1995-02-14" }
              }
            }
          }
        }
      }
      #swagger.responses[201] = { description: 'Socio inscrito' }
      #swagger.responses[400] = { description: 'Datos inválidos' }
      #swagger.responses[401] = { description: 'Token no proporcionado o inválido' }
      #swagger.responses[403] = { description: 'El rol no tiene permiso' }
    */
    try {
      const data = req.body as SocioInput;
      if (data.email) {
        const emailExistente = await sociosModel.validarCorreo(data.email);
        if (emailExistente)
          return res.status(409).json({
            error: `Ya existe un socio con ese email: "${emailExistente.email}"`,
          });
      }

      const socio = await sociosModel.create(data);
      return res.status(201).json(socio);
    } catch (error) {
      console.error("POST /api/socios: :", error);
      return res.status(500).json({ error: "Error al registrar al socio" });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Socios']
      #swagger.summary = 'Lista los socios con su membresía más reciente'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
    */
      const socios = await sociosModel.getAll();
      return res.json(socios);
    } catch (error) {
      console.error("GET /api/socios:", error);
      res.status(500).json({ error: "Error al obtener los socios." });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Socios']
      #swagger.summary = 'Actualiza los datos de un socio'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['id'] = { in: 'path', description: 'Id del socio', required: true, type: 'integer' }
      #swagger.responses[404] = { description: 'Socio no encontrado' }
      #swagger.responses[409] = { description: 'CI o correo en uso por otro socio' }
    */
      const id = Number(req.params.id);
      if (!id) {
        return res
          .status(400)
          .json({ error: "El id debe ser un número entero positivo" });
      }

      const data = req.body as SocioUpdateInput;

      const socio = await sociosModel.getById(id);
      if (!socio) {
        return res.status(404).json({ error: "Socio no encontrado" });
      }

      if (data.email && data.email !== socio.email) {
        const enUso = await sociosModel.validarCorreo(data.email);
        if (enUso) {
          return res
            .status(409)
            .json({ error: "Ese correo pertenece a otro socio" });
        }
      }

      const actualizado = await sociosModel.actualizar(id, data);
      return res.status(200).json(actualizado);
    } catch (error) {
      console.error("PUT /api/socios/:id:", error);
      return res.status(500).json({ error: "Error al actualizar el socio" });
    }
  },
  porVencer: async (req: Request, res: Response) => {
    try {
      /*
      #swagger.tags = ['Socios']
      #swagger.summary = 'Socios cuya membresía vence en los próximos días'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.autoHeaders = false
      #swagger.parameters['dias'] = { in: 'query', description: 'Días hacia adelante (por defecto 5)', required: false, type: 'integer' }
    */
      const dias = req.query.dias ? Number(req.query.dias) : 5;

      if (!Number.isInteger(dias) || dias < 1 || dias > 365) {
        return res
          .status(400)
          .json({ error: "Los días deben ser un entero entre 1 y 365" });
      }

      const membresias = await sociosModel.porVencer(dias);
      return res.json({ dias, total: membresias.length, membresias });
    } catch (error) {
      console.error("GET /api/socios/por-vencer:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener las membresías por vencer" });
    }
  },
};
