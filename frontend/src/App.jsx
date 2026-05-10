// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TrangSoDoPhong from './pages/TrangSoDoPhong';

// Tạm thời giả lập các trang (sau này sẽ tách ra file riêng trong thư mục pages)

const TrangGiaoDichDatCoc = () => <div>Màn hình: Quản lý Đặt cọc (Dành cho Kế toán)</div>;
const TrangKhachHang = () => <div>Màn hình: Quản lý Khách hàng</div>;

function App() {
  // Giả sử người đang đăng nhập là Kế toán. Bạn có thể đổi thành 'SALE' để test thử.
  const currentUserRole = 'SALE'; // Hoặc 'SALE'

  return (
    <BrowserRouter>
      <Routes>
        {/* Route cha: Sử dụng Layout làm khung hiển thị chung */}
        <Route path="/" element={<Layout userRole={currentUserRole} />}>
          
          {/* Các Route con: Sẽ được hiển thị bên trong Layout */}
            <Route path="tra-cuu-phong" element={<TrangSoDoPhong />} />
            {/* <Route path="quan-ly-khach-hang" element={<TrangKhachHang />} /> */}
          
          {currentUserRole === 'KE_TOAN' && (
            <Route path="phieu-dat-coc" element={<TrangGiaoDichDatCoc />} />
          )}

          {currentUserRole === 'SALE' && (
            <Route path="khach-hang" element={<TrangKhachHang />} />
          )}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
