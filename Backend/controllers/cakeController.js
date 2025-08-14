const Cake = require("../models/cake");

// Add new cake
const addCake = async (req, res) => {
  try {
    const { productName, description, qty, category, price } = req.body;

    if (!productName || !description || !qty || !category || !price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newCake = new Cake({
      productName,
      description,
      qty,
      category,
      price,
      image: req.file ? req.file.filename : null
    });

    await newCake.save();
    res.status(201).json({ success: true, data: newCake });
  } catch (error) {
    console.error("Error adding cake:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all cakes
const getAllCakes = async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json({ success: true, data: cakes });
  } catch (error) {
    console.error("Error fetching cakes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get cake by ID
const getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) {
      return res.status(404).json({ success: false, message: "Cake not found" });
    }
    res.json({ success: true, data: cake });
  } catch (error) {
    console.error("Error fetching cake:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update cake
const updateCake = async (req, res) => {
  try {
    const { productName, description, qty, category, price } = req.body;
    const updatedData = { productName, description, qty, category, price };

    if (req.file) updatedData.image = req.file.filename;

    const cake = await Cake.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!cake) {
      return res.status(404).json({ success: false, message: "Cake not found" });
    }

    res.json({ success: true, data: cake });
  } catch (error) {
    console.error("Error updating cake:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete cake
const deleteCake = async (req, res) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.id);
    if (!cake) {
      return res.status(404).json({ success: false, message: "Cake not found" });
    }
    res.json({ success: true, message: "Cake deleted successfully" });
  } catch (error) {
    console.error("Error deleting cake:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addCake,
  getAllCakes,
  getCakeById,
  updateCake,
  deleteCake
};
