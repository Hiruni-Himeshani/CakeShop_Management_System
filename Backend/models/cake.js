// models/Cake.js
const mongoose = require("mongoose");

const cakeSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  qty: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String }, // will store image file path
}, { timestamps: true });

module.exports = mongoose.model("Cake", cakeSchema);
