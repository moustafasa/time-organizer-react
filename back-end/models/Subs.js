const mongoose = require("mongoose");
const Heads = require("./Heads");

const subsSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  readOnly: { type: Boolean, default: false },
  headId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Head",
  },
  tasksNum: { type: Number, default: 0 },
  tasksDone: { type: Number, default: 0 },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  progress: { type: Number, default: 0 },
});

// Add this before the post-save middleware
subsSchema.pre("save", async function (next) {
  // Store the isNew status before save
  this._wasNew = this.isNew;
  this._previousProgress = this.progress;
  next();
});
subsSchema.post("save", async function (doc, next) {
  const head = await Heads.findById(doc.headId);

  if (doc._wasNew) {
    head.subNum += 1;
  }
  if (doc.progress >= 100 && doc._previousProgress < 100) {
    head.subDone += 1;
  }

  await head.save();

  return next();
});

module.exports = mongoose.model("Sub", subsSchema);
