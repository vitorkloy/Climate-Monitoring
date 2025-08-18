import Alerta from "../models/Alerta.js";
import Localidade from "../models/Localidade.js";

export const createAlerta = async (req, res) => {
  const { temperatura, umidade, pressao, descricao, localidade } = req.body;
  try {
    const alerta = await Alerta.create({
      temperatura,
      umidade,
      pressao,
      descricao,
      localidade,
    });
    await Localidade.findByIdAndUpdate(localidade, {
      $push: { alertas: alerta._id },
    });
    res.status(201).json(alerta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAlertas = async (req, res) => {
  const { localidadeId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const alertas = await Alerta.find({ localidade: localidadeId })
      .sort({ horario: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Alerta.countDocuments({ localidade: localidadeId });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      totalPages,
      currentPage: Number(page),
      alertas,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
