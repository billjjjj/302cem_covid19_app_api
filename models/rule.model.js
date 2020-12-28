const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema(
  {
    createdDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { collection: 'rules' }
);

RuleSchema.pre('save', (next) => {
  this.createdDate = Date.now();
  next();
});

module.exports = mongoose.model('Rule', RuleSchema);
