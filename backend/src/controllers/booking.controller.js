const BookingModel = require("../models/Booking.model");

// Get all bookings/deposits
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.findAll();
    res.json(bookings);
  } catch (error) {
    console.error("Failed to load bookings:", error);
    res.status(500).json({ message: "Failed to load bookings" });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Failed to load booking:", error);
    res.status(500).json({ message: "Failed to load booking" });
  }
};

// Get bookings by customer ID
exports.getBookingsByCustomerId = async (req, res) => {
  try {
    const bookings = await BookingModel.findByCustomerId(req.params.customerId);
    res.json(bookings);
  } catch (error) {
    console.error("Failed to load bookings:", error);
    res.status(500).json({ message: "Failed to load bookings" });
  }
};

// Create new booking/deposit
exports.createBooking = async (req, res) => {
  try {
    const { customerId, roomId, amount, paymentDeadline, rentalType, bedCount } = req.body;

    // Validate required fields
    if (!customerId || !roomId || !amount) {
      return res.status(400).json({
        message: "Missing required fields: customerId, roomId, amount"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Deposit amount must be greater than 0" });
    }

    const booking = {
      customerId,
      roomId,
      amount,
      paymentDeadline,
      rentalType: rentalType || 1,
      bedCount: bedCount || 1,
      status: "pending"
    };

    const newBooking = await BookingModel.create(booking);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Failed to create booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedBooking = await BookingModel.updateStatus(id, status);
    res.json(updatedBooking);
  } catch (error) {
    console.error("Failed to update booking status:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

// Approve booking
exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.approve(id);
    res.json(booking);
  } catch (error) {
    console.error("Failed to approve booking:", error);
    res.status(500).json({ message: "Failed to approve booking" });
  }
};

// Reject booking
exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.reject(id);
    res.json(booking);
  } catch (error) {
    console.error("Failed to reject booking:", error);
    res.status(500).json({ message: "Failed to reject booking" });
  }
};
