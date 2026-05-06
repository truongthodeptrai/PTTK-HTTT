import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import BookingService from '../../services/booking.service';
import PaymentService from '../../services/payment.service';
import DebtService from '../../services/debt.service';

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

// Mock stay data
const mockStays = [
  { id: 1, code: 'HĐ240401', customerId: 1, customerName: 'Trần Thị Lan', roomId: 1, checkIn: '2024-04-01', checkOut: '2024-06-30', monthlyFee: 3600000, status: 'active', paidMonths: 1 },
  { id: 2, code: 'HĐ240402', customerId: 2, customerName: 'Nguyễn Văn An', roomId: 2, checkIn: '2024-04-15', checkOut: null, monthlyFee: 4400000, status: 'active', paidMonths: 0 },
];

export default function AccountantLayout() {
  const [activeSection, setActiveSection] = useState('deposit');
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [debts, setDebts] = useState([]);
  const [stays, setStays] = useState(mockStays);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDataBySection(activeSection);
  }, [activeSection]);

  const loadDataBySection = async (section) => {
    setError('');
    setLoading(true);
    try {
      switch (section) {
        case 'deposit':
          await loadBookings();
          break;
        case 'payment':
          await loadPayments();
          break;
        case 'debt':
          await loadDebts();
          break;
        case 'stay':
          // stays are already loaded
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    const data = await BookingService.getAllBookings();
    setBookings(data || []);
  };

  const loadPayments = async () => {
    const data = await PaymentService.getAllPayments();
    setPayments(data || []);
  };

  const loadDebts = async () => {
    const data = await DebtService.getAllDebts();
    setDebts(data || []);
  };

  const handleApproveBooking = async (bookingId) => {
    if (!window.confirm('Xác nhận duyệt đặt cọc này?')) return;
    try {
      await BookingService.approveBooking(bookingId);
      await loadBookings();
      alert('✓ Đã duyệt đặt cọc thành công!');
    } catch (error) {
      alert('❌ Lỗi: ' + error.message);
    }
  };

  const handleProcessPayment = async (paymentId) => {
    if (!window.confirm('Xác nhận xử lý thanh toán này?')) return;
    try {
      await PaymentService.processPayment(paymentId);
      await loadPayments();
      alert('✓ Đã xử lý thanh toán thành công!');
    } catch (error) {
      alert('❌ Lỗi: ' + error.message);
    }
  };

  const handleMarkDebtAsPaid = async (debtId) => {
    if (!window.confirm('Xác nhận công nợ này đã được thanh toán?')) return;
    try {
      await DebtService.markDebtAsPaid(debtId);
      await loadDebts();
      alert('✓ Đã cập nhật công nợ thành công!');
    } catch (error) {
      alert('❌ Lỗi: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Chờ xác nhận' },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đã duyệt' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Hoàn thành' },
      active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đang lưu trú' },
      completed_stay: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Kết thúc' },
      overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Quá hạn' },
      paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đã thanh toán' },
    };
    const s = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return <span className={`px-4 py-1 ${s.bg} ${s.text} rounded-full text-sm font-medium`}>{s.label}</span>;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4 block"></i>
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  const renderEmptyState = (message) => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <i className="fas fa-inbox text-4xl text-gray-300 mb-4 block"></i>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <Sidebar onNavigate={setActiveSection} activeSection={activeSection} roleConfig={ROLE_CONFIG} />

      <div className="flex-1 overflow-auto flex flex-col">
        <Navbar title={ROLE_CONFIG.navItems.find(item => item.id === activeSection)?.label || 'Trang chủ'} />

        <div className="flex-1 p-8 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl flex items-center gap-3">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
              <button onClick={() => setError('')} className="ml-auto text-red-700 hover:text-red-900">
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {/* Deposit Section */}
          {activeSection === 'deposit' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Danh sách Đặt cọc</h2>
                <button className="px-5 py-3 border rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition">
                  <i className="fas fa-filter"></i> Lọc
                </button>
              </div>

              {loading ? renderLoadingState() : (
                <div className="bg-white rounded-3xl shadow overflow-hidden">
                  {bookings.length === 0 ? (
                    renderEmptyState('Không có đặt cọc nào')
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left py-5 px-6 font-semibold">Mã Đặt cọc</th>
                          <th className="text-left py-5 px-6 font-semibold">Khách hàng</th>
                          <th className="text-left py-5 px-6 font-semibold">Phòng</th>
                          <th className="text-right py-5 px-6 font-semibold">Số tiền</th>
                          <th className="text-center py-5 px-6 font-semibold">Trạng thái</th>
                          <th className="text-center py-5 px-6 font-semibold">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-sm">
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50 transition">
                            <td className="py-5 px-6 font-medium text-blue-600">{booking.code}</td>
                            <td className="py-5 px-6">{booking.customerName}</td>
                            <td className="py-5 px-6">P{booking.roomId}</td>
                            <td className="py-5 px-6 text-right font-semibold text-blue-600">
                              {formatCurrency(booking.amount)}
                            </td>
                            <td className="py-5 px-6 text-center">{getStatusBadge(booking.status)}</td>
                            <td className="py-5 px-6 text-center">
                              {booking.status === 'pending' ? (
                                <button
                                  onClick={() => handleApproveBooking(booking.id)}
                                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition"
                                >
                                  <i className="fas fa-check mr-2"></i>Duyệt
                                </button>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  <i className="fas fa-check-circle mr-1"></i>Đã xử lý
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Stay Section */}
          {activeSection === 'stay' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Danh sách Lưu trú</h2>
                <div className="text-sm text-gray-600">Tổng: {stays.length} hợp đồng</div>
              </div>

              <div className="bg-white rounded-3xl shadow overflow-hidden">
                {stays.length === 0 ? (
                  renderEmptyState('Không có hợp đồng lưu trú nào')
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left py-5 px-6 font-semibold">Mã hợp đồng</th>
                        <th className="text-left py-5 px-6 font-semibold">Khách hàng</th>
                        <th className="text-left py-5 px-6 font-semibold">Phòng</th>
                        <th className="text-left py-5 px-6 font-semibold">Check-in</th>
                        <th className="text-right py-5 px-6 font-semibold">Phí/Tháng</th>
                        <th className="text-center py-5 px-6 font-semibold">Trạng thái</th>
                        <th className="text-center py-5 px-6 font-semibold">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {stays.map((stay) => (
                        <tr key={stay.id} className="hover:bg-gray-50 transition">
                          <td className="py-5 px-6 font-medium text-blue-600">{stay.code}</td>
                          <td className="py-5 px-6">{stay.customerName}</td>
                          <td className="py-5 px-6">P{stay.roomId}</td>
                          <td className="py-5 px-6">{formatDate(stay.checkIn)}</td>
                          <td className="py-5 px-6 text-right font-semibold">
                            {formatCurrency(stay.monthlyFee)}
                          </td>
                          <td className="py-5 px-6 text-center">{getStatusBadge(stay.status)}</td>
                          <td className="py-5 px-6 text-center">
                            <button className="text-blue-600 hover:text-blue-700 text-sm">
                              <i className="fas fa-eye"></i> Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Payment Section */}
          {activeSection === 'payment' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Thanh toán & Hoàn cọc</h2>
                <button className="px-5 py-3 border rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition">
                  <i className="fas fa-plus"></i> Tạo thanh toán
                </button>
              </div>

              {loading ? renderLoadingState() : (
                <div className="space-y-6">
                  {/* Payment Stats */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-600 text-sm font-medium">Thanh toán</p>
                          <p className="text-2xl font-bold text-emerald-700 mt-2">
                            {formatCurrency(payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0))}
                          </p>
                        </div>
                        <i className="fas fa-check-circle text-4xl text-emerald-200"></i>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-600 text-sm font-medium">Chờ xử lý</p>
                          <p className="text-2xl font-bold text-amber-700 mt-2">
                            {formatCurrency(payments.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0))}
                          </p>
                        </div>
                        <i className="fas fa-hourglass text-4xl text-amber-200"></i>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Hoàn cọc</p>
                          <p className="text-2xl font-bold text-blue-700 mt-2">
                            {payments.filter(p => p.type === 'refund').length} lần
                          </p>
                        </div>
                        <i className="fas fa-undo text-4xl text-blue-200"></i>
                      </div>
                    </div>
                  </div>

                  {/* Payment Table */}
                  <div className="bg-white rounded-3xl shadow overflow-hidden">
                    {payments.length === 0 ? (
                      renderEmptyState('Không có thanh toán nào')
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left py-5 px-6 font-semibold">Mã Thanh toán</th>
                            <th className="text-left py-5 px-6 font-semibold">Khách hàng</th>
                            <th className="text-left py-5 px-6 font-semibold">Loại</th>
                            <th className="text-right py-5 px-6 font-semibold">Số tiền</th>
                            <th className="text-center py-5 px-6 font-semibold">Trạng thái</th>
                            <th className="text-center py-5 px-6 font-semibold">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                          {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50 transition">
                              <td className="py-5 px-6 font-medium">{payment.bookingCode || `PT${payment.id}`}</td>
                              <td className="py-5 px-6">{payment.customerName || `Khách ${payment.customerId}`}</td>
                              <td className="py-5 px-6">
                                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                  {payment.type === 'deposit' ? '🏠 Đặt cọc' : '💰 Khác'}
                                </span>
                              </td>
                              <td className="py-5 px-6 text-right font-semibold">
                                {formatCurrency(payment.amount)}
                              </td>
                              <td className="py-5 px-6 text-center">{getStatusBadge(payment.status)}</td>
                              <td className="py-5 px-6 text-center">
                                {payment.status === 'pending' ? (
                                  <button
                                    onClick={() => handleProcessPayment(payment.id)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
                                  >
                                    <i className="fas fa-check mr-1"></i>Xác nhận
                                  </button>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    <i className="fas fa-check-circle mr-1"></i>Xong
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Debt Section */}
          {activeSection === 'debt' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Công nợ & Phạt</h2>
                <div className="text-sm text-gray-600">
                  Tổng công nợ: <span className="font-bold text-red-600">{formatCurrency(debts.reduce((sum, d) => sum + d.amount, 0))}</span>
                </div>
              </div>

              {loading ? renderLoadingState() : (
                <div className="space-y-6">
                  {/* Debt Stats */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-600 text-sm font-medium">Quá hạn</p>
                          <p className="text-2xl font-bold text-red-700 mt-2">
                            {debts.filter(d => d.status === 'overdue').length}
                          </p>
                        </div>
                        <i className="fas fa-exclamation-triangle text-4xl text-red-200"></i>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-600 text-sm font-medium">Chờ thanh toán</p>
                          <p className="text-2xl font-bold text-orange-700 mt-2">
                            {debts.filter(d => d.status === 'pending').length}
                          </p>
                        </div>
                        <i className="fas fa-clock text-4xl text-orange-200"></i>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-600 text-sm font-medium">Đã thanh toán</p>
                          <p className="text-2xl font-bold text-emerald-700 mt-2">
                            {debts.filter(d => d.status === 'paid').length}
                          </p>
                        </div>
                        <i className="fas fa-check text-4xl text-emerald-200"></i>
                      </div>
                    </div>
                  </div>

                  {/* Debt Table */}
                  <div className="bg-white rounded-3xl shadow overflow-hidden">
                    {debts.length === 0 ? (
                      renderEmptyState('Không có công nợ nào')
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left py-5 px-6 font-semibold">Khách hàng</th>
                            <th className="text-left py-5 px-6 font-semibold">Loại</th>
                            <th className="text-left py-5 px-6 font-semibold">Mô tả</th>
                            <th className="text-right py-5 px-6 font-semibold">Số tiền</th>
                            <th className="text-left py-5 px-6 font-semibold">Ngày</th>
                            <th className="text-center py-5 px-6 font-semibold">Trạng thái</th>
                            <th className="text-center py-5 px-6 font-semibold">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                          {debts.map((debt) => (
                            <tr key={debt.id} className="hover:bg-gray-50 transition">
                              <td className="py-5 px-6 font-medium">{debt.customerName}</td>
                              <td className="py-5 px-6">
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                  debt.type === 'utilities' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {debt.type === 'utilities' ? '💡 Tiền ứ' : '⚠️ Phạt'}
                                </span>
                              </td>
                              <td className="py-5 px-6">{debt.description}</td>
                              <td className="py-5 px-6 text-right font-semibold text-red-600">
                                {formatCurrency(debt.amount)}
                              </td>
                              <td className="py-5 px-6">{formatDate(debt.date)}</td>
                              <td className="py-5 px-6 text-center">{getStatusBadge(debt.status)}</td>
                              <td className="py-5 px-6 text-center">
                                {debt.status !== 'paid' ? (
                                  <button
                                    onClick={() => handleMarkDebtAsPaid(debt.id)}
                                    className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition"
                                  >
                                    <i className="fas fa-check mr-1"></i>Thu tiền
                                  </button>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    <i className="fas fa-check-circle mr-1"></i>Đã thu
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
