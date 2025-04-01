const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  is_admin: {
    type: Number,
    default: '1'
  },
  is_verified: {
    type: Number,
    default: '1',
  },
  last_login: {
    type: Date,
  },
  account_status: {
    type: String,
    default:'inactive',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: null,
  },
  deleted_at: {
    type: Date,
  }
 
});

UserSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const lastUser = await User.findOne({}, {}, { sort: { id: -1 } });
    const lastId = lastUser ? lastUser.id : 0;
    this.id = lastId + 1;
    next();
  } catch (error) {
    next(error);
  }
}

);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
