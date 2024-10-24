const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
  },
  categoria: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const productModel = mongoose.model("Producto", productSchema);

module.exports = productModel;
