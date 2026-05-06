// Placeholder for Stay Management
import { useState } from 'react';

export default function StayManagement() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Quản lý Lưu trú</h2>
      <div className="bg-white rounded-3xl shadow p-8">
        <p className="text-gray-500">Danh sách hợp đồng đang hiệu lực và tình trạng thanh toán...</p>
      </div>
    </div>
  );
}

/*
7
Quản lý đặt cọc
Nhân viên kế toán
Theo dõi đơn PENDING. Xác nhận khi nhận bill thanh toán (Chuyển sang WAITING_CONFIRM). 
8
Quản lý lưu trú
Nhân viên kế toán
Lập hợp đồng dựa trên đơn cọc thành công. Ghi nhận kỳ thanh toán (tháng/quý). 
9
Thanh toán và hoàn cọc
Nhân viên kế toán
Logic hoàn tiền: Áp dụng tỷ lệ 80% - 70% - 50% - 100% dựa trên thời gian thực tế khách ở. 
10
Công nợ và phạt
Nhân viên kế toán
Tính toán tiền điện, nước, hư hỏng tài sản và các khoản phạt vi phạm nội quy để trừ vào cọc. 
*/