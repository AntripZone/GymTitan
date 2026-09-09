import express from "express";
import authRouter from "./routes/authRoutes";
import socioRouter from "./routes/socioRoutes";
import usuarioRouter from "./routes/userRoutes";

import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";

const app = express();

app.use(express.json());

const swaggerDocumentPath = path.resolve("src/swagger-output.json");

if (fs.existsSync(swaggerDocumentPath)) {
  const swaggerDocument = JSON.parse(
    fs.readFileSync(swaggerDocumentPath, "utf-8"),
  );
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/auth", authRouter);
app.use("/socios", socioRouter);
app.use("/usuarios", usuarioRouter);

app.listen(3000, () => {
  console.log(`servidor corriendo en http://localhost:3000`);
  console.log(
    `la documentacion de swagger corriendo en http://localhost:3000/api-docs`,
  );
});
