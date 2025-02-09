const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
  body: Object,
  query: Object,
})

const StatusModel = mongoose.model("status", statusSchema)

module.exports = StatusModel;