const RoomService = require("../services/room.service");

class RoomController {
  static async getAllRooms(req, res) {
    try {
      const rooms = await RoomService.getAllRooms();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = RoomController;
