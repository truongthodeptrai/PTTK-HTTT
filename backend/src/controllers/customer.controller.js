// Mock database
let customers = [
  { id: 1, code: 'KH240501', name: 'Trần Thị Lan', phone: '0987654321', email: 'lan@email.com', requirement: 'Phòng yên tĩnh' },
  { id: 2, code: 'KH240502', name: 'Nguyễn Văn An', phone: '0912345678', email: 'an@email.com', requirement: 'Gần phòng tắm' },
  { id: 3, code: 'KH240503', name: 'Phạm Thị Hoa', phone: '0978901234', email: 'hoa@email.com', requirement: 'Tầng cao' }
];

exports.getAllCustomers = (req, res) => {
  try {
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomerById = (req, res) => {
  try {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCustomer = (req, res) => {
  try {
    const { name, phone, email, requirement } = req.body;
    const newId = Math.max(...customers.map(c => c.id), 0) + 1;
    const newCode = `KH${Date.now()}`;

    const newCustomer = { id: newId, code: newCode, name, phone, email, requirement };
    customers.push(newCustomer);

    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCustomer = (req, res) => {
  try {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    Object.assign(customer, req.body);
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCustomer = (req, res) => {
  try {
    const index = customers.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const deleted = customers.splice(index, 1);
    res.json({ success: true, data: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
