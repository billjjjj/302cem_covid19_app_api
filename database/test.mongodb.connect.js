const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(
  'mongodb+srv://admin:admin123@cluster0.iyhto.mongodb.net/hk_covid_19_app_test?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);

module.exports = mongoose;
