import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ṛoute imports
import projectRoutes from "./routes/projectRoutes"
import searchRoutes from "./routes/searchRoutes"
import taskRoutes from "./routes/taskRoutes"


// configuration
dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


import { PrismaClient } from '@prisma/client';  // ② now import Prisma
const prisma = new PrismaClient();              // ③ instantiate

// routes
app.get('/', (req, res) => {
  res.send('Backend is live');
});

app.use("/projects",projectRoutes)
app.use("/search",searchRoutes)
app.use("/tasks",taskRoutes)

const port = Number(process.env.PORT) || 3000;
try {
  app.listen(port,"0.0.0.0", () => {
    console.log(`Server running on port ${port}` );
  });
  
  } catch (err) {
    console.error("Server failed to start", err);
  }