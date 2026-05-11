const employeeService = require("../services/employee.service");

class EmployeeController {
  // GET / - Lấy danh sách nhân viên
  static async getAllEmployees(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.status(200).json(employees);
    } catch (err) {
      console.error("Error getting employees:", err);
      res.status(500).json({
        success: false,
        message: "Không thể lấy danh sách nhân viên",
        error: err.message,
      });
    }
  }

  // POST / - Tạo nhân viên mới
  static async createEmployee(req, res) {
    try {
      const { tenNhanVien, tenTaiKhoan, vaiTro, matKhau } = req.body;

      if (!tenNhanVien || !tenTaiKhoan || !vaiTro) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp tất cả thông tin bắt buộc",
        });
      }

      const newEmployee = await employeeService.createEmployee({
        tenNhanVien,
        tenTaiKhoan,
        vaiTro,
        matKhau: matKhau || "123456",
      });

      res.status(201).json({
        success: true,
        message: "Tạo tài khoản nhân viên thành công",
        data: newEmployee,
      });
    } catch (err) {
      console.error("Error creating employee:", err);
      res.status(500).json({
        success: false,
        message: "Không thể tạo tài khoản nhân viên",
        error: err.message,
      });
    }
  }

  static async toggleEmployeeStatus(req, res) {
    try {
      const { id } = req.params;
      // 1. SỬA LẠI TÊN BIẾN CHO KHỚP VỚI FRONTEND GỬI LÊN
      const { TrangThaiHoatDong } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID nhân viên không hợp lệ" });
      }

      if (typeof TrangThaiHoatDong !== "boolean") {
        return res
          .status(400)
          .json({ message: "Giá trị trạng thái không hợp lệ" });
      }

      // 2. Truyền trạng thái mới xuống Service để Update DB
      const updatedEmployee = await employeeService.toggleEmployeeStatus(
        id,
        TrangThaiHoatDong,
      );

      // 3. TRẢ VỀ TRỰC TIẾP updatedEmployee ĐỂ FRONTEND CẬP NHẬT UI
      res.status(200).json(updatedEmployee);
    } catch (err) {
      console.error("🚨 Error toggling employee status:", err);
      res.status(500).json({
        message: "Không thể thay đổi trạng thái tài khoản",
        error: err.message,
      });
    }
  }
  // PUT /:id/reset-password - Reset mật khẩu
  static async resetEmployeePassword(req, res) {
    try {
      const { id } = req.params;
      const defaultPassword = "123456";

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID nhân viên không hợp lệ",
        });
      }

      const updatedEmployee = await employeeService.resetEmployeePassword(
        id,
        defaultPassword,
      );

      res.status(200).json({
        success: true,
        message: "Mật khẩu đã được reset thành 123456",
        data: updatedEmployee,
      });
    } catch (err) {
      console.error("Error resetting employee password:", err);
      res.status(500).json({
        success: false,
        message: "Không thể reset mật khẩu",
        error: err.message,
      });
    }
  }
}

module.exports = EmployeeController;
