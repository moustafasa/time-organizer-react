const mongoose = require("mongoose");

const runingTasksSchema = new mongoose.Schema({
  day: { type: Date, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  taskId: {
    type: String,
    required: true,
    ref: "Task",
  },
  done: {
    type: Boolean,
    default: false,
  },
});

module.exports =
  mongoose.models.RuningTask || mongoose.model("RuningTask", runingTasksSchema);
