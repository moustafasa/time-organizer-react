const mongoose = require("mongoose");

const headsSchema = new mongoose.Schema({
  name: { type: String, required: false, default: "" },
  readOnly: { type: Boolean, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  tasksNum: { type: Number, default: 0 },
  tasksDone: { type: Number, default: 0 },
  subNum: { type: Number, default: 0 },
  subDone: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

module.exports = mongoose.models.Head || mongoose.model("Head", headsSchema);
