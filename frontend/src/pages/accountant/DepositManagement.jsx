import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import DepositSection from './DepositSection';
import StaySection from './StaySection';
import PaymentSection from './PaymentSection';
import DebtSection from './DebtSection';

const ROLE_CONFIG = {
  title: 'Kế toán',
  avatarBg: 'bg-teal-100 text-teal-600',
  navItems: [
    { id: 'deposit', label: 'Quản lý Đặt cọc', icon: 'fas fa-money-bill-wave' },
    { id: 'stay', label: 'Quản lý Lưu trú', icon: 'fas fa-file-contract' },
    { id: 'payment', label: 'Thanh toán & Hoàn cọc', icon: 'fas fa-hand-holding-usd' },
    { id: 'debt', label: 'Công nợ & Phạt', icon: 'fas fa-exclamation-triangle' },
  ],
};

export default function AccountantLayout() {
  const [activeSection, setActiveSection] = useState('deposit');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onNavigate={setActiveSection} activeSection={activeSection} roleConfig={ROLE_CONFIG} />

      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
        <Navbar title={ROLE_CONFIG.navItems.find(item => item.id === activeSection)?.label || 'Trang chủ'} />

        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeSection === 'deposit' && <DepositSection />}
          {activeSection === 'stay' && <StaySection />}
          {activeSection === 'payment' && <PaymentSection />}
          {activeSection === 'debt' && <DebtSection />}
        </main>
      </div>
    </div>
  );
}
