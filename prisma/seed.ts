import "dotenv/config";
import { scryptSync, randomBytes } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

//Si ya usas bcrypt en tu auth, reemplaza esto por bcrypt.hash(pass, 10)
const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const dia = (offset: number, hora: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hora, 0, 0, 0);
  d.setMilliseconds(0);
  return d;
};

const sumarMeses = (fecha: Date, meses: number) => {
  const d = new Date(fecha);
  d.setMonth(d.getMonth() + meses);
  return d;
};

async function main() {
  console.log("Datos de prueba...");

  // USUARIOS (staff del gimnasio)
  const usuarios = [
    {
      nombre: "Adrian Alva",
      email: "admin@gym.com",
      password: "Admin123!",
      rol: "ADMINISTRACION" as const,
    },
    {
      nombre: "Carla Ríos",
      email: "recepcion@gym.com",
      password: "Recepcion123!",
      rol: "RECEPCIONISTA" as const,
    },
    {
      nombre: "Bruno Salas",
      email: "entrenador@gym.com",
      password: "Entrenador123!",
      rol: "ENTRENADORES" as const,
    },
  ];

  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: {
        nombre: u.nombre,
        email: u.email,
        passwordHash: hashPassword(u.password),
        rol: u.rol,
      },
    });
  }

  // PLANES
  const planes = [
    {
      nombre: "Plan Mensual",
      descripcion: "Acceso ilimitado por 30 días",
      estado: "Activo",
    },
    {
      nombre: "Plan Trimestral",
      descripcion: "Acceso ilimitado por 3 meses",
      estado: "Activo",
    },
    {
      nombre: "Plan Anual",
      descripcion: "Acceso ilimitado por 12 meses",
      estado: "Activo",
    },
    {
      nombre: "Plan Estudiante",
      descripcion: "Tarifa reducida con carné vigente",
      estado: "Activo",
    },
    {
      nombre: "Plan Promocional 2024",
      descripcion: "Campaña de verano ya finalizada",
      estado: "Inactivo",
    },
  ];

  //Planes no tiene campo unique, así que valido por nombre antes de crear
  for (const p of planes) {
    const existe = await prisma.planes.findFirst({
      where: { nombre: p.nombre },
    });
    if (!existe) await prisma.planes.create({ data: p });
  }

  // SOCIOS
  const socios = [
    {
      nombre: "Adrian",
      apellido: "Alva",
      email: "adrian@example.com",
      telefono: "986437664",
      fechaNacimiento: new Date("1997-09-05"),
      direccion: "Urb. Los Laureles 225, Trujillo",
    },
    {
      nombre: "María",
      apellido: "Torres",
      email: "maria.torres@example.com",
      telefono: "912345678",
      fechaNacimiento: new Date("1992-11-02"),
      direccion: "Jr. Puno 456, Lima",
    },
    {
      nombre: "Javier",
      apellido: "Chávez",
      email: "javier.chavez@example.com",
      telefono: "965432187",
      fechaNacimiento: new Date("2000-07-21"),
      direccion: "Calle Los Olivos 89, Lima",
    },
    {
      nombre: "Rosa",
      apellido: "Quispe",
      email: "rosa.quispe@example.com",
      telefono: "998112233",
      fechaNacimiento: new Date("1988-03-14"),
      direccion: "Av. Brasil 1200, Lima",
    },
    {
      nombre: "Diego",
      apellido: "Ponce",
      email: "diego.ponce@example.com",
      telefono: "977554411",
      fechaNacimiento: new Date("1995-12-30"),
      direccion: null,
    },
  ];

  for (const s of socios) {
    await prisma.socios.upsert({
      where: { email: s.email },
      update: {},
      create: s,
    });
  }

  // ADQUISICIÓN DE PLANES
  // Mezcla de membresías vigentes y vencidas para poder probar
  const [mensual, trimestral, anual, estudiante] = await prisma.planes.findMany(
    {
      orderBy: { id: "asc" },
    },
  );
  const [socio1, socio2, socio3, socio4, socio5] = await prisma.socios.findMany(
    {
      orderBy: { id: "asc" },
    },
  );

  if (
    !mensual ||
    !trimestral ||
    !anual ||
    !estudiante ||
    !socio1 ||
    !socio2 ||
    !socio3 ||
    !socio4 ||
    !socio5
  ) {
    throw new Error("Faltan planes o socios base para crear las adquisiciones");
  }

  const adquisiciones = [
    //Vigentes
    {
      socioId: socio1.id,
      planId: anual.id,
      fecha_inicio: dia(-60, 0),
      fecha_fin: sumarMeses(dia(-60, 0), 12),
    },
    {
      socioId: socio2.id,
      planId: mensual.id,
      fecha_inicio: dia(-10, 0),
      fecha_fin: sumarMeses(dia(-10, 0), 1),
    },
    {
      socioId: socio3.id,
      planId: estudiante.id,
      fecha_inicio: dia(-5, 0),
      fecha_fin: sumarMeses(dia(-5, 0), 1),
    },
    {
      socioId: socio4.id,
      planId: trimestral.id,
      fecha_inicio: dia(-20, 0),
      fecha_fin: sumarMeses(dia(-20, 0), 3),
    },
    //Vencidas
    {
      socioId: socio2.id,
      planId: mensual.id,
      fecha_inicio: dia(-70, 0),
      fecha_fin: sumarMeses(dia(-70, 0), 1),
    },
    {
      socioId: socio5.id,
      planId: mensual.id,
      fecha_inicio: dia(-120, 0),
      fecha_fin: sumarMeses(dia(-120, 0), 1),
    },
  ];

  //AdquisicionDePlan tampoco tiene unique, valido por socio + plan + fecha de inicio
  for (const a of adquisiciones) {
    const existe = await prisma.adquisicionDePlan.findFirst({
      where: {
        socioId: a.socioId,
        planId: a.planId,
        fecha_inicio: a.fecha_inicio,
      },
    });
    if (!existe) await prisma.adquisicionDePlan.create({ data: a });
  }

  // SESIONES DE ENTRENAMIENTO
  // Pasadas con asistencia/falta y futuras programadas
  const sesiones = [
    { socioId: socio1.id, fechaHora: dia(-7, 7), estado: "ASISTIO" as const },
    { socioId: socio1.id, fechaHora: dia(-5, 7), estado: "ASISTIO" as const },
    { socioId: socio1.id, fechaHora: dia(-3, 7), estado: "FALTO" as const },
    { socioId: socio2.id, fechaHora: dia(-6, 18), estado: "ASISTIO" as const },
    { socioId: socio2.id, fechaHora: dia(-2, 18), estado: "FALTO" as const },
    { socioId: socio3.id, fechaHora: dia(-4, 20), estado: "ASISTIO" as const },
    { socioId: socio4.id, fechaHora: dia(-1, 6), estado: "ASISTIO" as const },
    //Futuras
    { socioId: socio1.id, fechaHora: dia(1, 7), estado: "FALTO" as const },
    { socioId: socio2.id, fechaHora: dia(2, 18), estado: "FALTO" as const },
    { socioId: socio3.id, fechaHora: dia(3, 20), estado: "FALTO" as const },
    { socioId: socio4.id, fechaHora: dia(4, 6), estado: "FALTO" as const },
  ];

  for (const s of sesiones) {
    await prisma.sesionesEntrenamiento.upsert({
      where: {
        socioId_fechaHora: { socioId: s.socioId, fechaHora: s.fechaHora },
      },
      update: {},
      create: s,
    });
  }

  // -------------------------------------------------------------------------
  const resumen = {
    usuarios: await prisma.usuario.count(),
    planes: await prisma.planes.count(),
    socios: await prisma.socios.count(),
    adquisiciones: await prisma.adquisicionDePlan.count(),
    sesiones: await prisma.sesionesEntrenamiento.count(),
  };
  console.log("Seed completado:", resumen);
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
