// User Roles
export const USER_ROLES = {
  SALES: 'sales',
  ACCOUNTANT: 'accountant',
  MANAGER: 'manager'
};

// Status Types
export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const STAY_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const DEBT_STATUS = {
  PENDING: 'pending',
  OVERDUE: 'overdue',
  PAID: 'paid',
  PARTIAL: 'partial'
};

// Payment Types
export const PAYMENT_TYPES = {
  DEPOSIT: 'deposit',
  MONTHLY_FEE: 'monthly_fee',
  REFUND: 'refund',
  FINE: 'fine'
};

// Debt Types
export const DEBT_TYPES = {
  UTILITIES: 'utilities',
  FINE: 'fine',
  DAMAGE: 'damage',
  OTHER: 'other'
};

// Room Status
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  CUSTOMERS: '/customers',
  ROOMS: '/rooms',
  BOOKINGS: '/bookings',
  PAYMENTS: '/payments',
  STAYS: '/stays'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LAST_LOGIN: 'lastLogin',
  USER_PREFERENCES: 'userPreferences'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+84|0)[0-9]{9,10}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  ISO: 'yyyy-MM-dd',
  FULL: 'dd MMMM yyyy',
  TIME: 'HH:mm'
};

// Navigation
export const ROLE_ROUTES = {
  sales: [
    { path: '/sales/customers', label: 'Quản lý Khách hàng' },
    { path: '/sales/rooms', label: 'Tra cứu Phòng' },
    { path: '/sales/bookings', label: 'Đặt cọc & Xác nhận' }
  ],
  accountant: [
    { path: '/accountant/deposit', label: 'Quản lý Đặt cọc' },
    { path: '/accountant/stay', label: 'Quản lý Lưu trú' },
    { path: '/accountant/payment', label: 'Thanh toán & Hoàn cọc' },
    { path: '/accountant/debt', label: 'Công nợ & Phạt' }
  ],
  manager: [
    { path: '/manager/dashboard', label: 'Bảng điều khiển' },
    { path: '/manager/reports', label: 'Báo cáo' }
  ]
};
