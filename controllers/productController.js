const { Product, Brand, Category } = require('../models');
const { Op } = require('sequelize');

exports.getProducts = async (req, res, next) => {
  try {
    const { 
      q, 
      page = 1, 
      limit = 10,
      rating,
      brand,
      category,
      sort
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (q) {
      where.name = { [Op.iLike]: `%${q}%` };
    }
    if (rating) {
      where.rating = { [Op.gte]: parseFloat(rating) };
    }
    if (brand) {
      where.brand_id = brand;
    }
    if (category) {
      where.category_id = category;
    }

    let order = [['created_at', 'DESC']];
    if (sort === 'price_low_high') {
      order = [['price', 'ASC']];
    } else if (sort === 'price_high_low') {
      order = [['price', 'DESC']];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      include: [
        { model: Brand, attributes: ['id', 'name'] },
        { model: Category, attributes: ['id', 'name'] }
      ]
    });

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit),
      products: rows
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Brand, attributes: ['id', 'name'] },
        { model: Category, attributes: ['id', 'name'] }
      ]
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discount_price, rating, brand_id, category_id, image_url } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      discount_price,
      rating,
      brand_id,
      category_id,
      image_url
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update(req.body); // Update with provided fields

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

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
