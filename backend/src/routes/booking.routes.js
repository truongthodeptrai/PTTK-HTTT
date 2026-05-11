const express = require("express");
const bookingController = require("../controllers/booking.controller");

const router = express.Router();

// Get all bookings/deposits
router.get("/", bookingController.getAllBookings);

// Get booking by ID
router.get("/:id", bookingController.getBookingById);

// Get bookings by customer ID
router.get("/customer/:customerId", bookingController.getBookingsByCustomerId);

// Create new booking/deposit
router.post("/", bookingController.createBooking);

// Update booking status
router.patch("/:id/status", bookingController.updateBookingStatus);

// Approve booking
router.patch("/:id/approve", bookingController.approveBooking);

// Reject booking
router.patch("/:id/reject", bookingController.rejectBooking);

module.exports = router;
