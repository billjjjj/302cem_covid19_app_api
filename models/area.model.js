const mongoose = require('mongoose');

const HighRiskAreaSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      trim: true,
      required: true,
    },
    buildingName: {
      type: String,
      trim: true,
      required: true,
    },
    caseNo: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: 'areas' }
);

HighRiskAreaSchema.pre('save', (next) => {
  this.createdDate = Date.now();
  next();
});

module.exports = mongoose.model('Area', HighRiskAreaSchema);
