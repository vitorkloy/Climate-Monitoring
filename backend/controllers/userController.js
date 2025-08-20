import User from "../models/User.js";
import Localidade from "../models/Localidade.js";
import bcrypt, { hash } from "bcryptjs";

export const createUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const user = await User.create({ nome, email, senha });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }
    res.status(400).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate({
      path: "cidades",
      populate: {
        path: "alertas",
        model: "Alerta",
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email }).select("+senha");
    if (!user) {
      return res.status(400).json({ message: "Credenciais inválidas." });
    }

    const isMatch = await user.comparePassword(senha);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciais inválidas." });
    }

    const userWithoutPassword = await User.findById(user._id).populate({
      path: "cidades",
      populate: {
        path: "alertas",
        model: "Alerta",
      },
    });

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  const { id } = req.params;

  try {
    var updatedUser = {};
    if (!senha) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { nome, email },
        { new: true, runValidators: true }
      );
    } else {
      const hashedPassword = await bcrypt.hash(senha, 10);
      updatedUser = await User.findByIdAndUpdate(
        id,
        { nome, email, senha: hashedPassword },
        { new: true, runValidators: true }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
