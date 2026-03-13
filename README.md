# SuperLabs eCommerce Product Listing Service

A complete Node.js backend with Express, PostgreSQL, and Sequelize ORM, featuring a clean MVC architecture, Swagger documentation, and a minimal frontend for search and admin management.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Documentation:** Swagger / OpenAPI
- **Frontend:** Vanilla HTML, CSS, and JavaScript (Fetch API)

## Project Structure
- `config/`: Database connection settings
- `controllers/`: Business logic for product operations
- `models/`: Sequelize data models (Products)
- `routes/`: API endpoint definitions with Swagger annotations
- `middleware/`: Validation and centralized error handling
- `docs/`: Swagger configuration
- `admin/`: Admin dashboard frontend
- `public/`: User-facing search and product detail pages

## Features
- **Product Model:** UUID keys, name, description, price, SKU (unique), availability, and JSON logic for images.
- **Search API:** Supports keyword search and pagination (`/api/products?q=keyword&page=1&limit=10`).
- **Admin APIs:** Full CRUD operations for products.
- **SKU Auto-generator:** Automatically creates SKUs if not provided during creation.
- **Validation:** Middleware to ensure data integrity.
- **Logging:** Request logging with Morgan.
- **CORS:** Enabled for cross-origin requests.

## How to Run Locally

### 1. Prerequisites
- Node.js installed
- PostgreSQL installed and running

### 2. Setup Database
Create a database named `superlabs_ecommerce` in your PostgreSQL instance.

### 3. Installation
```bash
npm install
```

### 4. Configuration
Create a `.env` file from `.env.example` and update your database credentials:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=superlabs_ecommerce
DB_PORT=5432
```

### 5. Start the Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## Accessing the Application

- **API Documentation (Swagger):** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Admin Panel:** [http://localhost:5000/admin](http://localhost:5000/admin)
- **Product Search:** [http://localhost:5000/search.html](http://localhost:5000/search.html)
- **Product Details:** [http://localhost:5000/product.html?id=UUID](http://localhost:5000/product.html)

## APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Admin: List all products / User: Search (`?q=`) |
| GET | `/api/products/:id` | Get single product details |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update an existing product |
| DELETE | `/api/products/:id` | Delete a product |
# superlabs-product-api
