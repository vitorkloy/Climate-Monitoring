import express from "express";
import {
  createUser,
  getUser,
  loginUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);

export default router;
