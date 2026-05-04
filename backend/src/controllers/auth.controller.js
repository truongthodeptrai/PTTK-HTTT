const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock users database - Replace with real DB
const users = {
  'sale01': { id: 1, username: 'sale01', password: '123456', role: 'sales', name: 'Nguyễn Văn Sale' },
  'accountant01': { id: 2, username: 'accountant01', password: '123456', role: 'accountant', name: 'Lê Thị Kế Toán' },
  'manager01': { id: 3, username: 'manager01', password: '123456', role: 'manager', name: 'Trần Quản Lý' }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password required' 
      });
    }

    const user = users[username];

    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.getCurrentUser = (req, res) => {
  try {
    const user = users[req.user.username];
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
