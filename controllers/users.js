const User = require('../models/user');

const updUserSettings = {
  new: true,
  runValidators: true,
};

const getUsers = async (req, res) => {
  const users = await User.find({});
  if (users.length === 0) {
    return res.status(404).send({ message: 'Пользователей нет' });
  }
  return res.status(200).send(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).send({ message: 'Пользователь не найден' });
  }
  return res.status(200).send(user);
};

const createUser = async (req, res) => {
  const user = await new User(req.body).save();

  res.status(200).send(user);
};

const updUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, updUserSettings);

  res.status(200).send(user);
};

const updAvatar = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, updUserSettings);

  res.status(200).send(user);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updUser,
  updAvatar,
};
