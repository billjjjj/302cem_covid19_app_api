const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    ruleName: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: 'rules' }
);

module.exports = mongoose.model('Rule', RuleSchema);
