const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.FURI_DATABASE_BASE_URL);
    console.log({ message: "Connect database successfully!" });
  } catch (error) {
    console.log({ message: "Connect database failure!", error });
  }
}

module.exports = { connect };
