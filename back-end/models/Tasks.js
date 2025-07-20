const mongoose = require("mongoose");
const Subs = require("./Subs");

const tasksSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    subId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Sub" },
    headId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Head",
    },
    subTasksNum: { type: Number, default: 0 },
    subTasksDone: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property for progress
tasksSchema.virtual("progress").get(function () {
  return this.subTasksNum
    ? Math.floor((this.subTasksDone / this.subTasksNum) * 100)
    : 0;
});

// Add this before the post-save middleware
tasksSchema.pre("save", async function (next) {
  // Store the isNew status before save
  this._wasNew = this.isNew;
  if (this.isNew) this._previousProgress = 0;
  else this._previousProgress = this.progress;
  next();
});
tasksSchema.post("save", async function (doc, next) {
  const sub = await Subs.findById(doc.subId).populate("headId");

  if (doc._wasNew) {
    sub.tasksNum += 1;
    sub.headId.tasksNum += 1;
  }
  if (doc.get("progress") >= 100 && doc._previousProgress < 100) {
    sub.tasksDone += 1;
    sub.headId.tasksDone += 1;
  }

  if (doc.get("progress") !== doc._previousProgress) {
    sub.progress =
      (sub.progress * (sub.tasksNum - 1) + doc.get("progress")) / sub.tasksNum;
    sub.headId.progress =
      (sub.headId.progress * (sub.tasksNum - 1) + doc.get("progress")) /
      sub.headId.tasksNum;
  }

  await sub.headId.save();
  await sub.save();

  return next();
});

module.exports = mongoose.models.Task || mongoose.model("Task", tasksSchema);
