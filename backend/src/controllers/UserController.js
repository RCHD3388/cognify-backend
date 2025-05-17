const { db } = require('../models/index');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { firebaseId, email, role } = req.body;

    const newUser = await db.User.create({
      firebaseId,
      email,
      role,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { firebaseId } = req.body;
    const users = await db.User.findOne({ where: { firebaseId } });
    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
