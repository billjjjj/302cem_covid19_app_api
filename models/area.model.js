const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema(
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
      type: Number,
      trim: true,
      required: true,
    },
    lastDate: {
      type: Date,
      trim: true,
      required: true,
    },
  },
  { collection: 'areas' }
);

AreaSchema.pre('save', (next) => {
  this.createdDate = Date.now();
  next();
});

module.exports = mongoose.model('Area', AreaSchema);
