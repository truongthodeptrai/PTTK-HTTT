import { useState, useEffect } from 'react';
import PaymentService from '../../services/payment.service';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function PaymentSection() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await PaymentService.getAllPayments();
      setPayments(data || []);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải thanh toán');
    } finally {
      setLoading(false);
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

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Chờ xác nhận' },
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Hoàn thành' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Thất bại' },
      refunded: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Hoàn cọc' },
    };
    const s = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return <span className={`px-4 py-1 ${s.bg} ${s.text} rounded-full text-sm font-medium`}>{s.label}</span>;
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

  const completedTotal = payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0);
  const pendingTotal = payments.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0);
  const refundCount = payments.filter(p => p.type === 'refund').length;

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
        <h2 className="text-xl font-semibold">Thanh toán & Hoàn cọc</h2>
        {/* <button className="cursor-pointer px-5 py-3 border rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition">
          <i className="fas fa-plus"></i> Tạo thanh toán
        </button> */}
      </div>

      {loading ? (
        renderLoadingState()
      ) : (
        <div className="space-y-6">
          {/* Payment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Thanh toán</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-2">
                    {formatCurrency(completedTotal)}
                  </p>
                </div>
                <i className="fas fa-check-circle text-4xl text-emerald-200"></i>
              </div>
            </div>

            <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-3xl p-6 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-amber-700 mt-2">
                    {formatCurrency(pendingTotal)}
                  </p>
                </div>
                <i className="fas fa-hourglass text-4xl text-amber-200"></i>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Hoàn cọc</p>
                  <p className="text-2xl font-bold text-blue-700 mt-2">
                    {refundCount} lần
                  </p>
                </div>
                <i className="fas fa-undo text-4xl text-blue-200"></i>
              </div>
            </div>
          </div>

          {/* Payment Table */}
          <div className="bg-white rounded-3xl shadow overflow-x-auto">
            {payments.length === 0 ? (
              renderEmptyState('Không có thanh toán nào')
            ) : (
              <table className="min-w-[860px] w-full">
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
                      <td className="py-5 px-6 font-medium">{payment.bookingCode || `TP${payment.id}`}</td>
                      <td className="py-5 px-6">{payment.customerName || `Khách ${payment.customerId}`}</td>
                      <td className="py-5 px-6">
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          {payment.type === 'DAT_COC' ? '🏠 Đặt cọc' : '💰 Tiền phòng'}
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
                            className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
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
  );
}
