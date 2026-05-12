const bcrypt = require("bcryptjs");
const EmployeeModel = require("../models/Employee.model");

class EmployeeService {
  static async getAllEmployees() {
    return await EmployeeModel.getAllEmployees();
  }

  static async createEmployee(data) {
    const { tenNhanVien, tenTaiKhoan, vaiTro, matKhau } = data;

    // Hash mật khẩu mặc định '123456'
    const password = matKhau || "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    const employeeData = {
      tenNhanVien,
      tenTaiKhoan,
      vaiTro,
      matKhauHash: hashedPassword,
    };

    return await EmployeeModel.createEmployee(employeeData);
  }

  static async toggleEmployeeStatus(id, trangThaiHoatDong) {
    return await EmployeeModel.toggleEmployeeStatus(id, trangThaiHoatDong);
  }

  static async resetEmployeePassword(id, defaultPassword) {
    // Hash mật khẩu mặc định '123456'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    return await EmployeeModel.resetEmployeePassword(id, hashedPassword);
  }
}

module.exports = EmployeeService;
