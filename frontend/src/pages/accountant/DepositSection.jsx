import { useState, useEffect } from 'react';
import BookingService from '../../services/booking.service';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DepositSection() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await BookingService.getAllBookings();
      setBookings(data || []);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải đặt cọc');
    } finally {
      setLoading(false);
    }
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

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Chờ xác nhận' },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đã duyệt' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Hoàn thành' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Từ chối' },
    };
    const s = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return <span className={`px-4 py-1 ${s.bg} ${s.text} rounded-full text-sm font-medium`}>{s.label}</span>;
  };

  const statusFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'approved', label: 'Đã duyệt' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'rejected', label: 'Từ chối' },
  ];

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter((booking) => booking.status === statusFilter);

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
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl flex items-center gap-3">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-700 hover:text-red-900">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Danh sách Đặt cọc</h2>
          <p className="text-sm text-gray-500">
            Hiển thị {filteredBookings.length}/{bookings.length} đặt cọc
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((current) => !current)}
          className={`cursor-pointer px-5 py-3 border rounded-2xl flex items-center gap-2 transition ${
            showFilters || statusFilter !== 'all'
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'hover:bg-gray-50'
          }`}
        >
          <i className="fas fa-filter"></i> Lọc
        </button>
      </div>

      {loading ? (
        renderLoadingState()
      ) : (
        <div className="space-y-4">
          {showFilters && (
            <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition ${
                    statusFilter === filter.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
              {statusFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="cursor-pointer ml-auto text-sm text-blue-600 hover:text-blue-700"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          )}

          <div className="bg-white rounded-3xl shadow overflow-x-auto">
            {bookings.length === 0 ? (
              renderEmptyState('Không có đặt cọc nào')
            ) : filteredBookings.length === 0 ? (
              renderEmptyState('Không có đặt cọc phù hợp với bộ lọc')
            ) : (
              <table className="min-w-[860px] w-full">
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition">
                    <td className="py-5 px-6 font-medium text-blue-600">{booking.code}</td>
                    <td className="py-5 px-6">{booking.customerName}</td>
                    <td className="py-5 px-6">{booking.roomId}</td>
                    <td className="py-5 px-6 text-right font-semibold text-blue-600">
                      {formatCurrency(booking.amount)}
                    </td>
                    <td className="py-5 px-6 text-center">{getStatusBadge(booking.status)}</td>
                    <td className="py-5 px-6 text-center">
                      {booking.status === 'pending' ? (
                        <button
                          onClick={() => handleApproveBooking(booking.id)}
                          className="cursor-pointer px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition"
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
        </div>
      )}
    </div>
  );
}
