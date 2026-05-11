const AuthService = require("../services/auth.service");

class AuthController {
  static async login(req, res) {
    try {
      // Lấy dữ liệu từ body của request
      const { username, password } = req.body;

      // Kiểm tra sơ bộ dữ liệu đầu vào
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu" });
      }

      // Gọi service xử lý
      const result = await AuthService.login(username, password);

      // Trả kết quả về client
      return res.json(result);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      return res.status(err.status || 500).json({
        message: err.message || "Lỗi máy chủ nội bộ",
      });
    }
  }
}

module.exports = AuthController;
