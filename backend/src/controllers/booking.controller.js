// Mock database
let bookings = [
  { id: 1, code: 'DC240501', customerId: 1, customerName: 'Trần Thị Lan', roomId: 1, amount: 7200000, status: 'pending', createdAt: '2024-05-01' },
  { id: 2, code: 'DC240502', customerId: 2, customerName: 'Nguyễn Văn An', roomId: 2, amount: 8800000, status: 'approved', createdAt: '2024-05-02' },
];

exports.getAllBookings = (req, res) => {
  try {
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingById = (req, res) => {
  try {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = (req, res) => {
  try {
    const { customerId, customerName, roomId, amount } = req.body;
    const newId = Math.max(...bookings.map(b => b.id), 0) + 1;
    const newCode = `DC${Date.now()}`.slice(0, 10);

    const newBooking = {
      id: newId,
      code: newCode,
      customerId,
      customerName,
      roomId,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    bookings.push(newBooking);
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveBooking = (req, res) => {
  try {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'approved';
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectBooking = (req, res) => {
  try {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'rejected';
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookingsByCustomer = (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId);
    const customerBookings = bookings.filter(b => b.customerId === customerId);
    res.json({ success: true, data: customerBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
