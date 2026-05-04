import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

const ROLE_CONFIG = {
  title: 'Quản lý',
  avatarBg: 'bg-purple-100 text-purple-600',
  navItems: [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: 'fas fa-chart-line' },
    { id: 'reports', label: 'Báo cáo', icon: 'fas fa-file-chart-bar' },
  ],
};

export default function ManagerLayout() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex h-screen">
      <Sidebar onNavigate={setActiveSection} activeSection={activeSection} roleConfig={ROLE_CONFIG} />

      <div className="flex-1 overflow-auto flex flex-col">
        <Navbar title={ROLE_CONFIG.navItems.find(item => item.id === activeSection)?.label || 'Trang chủ'} />

        <div className="flex-1 p-8">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Bảng điều khiển</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-3xl p-6 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Tổng khách hàng</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">248</p>
                    </div>
                    <i className="fas fa-users text-4xl text-blue-100"></i>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Phòng trống</p>
                      <p className="text-3xl font-bold text-emerald-600 mt-2">12</p>
                    </div>
                    <i className="fas fa-bed text-4xl text-emerald-100"></i>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Doanh thu tháng</p>
                      <p className="text-3xl font-bold text-amber-600 mt-2">850M</p>
                    </div>
                    <i className="fas fa-money-bill-wave text-4xl text-amber-100"></i>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Công nợ</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">45M</p>
                    </div>
                    <i className="fas fa-exclamation-circle text-4xl text-red-100"></i>
                  </div>
                </div>
              </div>

              {/* Charts/Tables */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow">
                  <h3 className="text-lg font-semibold mb-4">Tình trạng phòng</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="ml-4 text-sm font-medium">78% Đầy</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                      </div>
                      <span className="ml-4 text-sm font-medium">22% Trống</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow">
                  <h3 className="text-lg font-semibold mb-4">Top khách hàng lâu năm</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Trần Thị Lan</span>
                      <span className="font-medium">12 tháng</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nguyễn Văn An</span>
                      <span className="font-medium">8 tháng</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phạm Thị Hoa</span>
                      <span className="font-medium">6 tháng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Section */}
          {activeSection === 'reports' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Báo cáo</h2>
              <div className="bg-white rounded-3xl p-8 shadow">
                <p className="text-gray-500">Các báo cáo chi tiết về doanh thu, khách hàng, phòng...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
