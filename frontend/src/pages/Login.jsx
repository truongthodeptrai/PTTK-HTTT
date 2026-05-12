import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import thêm useNavigate
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // Khai báo hook điều hướng

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Gửi đúng object { username, password } khớp với Backend
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      // Backend trả về: { token, user: { MaNhanVien, TenNhanVien, VaiTro, ... } }
      const { token, user } = response.data;

      // Đổi sang dùng sessionStorage thay vì localStorage để bảo mật hơn
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Điều hướng dựa trên VaiTro
      const role = user.VaiTro?.toLowerCase();

      // Sử dụng navigate và trỏ thẳng vào các trang con để tránh lỗi màn hình trắng
      if (role === "sale" || role === "sales" || role === "nhân viên bán hàng") {
        navigate("/sales/customer-management");
      } else if (role === "accountant" || role === "kế toán") {
        navigate("/accountant/stay-management");
      } else if (role === "manager" || role === "quản lý") {
        navigate("/manager/employee-management");
      } else {
        // Nếu role không khớp, có thể đẩy về một trang báo lỗi hoặc đẩy ra form login lại
        sessionStorage.clear();
        setMessage("Tài khoản của bạn không có quyền truy cập hợp lệ.");
      }
    } catch (err) {
      // Lấy message lỗi từ tầng Business/Service trả về
      const errorMsg = err.response?.data?.message || "Kết nối server thất bại";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header với FontAwesome Icon */}
        <div className="bg-blue-700 text-white p-10 text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-hotel text-4xl"></i>
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-wider">
            HomeStay Dorm
          </h1>
          <p className="mt-2 opacity-80 font-light">
            Hệ thống quản lý ký túc xá
          </p>
        </div>

        {/* Form Đăng nhập */}
        <form onSubmit={handleLogin} className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Đăng nhập hệ thống
          </h2>

          <div className="space-y-5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-4 rounded-2xl font-bold text-lg shadow-lg transform transition active:scale-95 uppercase`}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập ngay"}
            </button>
          </div>

          {message && (
            <div className="mt-6 p-3 bg-red-50 border-l-4 border-red-500 flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
              <p className="text-red-600 text-sm font-medium">{message}</p>
            </div>
          )}
        </form>

        <div className="bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2026 HomeStay Dorm Management System
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;