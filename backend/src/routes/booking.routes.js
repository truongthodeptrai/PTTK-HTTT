const express = require('express');
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.get('/customer/:customerId', bookingController.getBookingsByCustomer);
router.post('/', authMiddleware.authorize(['sales']), bookingController.createBooking);
router.put('/:id/approve', authMiddleware.authorize(['accountant', 'manager']), bookingController.approveBooking);
router.put('/:id/reject', authMiddleware.authorize(['accountant', 'manager']), bookingController.rejectBooking);

module.exports = router;
