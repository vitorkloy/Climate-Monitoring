import express from "express";
import {
  createLocalidade,
  getLocalidades,
} from "../controllers/localidadeController.js";

const router = express.Router();

router.post("/", createLocalidade);
router.get("/:userId", getLocalidades);

export default router;
