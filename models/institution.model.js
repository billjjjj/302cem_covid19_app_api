const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const InstitutionSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      trim: true,
      required: true,
    },
    clinic: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: 'institutions' }
);

InstitutionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Institution', InstitutionSchema);
