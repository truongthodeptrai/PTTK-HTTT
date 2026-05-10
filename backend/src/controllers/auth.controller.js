const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');
const config = require('../config');

function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    branchId: user.branchId,
    branchName: user.branchName,
  };
}

async function isPasswordValid(password, passwordHash) {
  if (!passwordHash) return false;

  const looksHashed = passwordHash.startsWith('$2a$')
    || passwordHash.startsWith('$2b$')
    || passwordHash.startsWith('$2y$');

  if (!looksHashed) {
    return password === passwordHash;
  }

  return bcrypt.compare(password, passwordHash);
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required',
      });
    }

    const user = await UserModel.findByUsername(username);
    const passwordValid = user && await isPasswordValid(password, user.passwordHash);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
