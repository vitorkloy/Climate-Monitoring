import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Rotas
import userRoutes from "./routes/userRoutes.js";
import localidadeRoutes from "./routes/localidadeRoutes.js";
import alertaRoutes from "./routes/alertaRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // URL do frontend
    credentials: true, // Permite cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  })
);
app.use(cookieParser());
app.use(express.json());

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/localidades", localidadeRoutes);
app.use("/api/alertas", alertaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
