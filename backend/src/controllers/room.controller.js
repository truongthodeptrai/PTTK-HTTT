const BedModel = require('../models/Bed.model');
const RoomModel = require('../models/Room.model');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.findAll();
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.findAvailable();
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const roomId = Number(req.params.id);
    const room = await RoomModel.findById(roomId);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const beds = await BedModel.findByRoomId(roomId);
    res.json({ success: true, data: { ...room, beds } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await RoomModel.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await RoomModel.update(Number(req.params.id), req.body);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBedsByRoom = async (req, res) => {
  try {
    const beds = await BedModel.findByRoomId(Number(req.params.id));
    res.json({ success: true, data: beds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
