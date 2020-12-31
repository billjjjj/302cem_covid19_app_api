const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CaseSchema = new mongoose.Schema(
  {
    caseNo: {
      type: Number,
      trim: true,
      required: true,
      unique: true,
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

CaseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Case', CaseSchema);
