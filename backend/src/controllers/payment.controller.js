// Mock database
let payments = [
  { id: 1, bookingId: 1, bookingCode: 'DC240501', customerId: 1, amount: 7200000, type: 'deposit', status: 'completed', date: '2024-05-01' },
  { id: 2, bookingId: 2, bookingCode: 'DC240502', customerId: 2, amount: 8800000, type: 'deposit', status: 'pending', date: '2024-05-02' },
];

exports.getAllPayments = (req, res) => {
  try {
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentById = (req, res) => {
  try {
    const payment = payments.find(p => p.id === parseInt(req.params.id));
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPayment = (req, res) => {
  try {
    const { bookingId, bookingCode, customerId, amount, type } = req.body;
    const newId = Math.max(...payments.map(p => p.id), 0) + 1;

    const newPayment = {
      id: newId,
      bookingId,
      bookingCode,
      customerId,
      amount,
      type,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    payments.push(newPayment);
    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processPayment = (req, res) => {
  try {
    const payment = payments.find(p => p.id === parseInt(req.params.id));
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    payment.status = 'completed';
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentsByCustomer = (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId);
    const customerPayments = payments.filter(p => p.customerId === customerId);
    res.json({ success: true, data: customerPayments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
