import express from "express";
import { createUser, getUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/:id", getUser);

export default router;
