# 📚 BookBazaar - Online Bookstore

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) e-commerce application for buying and selling books online. Features include user authentication, shopping cart, order management, payment gateway integration, admin panel, and more.

![BookBazaar](https://img.shields.io/badge/MERN-Stack-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.3.1-blue)

## 🌟 Features 

### User Features
- 🔐 **User Authentication** - Register, login, and secure JWT-based authentication
- 📖 **Browse Books** - Search, filter by category, and paginate through extensive book collection
- 🛒 **Shopping Cart** - Add/remove books, update quantities with persistent cart storage
- 💳 **Multiple Payment Options** - COD, Card, UPI, and NetBanking support
- 📦 **Order Management** - View order history, track orders, and download receipts
- 💰 **Pay Later** - Option to pay for pending orders anytime
- ❌ **Cancel Orders** - Request order cancellation before delivery
- 🧾 **Digital Receipts** - Generate and print/download order receipts
- 📍 **Order Tracking** - Real-time updates on order status and location

### Admin Features
- 📚 **Book Management** - Full CRUD operations for book inventory
- 📊 **Order Management** - View all orders, update status, and manage deliveries
- 🚚 **Tracking Updates** - Add custom tracking information and delivery notes
- 👥 **User Management** - Monitor customer orders and activity
- 📈 **Dashboard** - Comprehensive overview of bookstore operations

### Additional Features
- 📱 **Responsive Design** - Mobile-friendly interface with Bootstrap
- 🔒 **Secure Checkout** - Protected routes and secure payment processing
- 🎨 **Modern UI/UX** - Clean and intuitive user interface
- 📧 **Contact & About Pages** - Customer support and company information
- ⚡ **Fast Performance** - Optimized loading and smooth navigation

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **React Router 6** - Client-side routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.0.0** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/bookbazaar.git
cd bookbazaar
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookbazaar
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

```bash
# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:3001`

## 📁 Project Structure

```
BookBazaar/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── admin.js              # Admin authorization middleware
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Book.js               # Book model
│   │   └── Order.js              # Order model
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── books.js              # Book CRUD routes
│   │   ├── orders.js             # Order management routes
│   │   └── payment.js            # Payment processing routes
│   ├── server.js                 # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── BookCard.jsx      # Book display card
│   │   │   ├── PaymentModal.jsx  # Payment gateway modal
│   │   │   ├── PrivateRoute.jsx  # Protected route wrapper
│   │   │   └── AdminRoute.jsx    # Admin-only route wrapper
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state
│   │   │   └── CartContext.jsx   # Shopping cart state
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Book listing page
│   │   │   ├── Login.jsx         # User login
│   │   │   ├── Register.jsx      # User registration
│   │   │   ├── BookDetails.jsx   # Single book view
│   │   │   ├── CartPage.jsx      # Shopping cart
│   │   │   ├── Orders.jsx        # Order history
│   │   │   ├── OrderDetails.jsx  # Single order view
│   │   │   ├── Receipt.jsx       # Order receipt
│   │   │   ├── About.jsx         # About page
│   │   │   ├── Contact.jsx       # Contact page
│   │   │   ├── AdminBooks.jsx    # Admin book management
│   │   │   └── AdminOrders.jsx   # Admin order management
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   └── main.jsx              # React entry point
│   └── package.json
│
└── README.md
```

## 👤 User Roles

### Regular User
- Browse and search books
- Add items to cart
- Place orders with multiple payment methods
- View and track orders
- Cancel pending orders
- Download receipts
- Manage profile

### Admin User
- All user permissions
- Add, edit, and delete books
- View all orders
- Update order status
- Add tracking information
- Manage inventory

## 🔑 Default Admin Account

To test admin features, you can create an admin user manually in MongoDB or register a user and update the role field to "admin":

```javascript
// In MongoDB
db.users.updateOne(
  { email: "admin@bookbazaar.com" },
  { $set: { role: "admin" } }
)
```

Or register normally and use:
- **Email:** your_email@example.com
- **Password:** your_password

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books (with pagination & filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin)
- `PUT /api/books/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/all/admin` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order (User)

### Payment
- `POST /api/payment/process` - Process payment
- `POST /api/payment/validate-card` - Validate card details

## 🎨 Screenshots

### Home Page
Browse through extensive collection of books with search and filter options.

### Shopping Cart
Review items, update quantities, and proceed to checkout.

### Order Management
Track orders, view receipts, and manage deliveries.

### Admin Dashboard
Comprehensive tools for managing books and orders.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Role-based access control
- Input validation
- CORS configuration
- Secure payment processing

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Deployment

### Backend (Render/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up custom domain (optional)

### Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGO_URI` in backend .env

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Book cover images from Open Library API
- Icons from Bootstrap Icons
- UI inspiration from modern e-commerce platforms
- Community support and feedback

## 📞 Support

For support, email support@bookbazaar.com or create an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Real payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications for orders
- [ ] Book recommendations based on browsing history
- [ ] Wishlist feature
- [ ] Book reviews and ratings
- [ ] Coupon and discount system
- [ ] Advanced analytics dashboard
- [ ] Social media sharing
- [ ] Multiple language support
- [ ] PWA support for mobile

---

Made with ❤️ by BookBazaar Team
