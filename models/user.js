const mongoose = require('mongoose');
const val = require('validator');
const { urlRegex } = require('../utils/consts');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => val.isEmail(v),
      message: (props) => `${props.value} не email!`,
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => urlRegex.test(v),
      message: (props) => `${props.value} is not a URL`,
    },
  },
}, { versionKey: false });

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
};

module.exports = mongoose.model('user', userSchema);
