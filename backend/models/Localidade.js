import mongoose from "mongoose";

const LocalidadeSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    estado: { type: String },
    pais: { type: String },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User ",
      required: true,
    },
    alertas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alerta" }],
  },
  { timestamps: true }
);

export default mongoose.model("Localidade", LocalidadeSchema);
