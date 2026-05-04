# HomeStay Dorm System - Setup & Running Guide

## Project Overview

This is a full-stack web application for managing HomeStay dormitory operations with role-based access (Sales, Accountant, Manager).

### Roles:
- **Sales (Kinh doanh)**: Manage customers, search rooms, handle bookings
- **Accountant (Kế toán)**: Manage deposits, stays, payments, and debts
- **Manager (Quản lý)**: Dashboard, reports, and system overview

---

## Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **git** (optional)

---

## Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` if needed:
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### 4. Start the backend server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

**Expected output:**
```
Server running on port 5000
```

The backend API will be available at `http://localhost:5000/api`

---

## Frontend Setup

### 1. Navigate to frontend folder (in a new terminal)
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## Demo Credentials

Login with any of these demo accounts:

| Role | Username | Password |
|------|----------|----------|
| Sales (Kinh doanh) | `sale01` | `123456` |
| Accountant (Kế toán) | `accountant01` | `123456` |
| Manager (Quản lý) | `manager01` | `123456` |

Or click on the demo buttons on the login page to auto-fill credentials.

---

## Quick Start

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173/login`

4. **Login:**
   Use any demo credentials from the table above

---

## Project Structure

### Backend (`backend/src/`)
```
├── server.js                 # Express server entry point
├── config/
│   └── database.js          # Database configuration
├── controllers/             # Business logic
│   ├── auth.controller.js
│   ├── customer.controller.js
│   ├── room.controller.js
│   ├── booking.controller.js
│   └── payment.controller.js
├── middlewares/             # Express middlewares
│   ├── auth.middleware.js   # JWT verification & authorization
│   └── error.middleware.js
├── models/                  # Data models (currently mock)
└── routes/                  # API routes
    ├── auth.routes.js
    ├── customer.routes.js
    ├── room.routes.js
    └── booking.routes.js
```

### Frontend (`frontend/src/`)
```
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
├── pages/
│   ├── Login.jsx           # Login page
│   ├── sales/              # Sales role pages
│   │   ├── Booking.jsx
│   │   ├── RoomSearch.jsx
│   │   └── CustomerManagement.jsx
│   ├── accountant/         # Accountant role pages
│   │   ├── DepositManagement.jsx
│   │   └── StayManagement.jsx
│   └── manager/            # Manager role pages
│       ├── Dashboard.jsx
│       └── Reports.jsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── Navbar.jsx
│   └── ProtectedRoute.jsx  # Route protection
├── services/               # API integration
│   ├── api.js             # Axios instance
│   ├── auth.service.js
│   ├── customer.service.js
│   ├── room.service.js
│   └── booking.service.js
├── context/
│   └── AuthContext.jsx    # Authentication state
└── routes/
    └── AppRouter.jsx      # React Router setup
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer (Sales only)
- `PUT /api/customers/:id` - Update customer (Sales only)
- `DELETE /api/customers/:id` - Delete customer (Sales only)

### Rooms
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/available` - List available rooms
- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/:id/beds` - Get beds in room
- `POST /api/rooms` - Create room (Manager only)
- `PUT /api/rooms/:id` - Update room (Manager only)

### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/customer/:customerId` - Get customer bookings
- `POST /api/bookings` - Create booking (Sales only)
- `PUT /api/bookings/:id/approve` - Approve booking (Accountant/Manager)
- `PUT /api/bookings/:id/reject` - Reject booking (Accountant/Manager)

---

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

---

## Troubleshooting

### CORS Error
- Ensure backend is running on `http://localhost:5000`
- Check that `Access-Control-Allow-Origin` is enabled in backend

### Login Issues
- Verify credentials match the demo accounts
- Check backend console for errors
- Clear browser cache and try again

### API Connection Failed
- Make sure backend server is running
- Check that frontend `.env` points to correct backend URL
- Verify network connectivity

---

## Features Implemented

✅ **Authentication & Authorization**
- JWT-based login/logout
- Role-based access control (RBAC)
- Protected routes

✅ **Sales Module**
- Customer management (CRUD)
- Room search with availability
- Booking deposit management

✅ **Accountant Module**
- Deposit approval workflow
- Stay management
- Payment processing
- Debt tracking

✅ **Manager Module**
- Dashboard with statistics
- Room occupancy tracking
- Revenue reports

✅ **UI/UX**
- Responsive design with Tailwind CSS
- Role-based layouts
- Modal dialogs
- Real-time data updates

---

## Next Steps / Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Payment gateway integration
- [ ] Document generation (invoices, contracts)

---

## Support

For issues or questions, please check:
1. Backend logs in terminal
2. Browser console (F12)
3. Verify credentials and permissions

---

**Happy coding! 🚀**
