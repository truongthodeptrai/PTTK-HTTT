const express = require("express");
const RoomController = require("../controllers/room.controller");
const router = express.Router();

// GET /api/rooms
router.get("/", RoomController.getAllRooms);

module.exports = router;
