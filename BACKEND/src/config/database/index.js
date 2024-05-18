const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connect() {
  try {
    await mongoose.connect(process.env.FURI_DB_LOCAL_URL);
    console.log("Connect database successfully!");
  } catch (error) {
    console.log("Connect database failure!");
  }
}

module.exports = { connect };
