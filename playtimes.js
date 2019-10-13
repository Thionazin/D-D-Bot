const mongoose = require("mongoose");

const playSchema = mongoose.Schema({
  serverID: String,
  userID: String,
  character: String,
  time: Number,
  startTime: Number,
  endTime: Number,
  logging: Boolean,
})

module.exports = mongoose.model("Playtime", playSchema);
