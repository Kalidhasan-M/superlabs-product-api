const { Brand } = require('../models');

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create({ name: req.body.name });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    brand.name = req.body.name || brand.name;
    await brand.save();
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    await brand.destroy();
    res.json({ message: 'Brand removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };
