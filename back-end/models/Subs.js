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

subsSchema.pre("updateOne", async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  this.updatedSub = docToUpdate;
  this._wasNew = docToUpdate && docToUpdate.name === "";
  this._previousProgress = docToUpdate.progress;
  next();
});

subsSchema.post("updateOne", async function (_, next) {
  try {
    const updatedSub = await this.model.findOne(this.getQuery());

    const head = await Heads.findById(updatedSub.headId);

    if (this._wasNew) {
      head.subNum += 1;
    }

    if (updatedSub.progress >= 100 && this._previousProgress < 100) {
      head.subDone += 1;
    }

    await head.save();

    next();
  } catch (error) {
    console.error("Error in Subs post updateOne middleware:", error);
    next(error);
  }
});

module.exports = mongoose.model("Sub", subsSchema);
