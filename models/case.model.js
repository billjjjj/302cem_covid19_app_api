const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema(
  {
    createdDate: {
      type: Date,
    },
    caseNo: {
      type: String,
      trim: true,
      required: true,
    },
    reportDate: {
      type: Date,
      trim: true,
      required: true,
    },
    dateOfOnset: {
      type: Date,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    age: {
      type: Number,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      required: true,
    },
    resident: {
      type: String,
      trim: true,
      required: true,
    },
    classification: {
      type: String,
      trim: true,
      required: true,
    },
    confirmed: {
      type: Boolean,
      required: true,
    },
  },
  { collection: 'cases' }
);

CaseSchema.pre('save', (next) => {
  this.createdDate = Date.now();
  next();
});

module.exports = mongoose.model('Case', CaseSchema);
