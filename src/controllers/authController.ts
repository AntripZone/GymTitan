import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/usuariosModels.js";
import type { RegistroInput, LoginInput } from "../middlewares/validarAuth.js";

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Registra una cuenta de acceso'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["nombre", "apellido", "email", "password", "rol"],
            properties: {
              nombre: { type: "string", example: "Carla" },
              apellido: { type: "string", example: "Ríos" },
              email: { type: "string", example: "recepcion@gym.com" },
              password: { type: "string", example: "recepcion123" },
              rol: { type: "string", enum: ["ADMINISTRACION", "RECEPCION", "ENTRENADOR"], example: "RECEPCION" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = { description: 'Usuario creado' }
    #swagger.responses[409] = { description: 'El correo ya está registrado' }
  */
      const { nombre, apellido, email, password, rol } =
        req.body as RegistroInput;
      const existeUsusario = await userModel.validarCorreoDuplicado(email);
      if (existeUsusario)
        return res.status(409).json({
          message: existeUsusario.estado
            ? "Ya existe un usuario con ese correo"
            : "Ya existe un usuario con ese correo",
        });

      const passwordHash = await bcrypt.hash(password, 10);
      const usuario = await userModel.create({
        nombre,
        apellido,
        email,
        passwordHash,
        rol,
      });

      return res.status(201).json(usuario);
    } catch (error) {
      console.error("POST /api/auth/register: ", error);
      return res.status(500).json({ message: "Error al registrar el usuario" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Inicia sesión y devuelve un token JWT'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", example: "recepcion@gym.com" },
              password: { type: "string", example: "recepcion123" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Token emitido' }
    #swagger.responses[401] = { description: 'Credenciales inválidas' }
  */
      const { email, password } = req.body as LoginInput;
      const usuario = await userModel.validarCorreo(email);

      if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash)))
        return res.status(401).json({ message: "Credenciales invalidas" });

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET as string,
        { expiresIn: "8h" },
      );
      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      });
    } catch (error) {
      console.error("POST /api/auth/login: ", error);
      return res.status(500).json({ message: "Error al inicial sesion" });
    }
  },

  me: async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Devuelve el usuario del token actual'
    #swagger.security = [{ "bearerAuth": [] }]
  */
    return res.json(req.user);
  },
};
