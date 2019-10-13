const mongoose = require("mongoose");

const mapSchema = mongoose.Schema({
  serverID: String,
  mapName: String,
  mapLink: String
})

module.exports = mongoose.model("Map", mapSchema);
