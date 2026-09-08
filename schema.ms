```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// USUARIOS DEL SISTEMA
// ==========================================

model Usuario {
  id         Int      @id @default(autoincrement())
  nombre     String
  apellido   String
  email      String   @unique
  password   String
  rol        Rol

  // Un usuario puede ser entrenador
  sesionesEntrenamiento SesionEntrenamiento[] @relation("EntrenadorSesiones")

  @@map("usuarios")
}

// ==========================================
// PLANES
// ==========================================

model Plan {
  id           Int      @id @default(autoincrement())
  nombre       String
  descripcion  String?
  precio_mes   Decimal  @db.Decimal(10, 2)


  membresias Membresia[]

  @@map("planes")
}

// ==========================================
// SOCIOS / CLIENTES
// ==========================================

model Socio {
  id              Int      @id @default(autoincrement())
  nombre          String
  apellido        String
  ci              String   @unique
  telefono        String?
  email           String?  @unique
  fechaNacimiento DateTime?

  membresias            Membresia[]
  sesionesEntrenamiento SesionEntrenamiento[]

  @@map("socios")
}

// ==========================================
// MEMBRESIAS
// ==========================================

model Membresia {
  id           Int      @id @default(autoincrement())
  socioId      Int
  planId       Int
  fechaInicio  DateTime
  fechaFin     DateTime
  precioPagado Decimal  @db.Decimal(10, 2)
  estado       EstadoMembresia @default(ACTIVA)

  socio Socio @relation(fields: [socioId], references: [id])
  plan  Plan  @relation(fields: [planId], references: [id])

  @@index([socioId])
  @@index([planId])
  @@map("membresias")
}

// ==========================================
// SESIONES DE ENTRENAMIENTO
// ==========================================

model SesionEntrenamiento {
  id          Int      @id @default(autoincrement())
  socioId     Int
  entrenadorId Int
  fecha       DateTime
  hora        DateTime
  estado      EstadoSesion @default(PROGRAMADA)

  socio       Socio   @relation(fields: [socioId], references: [id])
  entrenador  Usuario @relation(
    "EntrenadorSesiones",
    fields: [entrenadorId],
    references: [id]
  )

  @@index([socioId])
  @@index([entrenadorId])
  @@index([fecha])
  @@map("sesiones_entrenamiento")
}

// ==========================================
// ENUMS
// ==========================================

enum Rol {
  ADMIN
  RECEPCION
  ENTRENADOR
}

enum EstadoMembresia {
  ACTIVA
  SUSPENDIDA
}

enum EstadoSesion {
  PROGRAMADA
  ASISTIO
  FALTO
}
```
