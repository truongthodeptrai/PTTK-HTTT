const express = require('express');
const roomController = require('../controllers/room.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get('/', roomController.getAllRooms);
router.get('/available', roomController.getAvailableRooms);
router.get('/:id', roomController.getRoomById);
router.get('/:id/beds', roomController.getBedsByRoom);
router.post('/', authMiddleware.authorize(['manager']), roomController.createRoom);
router.put('/:id', authMiddleware.authorize(['manager']), roomController.updateRoom);

module.exports = router;
