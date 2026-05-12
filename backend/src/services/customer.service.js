const CustomerModel = require("../models/Customer.model");

class CustomerService {
  static async getAllCustomersWithStatus() {
    return await CustomerModel.getAllCustomersWithStatus();
  }

  static async getCustomerById(id) {
    return await CustomerModel.getCustomerById(id);
  }

  static async createCustomer(data) {
    return await CustomerModel.createCustomer(data);
  }

  static async updateCustomer(id, data) {
    return await CustomerModel.updateCustomer(id, data);
  }

  static async deleteCustomer(id) {
    return await CustomerModel.deleteCustomer(id);
  }
}

module.exports = CustomerService;
