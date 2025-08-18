// backend/routes/userRoutes.js
import express from "express";
import { createUser, getUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// Rotas mais específicas primeiro
router.post("/register", createUser);
router.post("/login", loginUser); // Mova esta rota para CIMA

// Rotas mais genéricas por último
router.get("/:id", getUser); // Esta rota deve ser a ÚLTIMA para /users/:id

export default router;
