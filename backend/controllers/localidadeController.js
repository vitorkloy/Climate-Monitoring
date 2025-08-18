import Localidade from "../models/Localidade.js";
import User from "../models/User.js";

export const createLocalidade = async (req, res) => {
  const { nome, estado, pais, usuario } = req.body;
  try {
    const existingLocalidade = await Localidade.findOne({
      nome: new RegExp(`^${nome}$`, "i"),
      usuario,
    });
    if (existingLocalidade) {
      return res
        .status(409)
        .json({
          message: "Localidade já adicionada por este usuário.",
          localidade: existingLocalidade,
        });
    }

    const localidade = await Localidade.create({ nome, estado, pais, usuario });
    await User.findByIdAndUpdate(usuario, {
      $push: { cidades: localidade._id },
    });

    res.status(201).json(localidade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLocalidades = async (req, res) => {
  const { userId } = req.params;
  try {
    const localidades = await Localidade.find({ usuario: userId }).populate(
      "alertas"
    );
    res.status(200).json(localidades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
