const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema(
  {
    createdDate: {
      type: Date,
    },
    editedDate: {
      type: Date,
      trim: true,
      required: false,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { collection: 'cases' }
);

CaseSchema.pre('save', (next) => {
  this.createdDate = Date.now();
  next();
});

module.exports = mongoose.model('Case', CaseSchema);
