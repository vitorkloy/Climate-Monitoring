import mongoose from "mongoose";

const AlertaSchema = new mongoose.Schema(
  {
    temperatura: Number,
    umidade: Number,
    pressao: Number,
    descricao: String,
    horario: { type: Date, default: Date.now },
    localidade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Localidade",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alerta", AlertaSchema);
