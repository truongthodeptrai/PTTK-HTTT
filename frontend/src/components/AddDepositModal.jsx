import React, { useState, useEffect } from "react";

function AddDepositModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customerId: "",
    roomId: "",
    amount: "",
    paymentDeadline: "",
    rentalType: "1",
    bedCount: "1",
  });

  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch customers and rooms on modal open
  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchRooms();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers");
      if (response.ok) {
        const data = await response.json();
        const customerList = Array.isArray(data) ? data : data.data || [];
        // Map database columns to standard property names
        const mapped = customerList.map(c => ({
          id: c.MaKhachHang || c.id,
          name: c.HoTen || c.name,
          hoTen: c.HoTen // Keep for fallback
        }));
        setCustomers(mapped);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/rooms");
      if (response.ok) {
        const data = await response.json();
        const roomList = Array.isArray(data) ? data : data.data || [];
        // Map database columns to standard property names
        const mapped = roomList.map(r => ({
          id: r.MaPhong || r.id,
          name: r.TenPhong || r.name,
          tenPhong: r.TenPhong // Keep for fallback
        }));
        setRooms(mapped);
      }
    } catch (err) {
      console.error("Failed to load rooms:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.customerId) return "Vui lòng chọn khách hàng";
    if (!formData.roomId) return "Vui lòng chọn phòng";
    if (!formData.amount) return "Vui lòng nhập số tiền cọc";
    if (Number(formData.amount) <= 0) return "Số tiền cọc phải lớn hơn 0";
    if (!formData.paymentDeadline) return "Vui lòng chọn hạn thanh toán";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: parseInt(formData.customerId),
          roomId: parseInt(formData.roomId),
          amount: parseFloat(formData.amount),
          paymentDeadline: formData.paymentDeadline,
          rentalType: parseInt(formData.rentalType),
          bedCount: parseInt(formData.bedCount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tạo đặt cọc");
      }

      const result = await response.json();
      setSuccess(`Tạo đặt cọc thành công! Mã: ${result.code}`);
      
      // Reset form
      setFormData({
        customerId: "",
        roomId: "",
        amount: "",
        paymentDeadline: "",
        rentalType: "1",
        bedCount: "1",
      });

      // Call success callback
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Không thể tạo đặt cọc");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold">Thêm Đặt Cọc</h2>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khách hàng *
            </label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn khách hàng --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name || customer.hoTen || `ID: ${customer.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phòng *
            </label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name || room.tenPhong || `ID: ${room.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Deposit Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền cọc (VND) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              step="1000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Payment Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hạn thanh toán *
            </label>
            <input
              type="date"
              name="paymentDeadline"
              value={formData.paymentDeadline}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rental Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình thức thuê
            </label>
            <select
              name="rentalType"
              value={formData.rentalType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Theo giường</option>
              <option value="2">Nguyên phòng</option>
            </select>
          </div>

          {/* Bed Count */}
          {formData.rentalType === "1" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số giường đặt
              </label>
              <input
                type="number"
                name="bedCount"
                value={formData.bedCount}
                onChange={handleInputChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Tạo đặt cọc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDepositModal;
