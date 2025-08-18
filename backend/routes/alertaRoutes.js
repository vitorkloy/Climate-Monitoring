import express from "express";
import { createAlerta, getAlertas } from "../controllers/alertaController.js";

const router = express.Router();

router.post("/", createAlerta);
router.get("/:localidadeId", getAlertas);

export default router;
