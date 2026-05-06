import API from './api';

class PaymentService {
  getAllPayments() {
    return API.get('/payments').then((res) => res.data.data);
  }

  getPaymentById(id) {
    return API.get(`/payments/${id}`).then((res) => res.data.data);
  }

  getPaymentsByCustomer(customerId) {
    return API.get(`/payments/customer/${customerId}`).then((res) => res.data.data);
  }

  createPayment(payment) {
    return API.post('/payments', payment).then((res) => res.data.data);
  }

  processPayment(id) {
    return API.put(`/payments/${id}/process`).then((res) => res.data.data);
  }
}

export default new PaymentService();
