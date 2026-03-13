const Product = require('../models/product');
const { Op } = require('sequelize');

// Helper: SKU Generator
const generateSKU = (name) => {
  const prefix = name.substring(0, 3).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
};

// @desc    Get all products (Admin List)
// @route   GET /api/products
exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Search products with pagination
// @route   GET /api/products/search (or GET /api/products with query)
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (q) {
      where.name = { [Op.iLike]: `%${q}%` }; // PostgreSQL case-insensitive search
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      products: rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, images, sku, availability } = req.body;

    const finalSku = sku || generateSKU(name);

    const product = await Product.create({
      name,
      description,
      price,
      images: images || [],
      sku: finalSku,
      availability: availability !== undefined ? availability : true
    });

    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'SKU must be unique' });
    }
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, images, sku, availability } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      images: images || product.images,
      sku: sku || product.sku,
      availability: availability !== undefined ? availability : product.availability
    });

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
