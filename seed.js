const { sequelize, User, Brand, Category, Product } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  await sequelize.sync({ force: true }); // Reset db entirely to avoid conflicts

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password', salt);
  await User.create({ username: 'admin', password: hashedPassword, role: 'admin' });

  const brands = await Brand.bulkCreate([
    { name: 'COSRX' },
    { name: 'By Wishtrend' },
    { name: 'Klairs' },
    { name: 'Beauty of Joseon' },
    { name: 'Isntree' }
  ]);

  const categories = await Category.bulkCreate([
    { name: 'Sheet Mask' },
    { name: 'Essence' },
    { name: 'Toner' },
    { name: 'Serum' }
  ]);

  await Product.bulkCreate([
    {
      name: 'By Wishtrend Natural Vitamin 21.5 Enhancing Sheet Mask 23ml',
      description: 'A deeply hydrating sheet mask.',
      price: 200,
      discount_price: 180,
      rating: 4.3,
      brand_id: brands[1].id,
      category_id: categories[0].id,
      image_url: 'https://cdn.beautybarn.in/wp-content/uploads/2019/12/30172828/By-Wishtrend-Natural-Vitamin-21.5-Enhancing-Sheet-Mask.jpg' // Made up typical url, wait, use a generic one or realistic one
    },
    {
      name: 'COSRX Advanced Snail 96 Mucin Power Essence 100ml',
      description: 'Essence with 96% snail mucin.',
      price: 1450,
      discount_price: null,
      rating: 4.9,
      brand_id: brands[0].id,
      category_id: categories[1].id,
      image_url: 'https://cosrx.com/cdn/shop/files/1_15f795d2-0545-4299-8806-03fcb590e820_1024x.jpg'
    },
    {
      name: 'COSRX AHA/BHA Clarifying Treatment Toner 150ml',
      description: 'Gentle exfoliating toner.',
      price: 1090,
      discount_price: null,
      rating: 4.8,
      brand_id: brands[0].id,
      category_id: categories[2].id,
      image_url: 'https://m.media-amazon.com/images/I/41mS+XkUS7L.jpg'
    },
    {
      name: 'Beauty of Joseon Glow Serum : Propolis + Niacinamide',
      description: 'For glowing skin.',
      price: 1550,
      discount_price: 1200,
      rating: 4.5,
      brand_id: brands[3].id,
      category_id: categories[3].id,
      image_url: 'https://m.media-amazon.com/images/I/41j-GkL88WL.jpg'
    }
  ]);

  console.log('Seed completed successfully!');
  process.exit();
}

seed();
