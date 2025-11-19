# Hospital Management System

A modern MERN stack application for managing hospital appointments and patient records.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**

   Backend (`.env` in `/backend`):
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_management
   JWT_SECRET=your_jwt_secret
   ```

   Frontend (`.env` in `/frontend`):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Seed database with sample doctors**
   ```bash
   cd backend
   node seed.js
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3001

## 📋 Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Database seeding
│   └── server.js        # Express app
│
└── frontend/
    └── src/
        ├── components/   # Reusable components (Navbar, Sidebar, ProtectedRoute)
        ├── pages/        # Page components (Auth, Patient, Doctor, Admin)
        ├── utils/        # API utilities
        ├── App.jsx       # Main app
        └── main.jsx      # Entry point
```

## 🔐 Test Credentials

- **Patient**: patient@hospital.com / patient123
- **Doctor**: dr.sharma@hospital.com / doctor123
- **Admin**: admin@hospital.com / admin123

## ✨ Features

- ✅ Patient appointment booking
- ✅ Doctor dashboard & appointment management
- ✅ Admin user management
- ✅ JWT authentication with bcrypt
- ✅ Role-based access control
- ✅ Professional UI with Tailwind CSS
- ✅ Auto-reload with Nodemon (backend) & Vite (frontend)

## 🛠️ Available Scripts

```bash
npm run dev      # Start both servers with hot reload
npm start        # Start production servers
npm run build    # Build frontend for production
```

## 📚 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Tools**: Nodemon, ESLint, Concurrently

## 🔧 Development

Both servers run with auto-reload:
- Backend uses **Nodemon** - restarts on file changes
- Frontend uses **Vite** - instant HMR

## 📖 API Base URL
```
http://localhost:5000/api
```

Key endpoints:
- `POST /auth/register` - Register
- `POST /auth/login` - Login
- `GET /patient/doctors` - Get doctors
- `POST /patient/book` - Book appointment
- `GET /patient/bookings` - View bookings
- `GET /doctor/bookings` - Doctor appointments
- `PATCH /doctor/appointment/:id` - Update appointment
