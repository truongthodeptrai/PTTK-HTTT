const BookingModel = require('../models/Booking.model');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.findAll();
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingModel.findById(Number(req.params.id));

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const booking = await BookingModel.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await BookingModel.approve(Number(req.params.id));

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await BookingModel.reject(Number(req.params.id));

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingsByCustomer = async (req, res) => {
  try {
    const bookings = await BookingModel.findByCustomerId(Number(req.params.customerId));
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
