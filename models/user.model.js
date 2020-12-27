const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    createdDate: {
      type: Date,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Number,
      trim: true,
      required: true,
      default: 1,
    },
  },
  { collection: 'users' }
);

UserSchema.pre('save', (next) => {
  this.createdDate = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);
