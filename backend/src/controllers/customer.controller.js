const CustomerService = require("../services/customer.service");

class CustomerController {
  static async getAllCustomers(req, res) {
    try {
      const customers = await CustomerService.getAllCustomersWithStatus();

      res.json(customers);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getCustomerById(req, res) {
    try {
      const id = req.params.id;
      const customer = await CustomerService.getCustomerById(id);
      if (!customer)
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
      res.json(customer);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async createCustomer(req, res) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (err) {
      res.status(500).json({ message: "Tạo khách hàng thất bại" });
    }
  }

  static async updateCustomer(req, res) {
    try {
      const id = req.params.id;
      const customer = await CustomerService.updateCustomer(id, req.body);
      if (!customer)
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
      res.json(customer);
    } catch (err) {
      res.status(500).json({ message: "Cập nhật khách hàng thất bại" });
    }
  }

  static async deleteCustomer(req, res) {
    try {
      const id = req.params.id;
      const success = await CustomerService.deleteCustomer(id);
      if (!success)
        return res.status(404).json({ message: "Không tìm thấy khách hàng" });
      res.json({ message: "Xóa khách hàng thành công" });
    } catch (err) {
      res.status(500).json({ message: "Xóa khách hàng thất bại" });
    }
  }
}

module.exports = CustomerController;
