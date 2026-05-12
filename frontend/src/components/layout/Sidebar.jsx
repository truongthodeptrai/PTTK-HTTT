import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ role }) {
  return (
    <aside
      style={{
        width: 250,
        background: 'linear-gradient(180deg, #1976d2 60%, #2196f3 100%)',
        color: 'white',
        padding: '28px 0 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxShadow: '2px 0 12px rgba(33,150,243,0.08)',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ padding: '0 28px 18px 28px', borderBottom: '1.5px solid #1565c0', marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>Menu</h3>
      </div>
      <ul style={{ listStyle: 'none', padding: '0 28px', margin: 0, flex: 1 }}>
        {/* Ai cũng xem được Sơ đồ phòng */}
        <li>
          <Link to="/so-do-phong" style={sidebarLinkStyle}>Sơ đồ phòng</Link>
        </li>
        {/* Menu của Kế toán */}
        {role === 'KE_TOAN' && (
          <li>
            <Link to="/phieu-dat-coc" style={sidebarLinkStyle}>Giao dịch Đặt cọc</Link>
          </li>
        )}
        {/* Menu của Sales */}
        {role === 'SALE' && (
          <li>
            <Link to="/khach-hang" style={sidebarLinkStyle}>Quản lý Khách hàng</Link>
          </li>
        )}
      </ul>
      <div style={{ flex: 0, padding: '18px 28px 24px 28px', fontSize: 13, color: '#bbdefb', borderTop: '1.5px solid #1565c0', marginTop: 10 }}>
        <span>© {new Date().getFullYear()} Homestay App</span>
      </div>
    </aside>
  );
}

const sidebarLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  display: 'block',
  padding: '12px 0 12px 12px',
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: 16,
  margin: '2px 0',
  transition: 'background 0.18s, color 0.18s',
  cursor: 'pointer',
  letterSpacing: 0.2,
  position: 'relative',
  outline: 'none',
};

export default Sidebar;