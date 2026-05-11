const StayModel = require('../models/Stay.model');

exports.getAllStays = async (req, res) => {
  try {
    const stays = await StayModel.findAll();
    res.json({ success: true, data: stays });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStayById = async (req, res) => {
  try {
    const stay = await StayModel.findById(Number(req.params.id));

    if (!stay) {
      return res.status(404).json({ success: false, message: 'Stay not found' });
    }

    res.json({ success: true, data: stay });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
