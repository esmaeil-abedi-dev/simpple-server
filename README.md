# E-Commerce API Server

A RESTful API server built with Node.js, Express, TypeScript, and Prisma ORM for an e-commerce application. This server provides endpoints for managing users, products, categories, orders, and file uploads.

## Features

- User authentication (register, login, logout)
- User profile management
- Admin user management
- Product management with categories and reviews
- Order processing
- Image upload
- Persian language support for products

## Technologies Used

- Node.js (recommended version: 23.11.0)
- Express.js
- TypeScript
- Prisma ORM
- MongoDB Atlas
- JSON Web Tokens (JWT)
- Multer for file uploads
- Vercel for deployment

## Getting Started

### Prerequisites

- Node.js (recommended version: 23.11.0)
- MongoDB (local or Atlas)
- Vercel account (for deployment)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

   - Create a `.env` file based on the example provided
   - Configure your MongoDB connection string

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Seed the database with sample Persian products:

```bash
npm run seed
```

6. Start the development server:

```bash
npm run dev
```

## API Endpoints

## Deployment to Vercel

### Setup Vercel Environment Variables

Before deploying to Vercel, make sure to add the following environment variables to your Vercel project:

- `DATABASE_URL`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time
- `COOKIE_EXPIRES_IN`: Cookie expiration time in days
- `NODE_ENV`: Set to "production"

### Deploy Using Script

Run the deployment script:

```bash
./deploy.sh
```

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy to Vercel:

```bash
npx vercel --prod
```

## API Endpoints

### Authentication

- `POST /api/users` - Register user
- `POST /api/users/auth` - Login user
- `POST /api/users/logout` - Logout user
- `POST /api/users/auth` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PATCH /api/users/role/:id` - Change user role (admin only)

### Categories

- `GET /api/category/categories` - Get all categories
- `GET /api/category/:id` - Get category by ID
- `POST /api/category` - Create a new category (admin only)
- `PUT /api/category/:categoryId` - Update category (admin only)
- `DELETE /api/category/:categoryId` - Delete category (admin only)

### Products

- `GET /api/products` - Get products with pagination
- `GET /api/products/allproducts` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/products/:id/reviews` - Create product review
- `GET /api/products/top` - Get top rated products
- `GET /api/products/sort/new` - Get new products
- `POST /api/products/filtered` - Get filtered products

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders/mine` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/pay` - Update order to paid (admin only)
- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)
- `GET /api/orders/total-sales` - Get total sales (admin only)
- `GET /api/orders/total-sales-by-date` - Get total sales by date (admin only)

### Upload

- `POST /api/upload` - Upload image

## Getting Started

### Prerequisites

- Node.js (v18.18 or higher)
- MongoDB

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd e-commerce-api-server
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory and add the following:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
UPLOAD_PATH=uploads/
```

4. Generate Prisma client

```bash
npx prisma generate
```

5. Run the development server

```bash
npm run dev
```

## Deployment to Vercel

1. Create a Vercel account and install Vercel CLI

```bash
npm i -g vercel
```

2. Login to Vercel

```bash
vercel login
```

3. Deploy to Vercel

```bash
vercel
```

## License

This project is licensed under the MIT License.
