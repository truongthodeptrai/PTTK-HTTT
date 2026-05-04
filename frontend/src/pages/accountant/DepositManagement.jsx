import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import BookingService from '../../services/booking.service';

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
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeSection === 'deposit') {
      loadBookings();
    }
  }, [activeSection]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      alert('Error loading bookings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await BookingService.approveBooking(bookingId);
      loadBookings();
      alert('Đã duyệt đặt cọc thành công!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return <span className="px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">Chờ xác nhận</span>;
    } else if (status === 'approved') {
      return <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">Đã duyệt</span>;
    }
    return <span className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{status}</span>;
  };

  return (
    <div className="flex h-screen">
      <Sidebar onNavigate={setActiveSection} activeSection={activeSection} roleConfig={ROLE_CONFIG} />

      <div className="flex-1 overflow-auto flex flex-col">
        <Navbar title={ROLE_CONFIG.navItems.find(item => item.id === activeSection)?.label || 'Trang chủ'} />

        <div className="flex-1 p-8">
          {/* Deposit Section */}
          {activeSection === 'deposit' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Danh sách Đặt cọc</h2>
                <button className="px-5 py-3 border rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition">
                  <i className="fas fa-filter"></i> Lọc
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-5 px-6">Mã Đặt cọc</th>
                      <th className="text-left py-5 px-6">Khách hàng</th>
                      <th className="text-left py-5 px-6">Phòng/Giường</th>
                      <th className="text-right py-5 px-6">Số tiền</th>
                      <th className="text-center py-5 px-6">Trạng thái</th>
                      <th className="text-center py-5 px-6">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="py-5 px-6 font-medium">{booking.code}</td>
                        <td className="py-5 px-6">{booking.customerName}</td>
                        <td className="py-5 px-6">P{booking.roomId}</td>
                        <td className="py-5 px-6 text-right font-semibold text-blue-600">
                          {booking.amount.toLocaleString()} đ
                        </td>
                        <td className="py-5 px-6 text-center">{getStatusBadge(booking.status)}</td>
                        <td className="py-5 px-6 text-center">
                          {booking.status === 'pending' ? (
                            <button
                              onClick={() => handleApprove(booking.id)}
                              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition"
                            >
                              Duyệt
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">Đã xử lý</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stay Section */}
          {activeSection === 'stay' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Quản lý Lưu trú</h2>
              <div className="bg-white rounded-3xl shadow p-8">
                <p className="text-gray-500">Danh sách hợp đồng đang hiệu lực và tình trạng thanh toán...</p>
              </div>
            </div>
          )}

          {/* Payment Section */}
          {activeSection === 'payment' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Thanh toán & Hoàn cọc</h2>
              <div className="bg-white rounded-3xl shadow p-8">
                <p className="text-gray-500">Xử lý hoàn cọc, khấu trừ, thanh toán thêm...</p>
              </div>
            </div>
          )}

          {/* Debt Section */}
          {activeSection === 'debt' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Công nợ & Phạt</h2>
              <div className="bg-white rounded-3xl shadow p-8">
                <p className="text-gray-500">Danh sách khách nợ tiền điện nước, phạt vi phạm...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
