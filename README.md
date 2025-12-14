# 🛍️ Lookups

<div align="center">

![Lookups Logo](client/public/logo.png)

**A modern full-stack marketplace and business management platform**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://lookupss.vercel.app) • [Report Bug](https://github.com/varletint/auth/issues) • [Request Feature](https://github.com/varletint/auth/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**Lookups** is a comprehensive full-stack web application that combines a **marketplace platform** with **business management tools**. Users can browse and purchase products from various sellers, while merchants can manage their inventory, track sales, handle expenses, and manage customer relationships—all in one place.

### Two App Types:
- **🛒 Marketplace** - Browse products, add to cart, wishlist, checkout, and track orders
- **💼 Business Management** - Full suite of tools for managing inventory, sales, customers, and expenses

---

## ✨ Features

### 🛒 Marketplace Features
- **Product Browsing** - Search, filter by categories, view detailed product pages
- **Shopping Cart** - Add/remove items, update quantities with stock validation
- **Wishlist** - Save favorite products for later
- **User Profiles** - View seller profiles and their products
- **Order Management** - Track order status and purchase history
- **Checkout System** - Complete purchase flow

### 💼 Business Management Features
- **📦 Inventory Management** - Track stock levels, low stock alerts, restock functionality
- **💰 Sales Tracking** - Record sales, multiple payment methods, sales history with Excel export
- **👥 Customer Management** - Customer database with purchase history
- **📊 Expense Tracking** - Categorize and monitor business expenses
- **📈 Dashboard Analytics** - Visual insights into business performance
- **🧾 Order Management** - Process and fulfill customer orders

### 👤 User Features
- **Authentication** - Secure JWT-based auth with email verification
- **Role-Based Access** - User, Seller, Admin roles
- **Profile Management** - Edit profile, upload avatar via Firebase Storage
- **Become a Seller** - Application process to start selling
- **Password Recovery** - Forgot password with email verification

### 🔧 Admin Features
- **User Management** - View all users, manage roles
- **Platform Statistics** - User counts by app type
- **Dashboard Overview** - Platform-wide analytics

### 📱 PWA Support
- **Installable** - Add to home screen on mobile/desktop
- **Offline Ready** - Service worker with caching strategies
- **Push Notifications** - Ready for future implementation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| React Router 7 | Client-side routing |
| Tailwind CSS 4 | Styling |
| Zustand | State management |
| React Hook Form + Yup | Form handling & validation |
| Hugeicons | Icon library |
| Firebase | Image storage |
| Vite + PWA Plugin | Build tool & PWA support |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | Server framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Argon2 | Password hashing |
| Nodemailer | Email services |
| 
| Redis/IORedis | Caching (optional) |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend & Backend hosting |
| MongoDB Atlas | Database hosting |
| Firebase | Image storage |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Firebase project (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/varletint/auth.git
   cd auth
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables** (see [Environment Variables](#-environment-variables))

5. **Run the development servers**

   Backend (from root directory):
   ```bash
   npm run dev
   ```

   Frontend (from client directory):
   ```bash
   cd client
   npm run dev
   ```

6. **Open in browser**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

---

## 📁 Project Structure

```
lookups/
├── client/                    # Frontend React application
│   ├── public/               # Static assets & PWA manifest
│   ├── src/
│   │   ├── Components/       # Reusable UI components
│   │   ├── Pages/           # Page components
│   │   ├── store/           # Zustand state stores
│   │   ├── App.jsx          # Main app with routing
│   │   └── main.jsx         # Entry point with PWA setup
│   └── vite.config.js       # Vite & PWA configuration
│
├── Models/                   # Mongoose schemas
│   ├── user.js              # User model
│   ├── product.js           # Product model
│   ├── order.js             # Order model
│   ├── sale.js              # Sales model
│   ├── customer.js          # Customer model
│   ├── expense.js           # Expense model
│   ├── inventoryItem.js     # Inventory model
│   └── ...
│
├── Routes/                   # Express route handlers
├── controller/              # Business logic controllers
├── middleware/              # Auth & validation middleware
├── services/                # External service integrations
├── config/                  # Database & app configuration
├── Utilis/                  # Utility functions
└── index.js                 # Server entry point
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your_jwt_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password



# Optional
REDIS_URL=redis://...
```

### Frontend (client/.env)

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/verify-email/:token` | Verify email |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Seller) |
| PUT | `/api/products/:id` | Update product (Seller) |
| DELETE | `/api/products/:id` | Delete product (Seller) |

### Cart & Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:itemId` | Update cart item |
| DELETE | `/api/cart/:itemId` | Remove from cart |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user orders |

### Business Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get sales |
| POST | `/api/sales` | Record sale |
| GET | `/api/customers` | Get customers |
| GET | `/api/expenses` | Get expenses |
| POST | `/api/expenses` | Add expense |
| GET | `/api/inventory` | Get inventory |

---

## 📸 Screenshots



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository** - Click the "Fork" button at the top right of this page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/auth.git
   cd auth
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "Add: Brief description of your feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Open a Pull Request** - Go to the original repo and click "New Pull Request"

> **Tip:** Keep your fork updated by adding the original repo as upstream:
> ```bash
> git remote add upstream https://github.com/varletint/auth.git
> git fetch upstream
> git merge upstream/main
> ```

---

## 📄 License

Nope.

---

## 👨‍💻 Author

**Varletint**

- GitHub: [@varletint](https://github.com/varletint)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

</div>
