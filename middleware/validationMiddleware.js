// Basic validation middleware for product creation/update
exports.validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Product name is required');
  }

  if (price === undefined || price === null) {
    errors.push('Price is required');
  } else if (isNaN(price) || parseFloat(price) < 0) {
    errors.push('Price must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
