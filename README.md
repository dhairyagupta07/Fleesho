# Fleesho

Fleesho is a full-stack e-commerce web application that lets users browse products, create accounts, add items to a wishlist and cart, place orders, and complete payment using Razorpay. The project is split into a Node.js/Express backend and a React + Vite frontend.

## Project overview

This repository contains a complete frontend + backend shopping experience for a small online store. The app focuses on:

- Customer registration and login
- JWT-based authentication with HTTP-only cookies
- Product listing and single product detail views
- Wishlist and cart management
- Secure checkout flow with shipping details
- Razorpay payment integration
- Order history and success flow
- MongoDB persistence for users, products, and orders

## Tech stack

Frontend
- React 19
- Vite
- React Router DOM
- Axios
- CSS for styling

Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT
- bcrypt
- Razorpay SDK
- cookie-parser
- dotenv
- CORS

## Repository structure

```text
Fleesho/
├── Backend/
│   ├── .env
│   ├── config/
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── cart.controller.js
│   │   ├── customer.controller.js
│   │   ├── order.controller.js
│   │   ├── product.controller.js
│   │   └── wishlist.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── customer.model.js
│   │   ├── order.model.js
│   │   └── product.model.js
│   ├── routes/
│   │   ├── cart.routes.js
│   │   ├── customer.routes.js
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   └── wishlist.routes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── Frontend/
│   ├── package.json
│   └── shopkart/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── App.css
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       ├── package.json
│       └── vite.config.*
├── README.md
└── .gitignore
```

## Architecture

The application follows a simple client-server architecture:

1. Frontend (React app)
   - Routes handle the user experience: login, register, home, products, cart, checkout, orders, wishlist, settings
   - Context providers manage shared cart and wishlist state
   - Axios client calls the backend API

2. Backend (Express server)
   - Runs on port 8000 by default
   - Exposes REST APIs for customers, products, wishlist, cart, and orders
   - Validates requests and protects authenticated routes using JWT cookies
   - Interacts with MongoDB through Mongoose models

3. Database (MongoDB)
   - Stores customers, product inventory, cart data, and order records
   - The customer schema includes wishlist and cart arrays, while products and orders are separate collections

4. Payment flow
   - Checkout creates an order and Razorpay payment intent/order
   - Frontend completes payment in the browser using Razorpay checkout
   - Payment verification happens on the backend
   - Successful verification clears the cart and marks the order as placed

## Core features

### Customer authentication
- Register with full name, email, phone, and password
- Login with email and password
- JWT token stored in an HTTP-only cookie
- Session validation through middleware
- Logout and change-password support

### Product catalog
- Product listing with search and category filters
- Product detail page with pricing and stock information
- Product data stored in MongoDB

### Wishlist
- Add/remove products from a user wishlist
- Wishlist state is managed in frontend context and persisted through the backend user document

### Cart
- Add products to cart
- Update quantities
- Remove items
- Cart totals and stock validation on the server

### Checkout and payments
- Validate shipping address inputs
- Create a Razorpay order
- Verify Razorpay signature on the server
- Save order and empty the user's cart after successful payment

### Orders
- Fetch all user orders
- View order details and success confirmation page

## Authentication flow

The backend uses JWTs generated with a secret stored in `Backend/.env`.

- On registration, the user password is hashed using `bcrypt`
- On login, the server compares the submitted password with the stored hash
- If valid, a token is created and set in a cookie named `token`
- Protected routes read the token and attach the authenticated user to `req.user`

## Environment setup

Before running the app, make sure you have:

- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas connection string
- A Razorpay account with test keys

Create a `.env` file inside `Backend/` using the following structure:

```env
PORT=8000
dbURL=your_mongodb_connection_string
jwt_secret=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Do not commit real secrets to the repository. Keep them local and secure.

## Running the project

### 1) Install backend dependencies

```bash
cd Backend
npm install
```

### 2) Start the backend server

```bash
cd Backend
node index.js
```

Or, for development with auto-reload:

```bash
cd Backend
npx nodemon index.js
```

The backend default URL is:

```text
http://localhost:8000
```

The API is served under `/api` (for example, `http://localhost:8000/api/products`).
The Vite development server proxies `/api` requests to the local backend.

### 3) Install frontend dependencies

```bash
cd Frontend/shopkart
npm install
```

