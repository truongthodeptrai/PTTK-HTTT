import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import CustomerService from '../../services/customer.service';
import RoomService from '../../services/room.service';
import BookingService from '../../services/booking.service';

const ROLE_CONFIG = {
  title: 'Kinh doanh',
  avatarBg: 'bg-blue-100 text-blue-600',
  navItems: [
    { id: 'customer', label: 'Quản lý Khách hàng', icon: 'fas fa-users' },
    { id: 'room', label: 'Tra cứu Phòng/Giường', icon: 'fas fa-bed' },
    { id: 'booking', label: 'Đặt cọc & Xác nhận', icon: 'fas fa-handshake' },
  ],
};

export default function SalesLayout() {
  const [activeSection, setActiveSection] = useState('customer');
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', requirement: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      alert('Error loading customers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await RoomService.getAvailableRooms();
      setRooms(data);
    } catch (error) {
      alert('Error loading rooms: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await CustomerService.createCustomer(formData);
      setShowAddModal(false);
      setFormData({ name: '', phone: '', email: '', requirement: '' });
      loadCustomers();
      alert('Khách hàng đã được thêm thành công!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    if (section === 'room') {
      loadRooms();
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onNavigate={handleNavigate} activeSection={activeSection} roleConfig={ROLE_CONFIG} />

      <div className="flex-1 overflow-auto flex flex-col">
        <Navbar title={ROLE_CONFIG.navItems.find(item => item.id === activeSection)?.label || 'Trang chủ'} />

        <div className="flex-1 p-8">
          {/* Customer Section */}
          {activeSection === 'customer' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">Danh sách Khách hàng</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <i className="fas fa-plus"></i> Thêm khách hàng mới
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-5 px-6">Mã KH</th>
                      <th className="text-left py-5 px-6">Họ tên</th>
                      <th className="text-left py-5 px-6">SĐT</th>
                      <th className="text-left py-5 px-6">Yêu cầu</th>
                      <th className="text-center py-5 px-6">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="py-5 px-6 font-medium">{customer.code}</td>
                        <td className="py-5 px-6">{customer.name}</td>
                        <td className="py-5 px-6">{customer.phone}</td>
                        <td className="py-5 px-6">{customer.requirement}</td>
                        <td className="py-5 px-6 text-center">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">Chỉnh sửa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Room Section */}
          {activeSection === 'room' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Tra cứu Phòng / Giường trống</h2>
              <div className="grid grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-3xl p-6 shadow hover:shadow-lg transition">
                    <span className={`px-4 py-1 ${room.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-sm rounded-full`}>
                      Còn {room.available} {room.available === 1 ? 'giường' : 'giường'}
                    </span>
                    <h4 className="font-semibold text-lg mt-4">{room.name}</h4>
                    <p className="text-3xl font-bold text-blue-600 mt-4">{room.price.toLocaleString()}đ</p>
                    <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">
                      Chọn phòng này
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Section */}
          {activeSection === 'booking' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Đặt cọc & Xác nhận thuê</h2>
              <div className="bg-white p-8 rounded-3xl shadow">
                <p className="text-gray-500">Chọn khách hàng → Chọn phòng → Tính tiền cọc → Xác nhận</p>
                <button className="mt-6 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 transition">
                  Tạo yêu cầu đặt cọc mới
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg mx-4 p-8">
            <h3 className="text-2xl font-bold mb-6">Thêm Khách hàng</h3>
            <form onSubmit={handleAddCustomer}>
              <input
                type="text"
                placeholder="Họ tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-2xl mb-4 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border rounded-2xl mb-4 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-2xl mb-4 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Yêu cầu đặc biệt"
                value={formData.requirement}
                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                className="w-full px-4 py-3 border rounded-2xl mb-6 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
                >
                  Lưu thông tin
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-gray-300 text-gray-700 rounded-2xl hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
