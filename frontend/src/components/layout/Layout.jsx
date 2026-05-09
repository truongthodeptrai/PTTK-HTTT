import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout({ userRole }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8fa' }}>
      {/* Sidebar cố định chiều cao, cuộn nếu dài */}
      <Sidebar role={userRole} />
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header nổi bật */}
        <header style={{ padding: '18px 32px', background: 'linear-gradient(90deg, #2196f3 60%, #64b5f6 100%)', color: '#fff', borderBottom: '2px solid #1976d2', fontWeight: 600, letterSpacing: 0.5 }}>
          <h2 style={{ margin: 0, fontSize: 26 }}>Homestay Dashboard <span style={{ fontWeight: 400, fontSize: 18, marginLeft: 18 }}>Xin chào, <span style={{ color: '#ffe082' }}>{userRole}</span></span></h2>
        </header>
        {/* Main content area */}
        <main style={{ padding: '32px 36px', flex: 1, background: '#f6f8fa', minHeight: 0, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;