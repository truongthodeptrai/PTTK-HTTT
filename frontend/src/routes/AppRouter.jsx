import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Login from '../pages/Login';
import SalesLayout from '../pages/sales/Booking';
import AccountantLayout from '../pages/accountant/DepositManagement';
import ManagerLayout from '../pages/manager/Dashboard';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Sales Routes */}
        <Route
          path="/sales/*"
          element={
            <ProtectedRoute requiredRole="sales">
              <SalesLayout />
            </ProtectedRoute>
          }
        />

        {/* Accountant Routes */}
        <Route
          path="/accountant/*"
          element={
            <ProtectedRoute requiredRole="accountant">
              <AccountantLayout />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/*"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerLayout />
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
