// Mock database
let rooms = [
  { id: 1, code: 'P402', name: 'P402 - CS1 (4 người)', capacity: 4, price: 1800000, available: 2, status: 'available' },
  { id: 2, code: 'P105', name: 'P105 - Phòng nguyên', capacity: 1, price: 4400000, available: 1, status: 'available' },
  { id: 3, code: 'P203', name: 'P203 - CS2 (2 người)', capacity: 2, price: 2200000, available: 0, status: 'full' },
  { id: 4, code: 'P301', name: 'P301 - CS1 (1 người)', capacity: 1, price: 2200000, available: 1, status: 'available' },
];

let beds = [
  { id: 1, roomId: 1, bedNumber: '01', status: 'available' },
  { id: 2, roomId: 1, bedNumber: '02', status: 'available' },
  { id: 3, roomId: 1, bedNumber: '03', status: 'occupied' },
  { id: 4, roomId: 1, bedNumber: '04', status: 'occupied' },
  { id: 5, roomId: 2, bedNumber: '01', status: 'available' },
];

exports.getAllRooms = (req, res) => {
  try {
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableRooms = (req, res) => {
  try {
    const available = rooms.filter(r => r.status === 'available');
    res.json({ success: true, data: available });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRoomById = (req, res) => {
  try {
    const room = rooms.find(r => r.id === parseInt(req.params.id));
    const roomBeds = beds.filter(b => b.roomId === parseInt(req.params.id));
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, data: { ...room, beds: roomBeds } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRoom = (req, res) => {
  try {
    const { code, name, capacity, price } = req.body;
    const newId = Math.max(...rooms.map(r => r.id), 0) + 1;

    const newRoom = {
      id: newId,
      code,
      name,
      capacity,
      price,
      available: capacity,
      status: 'available'
    };
    
    rooms.push(newRoom);
    res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRoom = (req, res) => {
  try {
    const room = rooms.find(r => r.id === parseInt(req.params.id));
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    Object.assign(room, req.body);
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBedsByRoom = (req, res) => {
  try {
    const roomBeds = beds.filter(b => b.roomId === parseInt(req.params.id));
    res.json({ success: true, data: roomBeds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