### 4) Start the frontend dev server

```bash
cd Frontend/shopkart
npm run dev
```

The frontend app is typically available at:

```text
http://localhost:5173
```

## API structure

The backend exposes REST endpoints under the following base paths:

### Customer routes
- `POST /api/customers/register`
- `POST /api/customers/login`
- `GET /api/customers/me`
- `POST /api/customers/logout`
- `PATCH /api/customers/change-password`

### Product routes
- `POST /api/products` (create product)
- `GET /api/products`
- `GET /api/products/:id`

### Wishlist routes
- `GET /api/wishlist`
- `POST /api/wishlist/:productId`
- `DELETE /api/wishlist/:productId`

### Cart routes
- `GET /api/cart`
- `POST /api/cart/:productId`
- `PATCH /api/cart/:productId`
- `DELETE /api/cart/:productId`

### Order routes
- `POST /api/orders/create-order`
- `POST /api/orders/verify-payment`
- `GET /api/orders`
- `GET /api/orders/:id`

## Important implementation notes

- The frontend uses Axios with `baseURL: '/api'` and sends cookies with requests
- Vite proxies `/api` to the local backend; Vercel routes `/api` to the backend service
- The frontend and backend share an origin in production, so API requests do not require CORS
- Product and customer validation happen on the server before writing to MongoDB
- Payment verification is done using a SHA256 HMAC calculated from the Razorpay order ID and payment ID

## Frontend app flow

Typical user journey:

1. User visits `/login` or `/register`
2. User logs in and receives a JWT cookie
3. Frontend redirects to `/home`
4. User browses `/products`, views `/products/:id`
5. User adds items to wishlist or cart
6. User proceeds to `/checkout`
7. Server creates a Razorpay order
8. User completes payment and lands on `/order-success/:id`
9. Order details become visible in `/orders`

## Database models

### Customer model
Stores:
- `fullName`
- `email`
- `password` (hashed)
- `phone`
- `wishlist`
- `cart` with product references and quantity

### Product model
Stores:
- `name`
- `description`
- `price`
- `category`
- `image`
- `stock`

### Order model
Stores:
- `user`
- `items`
- `shippingAddress`
- `totalAmount`
- `paymentStatus`
- `status`
- `razorpayOrderId`
- `razorpayPaymentId`

## Security considerations

This project demonstrates a practical e-commerce workflow, but production hardening would typically include:

- stronger input validation and sanitization across all endpoints
- rate limiting and abuse protection
- stricter role-based access control
- secure secret management using environment variables or a secret manager
- HTTPS in production
- production-grade logging and monitoring

## Deploying to Vercel

The root `vercel.json` configures a Vercel Services project with the Express
backend and the Vite app. Requests under `/api` go to the backend; all other
requests go to the frontend. The frontend and API therefore share one origin,
including for authentication cookies.

1. Import this repository into Vercel and deploy it from the repository root.
   Keep the project root as `.` so Vercel can read the root `vercel.json`.
2. Add these environment variables to the Vercel project for the backend:
   - `dbURL`: your MongoDB connection string (allow Vercel deployments in the
     MongoDB network access settings).
   - `jwt_secret`: a long, random JWT signing secret.
   - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: your Razorpay credentials.
3. Deploy. The frontend calls `/api` on the same deployment; no frontend API
   URL setting is needed.

For local development, run the backend on port 8000 and the Vite app on port
5173 as described above. Vite proxies API requests to the backend.

## Development status

This repository is structured as a full-stack ecommerce prototype with working frontend and API flows for product browsing, account management, cart, wishlist, checkout, and Razorpay payments. The project is designed for local development and demonstration purposes.

## Contribution / future improvements

Possible future enhancements include:

- admin dashboard for managing products and orders
- product image upload via cloud storage
- order cancellation and refund workflows
- email notifications and OTP verification
- pagination and filtering for large catalogs
- Redux or Zustand for state management
- automated testing and CI pipeline

## Summary

Fleesho is a complete learning-focused e-commerce platform that combines a modern React frontend with a robust Express + MongoDB backend. It covers the main flow of a real online store: authentication, catalog browsing, cart management, checkout, payment verification, and order tracking.

For local use, simply install dependencies in both the backend and frontend directories, configure the backend environment variables, and start both services. The app is ready to run as a full-stack project in a standard Node.js development environment.
