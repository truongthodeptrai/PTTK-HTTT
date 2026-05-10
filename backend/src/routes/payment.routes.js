const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get('/', paymentController.getAllPayments);
router.get('/customer/:customerId', paymentController.getPaymentsByCustomer);
router.get('/:id', paymentController.getPaymentById);
router.post('/', authMiddleware.authorize(['accountant', 'manager']), paymentController.createPayment);
router.put('/:id/process', authMiddleware.authorize(['accountant']), paymentController.processPayment);

module.exports = router;
