require('./database/mongodb.connect');
const app = require('./app');

// Server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`HK Covid-19 APP API Server is now running on port ${PORT}`);
});
