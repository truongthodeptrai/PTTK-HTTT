import API from './api';

class BookingService {
  getAllBookings() {
    return API.get('/bookings').then((res) => res.data.data);
  }

  getBookingById(id) {
    return API.get(`/bookings/${id}`).then((res) => res.data.data);
  }

  getBookingsByCustomer(customerId) {
    return API.get(`/bookings/customer/${customerId}`).then((res) => res.data.data);
  }

  createBooking(booking) {
    return API.post('/bookings', booking).then((res) => res.data.data);
  }

  approveBooking(id) {
    return API.put(`/bookings/${id}/approve`).then((res) => res.data.data);
  }

  rejectBooking(id) {
    return API.put(`/bookings/${id}/reject`).then((res) => res.data.data);
  }
}

export default new BookingService();
