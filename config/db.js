const mongoose = require('mongoose');
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('connect to DataBase MongoDB');
  } catch (error) {
    console.log('connect to DataBase MongoDB', error);
  }
}
module.exports = connectToDB;
