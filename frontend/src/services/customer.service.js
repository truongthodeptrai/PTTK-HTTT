import API from './api';

class CustomerService {
  getAllCustomers() {
    return API.get('/customers').then((res) => res.data.data);
  }

  getCustomerById(id) {
    return API.get(`/customers/${id}`).then((res) => res.data.data);
  }

  createCustomer(customer) {
    return API.post('/customers', customer).then((res) => res.data.data);
  }

  updateCustomer(id, customer) {
    return API.put(`/customers/${id}`, customer).then((res) => res.data.data);
  }

  deleteCustomer(id) {
    return API.delete(`/customers/${id}`).then((res) => res.data.data);
  }
}

export default new CustomerService();
