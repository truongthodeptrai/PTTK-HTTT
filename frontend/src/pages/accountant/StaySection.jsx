import { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Mock stay data
const mockStays = [
  { id: 1, code: 'HĐ240401', customerId: 1, customerName: 'Trần Thị Lan', roomId: 1, checkIn: '2024-04-01', checkOut: '2024-06-30', monthlyFee: 3600000, status: 'active', paidMonths: 1 },
  { id: 2, code: 'HĐ240402', customerId: 2, customerName: 'Nguyễn Văn An', roomId: 2, checkIn: '2024-04-15', checkOut: null, monthlyFee: 4400000, status: 'active', paidMonths: 0 },
];

export default function StaySection() {
  const [stays] = useState(mockStays);
  const [error, setError] = useState('');

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đang lưu trú' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Kết thúc' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy' },
    };
    const s = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return <span className={`px-4 py-1 ${s.bg} ${s.text} rounded-full text-sm font-medium`}>{s.label}</span>;
  };

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
        <h2 className="text-xl font-semibold">Danh sách Lưu trú</h2>
        <div className="text-sm text-gray-600">Tổng: {stays.length} hợp đồng</div>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-x-auto">
        {stays.length === 0 ? (
          renderEmptyState('Không có hợp đồng lưu trú nào')
        ) : (
          <table className="min-w-[920px] w-full">
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
                    <button className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm">
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
  );
}
