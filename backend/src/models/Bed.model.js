const RoomModel = require('./Room.model');

class BedModel {
  static async findByRoomId(roomId) {
    const room = await RoomModel.findById(roomId);
    if (!room) return [];

    const capacity = room.capacity || 0;
    const available = room.available || 0;
    const occupied = Math.max(capacity - available, 0);

    return Array.from({ length: capacity }, (_, index) => ({
      id: Number(`${room.id}${String(index + 1).padStart(2, '0')}`),
      roomId: room.id,
      bedNumber: String(index + 1).padStart(2, '0'),
      status: index < occupied ? 'occupied' : 'available',
    }));
  }
}

module.exports = BedModel;
