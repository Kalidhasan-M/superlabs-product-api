const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const swaggerSpecs = require('./docs/swagger');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/products', productRoutes);

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Home Route (Redirect to search or docs)
app.get('/', (req, res) => {
  res.redirect('/search.html');
});

// Error Handling Middleware
app.use(errorHandler);

// Database Sync & Server Start
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('PostgreSQL Database connected...');

    // Sync Models
    await sequelize.sync(); // Use { force: true } only in dev to reset db
    console.log('Database synced...');

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/api/docs`);
      console.log(`Admin Panel available at http://localhost:${PORT}/admin`);
      console.log(`Search Page available at http://localhost:${PORT}/search.html`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
