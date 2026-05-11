const RoomModel = require("../models/Room.model");

class RoomService {
  static async getAllRooms() {
    return await RoomModel.getAllRooms();
  }
}

module.exports = RoomService;
