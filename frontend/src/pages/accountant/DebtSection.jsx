import { useState, useEffect } from 'react';
import DebtService from '../../services/debt.service';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DebtSection() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await DebtService.getAllDebts();
      setDebts(data || []);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải công nợ');
    } finally {
      setLoading(false);
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
      pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Chờ thanh toán' },
      overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Quá hạn' },
      paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đã thanh toán' },
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

  const overdueCount = debts.filter(d => d.status === 'overdue').length;
  const pendingCount = debts.filter(d => d.status === 'pending').length;
  const paidCount = debts.filter(d => d.status === 'paid').length;
  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);

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
        <h2 className="text-xl font-semibold">Công nợ & Phạt</h2>
        <div className="text-sm text-gray-600">
          Tổng công nợ: <span className="font-bold text-red-600">{formatCurrency(totalDebt)}</span>
        </div>
      </div>

      {loading ? (
        renderLoadingState()
      ) : (
        <div className="space-y-6">
          {/* Debt Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-linear-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Quá hạn</p>
                  <p className="text-2xl font-bold text-red-700 mt-2">
                    {overdueCount}
                  </p>
                </div>
                <i className="fas fa-exclamation-triangle text-4xl text-red-200"></i>
              </div>
            </div>

            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Chờ thanh toán</p>
                  <p className="text-2xl font-bold text-orange-700 mt-2">
                    {pendingCount}
                  </p>
                </div>
                <i className="fas fa-clock text-4xl text-orange-200"></i>
              </div>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Đã thanh toán</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-2">
                    {paidCount}
                  </p>
                </div>
                <i className="fas fa-check text-4xl text-emerald-200"></i>
              </div>
            </div>
          </div>

          {/* Debt Table */}
          <div className="bg-white rounded-3xl shadow overflow-x-auto">
            {debts.length === 0 ? (
              renderEmptyState('Không có công nợ nào')
            ) : (
              <table className="min-w-[920px] w-full">
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
                          {debt.type === 'utilities' ? '💡 Tiền nước' : '⚠️ Phạt'}
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
  );
}
