const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SuperLabs ECommerce Product API',
      version: '1.0.0',
      description: 'API Documentation for the Product Listing Service',
      contact: {
        name: 'Antigravity Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            images: { type: 'array', items: { type: 'string' } },
            sku: { type: 'string' },
            availability: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: { type: 'string', example: 'Gaming Laptop' },
            description: { type: 'string', example: 'High performance gaming laptop' },
            price: { type: 'number', example: 1299.99 },
            images: { type: 'array', items: { type: 'string' }, example: ['https://example.com/image1.jpg'] },
            sku: { type: 'string', example: 'LAP-1234' },
            availability: { type: 'boolean', example: true },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
