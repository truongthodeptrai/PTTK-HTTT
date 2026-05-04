const express = require('express');
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.verifyToken);

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', authMiddleware.authorize(['sales']), customerController.createCustomer);
router.put('/:id', authMiddleware.authorize(['sales']), customerController.updateCustomer);
router.delete('/:id', authMiddleware.authorize(['sales']), customerController.deleteCustomer);

module.exports = router;
