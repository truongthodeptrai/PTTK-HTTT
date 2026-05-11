const express = require('express');
const stayController = require('../controllers/stay.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get('/', stayController.getAllStays);
router.get('/:id', stayController.getStayById);

module.exports = router;
