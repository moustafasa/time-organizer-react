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

// helper functions
const calcUpdatedProgress = (
  currentProgress,
  itemNum,
  oldProgress,
  newProgress,
  newItemNum
) => {
  if (!newItemNum) {
    newItemNum = itemNum;
  }
  const absoluteNumber = currentProgress * itemNum - oldProgress + newProgress;
  const progress = +(absoluteNumber / newItemNum).toFixed(2);
  return isNaN(progress) ? 0 : progress;
};

const calcSubDone = (sub, head, oldSubProgress) => {
  if (sub.progress !== oldSubProgress) {
    if (sub.progress >= 100) {
      head.subDone += 1;
    } else if (oldSubProgress >= 100) {
      head.subDone -= 1;
    }
  }
};

// Virtual property for progress
tasksSchema.virtual("progress").get(function () {
  return this.subTasksNum
    ? +((this.subTasksDone / this.subTasksNum) * 100).toFixed(2)
    : 0;
});

// Delete middleware
tasksSchema.pre("deleteMany", async function (next) {
  try {
    this._deletedTasks = await this.model.find(this.getQuery());
    next();
  } catch (error) {
    next(error);
  }
});

tasksSchema.post("deleteMany", async function (_, next) {
  try {
    if (!this._deletedTasks?.length) return next();

    if (this._deletedTasks[0].name === "") return next();

    for (const deletedTask of this._deletedTasks) {
      const sub = await Subs.findById(deletedTask.subId).populate("headId");
      if (!sub) continue;

      const head = sub.headId;

      // Update counts
      sub.tasksNum -= 1;
      head.tasksNum -= 1;

      if (deletedTask.progress >= 100) {
        sub.tasksDone -= 1;
        head.tasksDone -= 1;
      }

      // update sub progress
      const oldSubProgress = sub.progress;
      sub.progress = calcUpdatedProgress(
        sub.progress,
        sub.tasksNum + 1,
        deletedTask.progress,
        0,
        sub.tasksNum
      );

      calcSubDone(sub, head, oldSubProgress);

      // update head progress
      head.progress = calcUpdatedProgress(
        head.progress,
        head.subNum,
        oldSubProgress,
        sub.progress
      );

      await sub.save();
      await head.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Update middleware
tasksSchema.pre("updateOne", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    this.updatedTask = docToUpdate;
    this._wasNew = docToUpdate && docToUpdate.name === "";
    this._previousProgress = docToUpdate?.progress || 0;
    next();
  } catch (error) {
    next(error);
  }
});

tasksSchema.post("updateOne", async function (_, next) {
  try {
    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return next();

    const sub = await Subs.findById(doc.subId).populate("headId");
    if (!sub) return next();

    const head = sub.headId;

    if (this._wasNew) {
      sub.tasksNum += 1;
      head.tasksNum += 1;
    }

    if (doc.progress !== this._previousProgress) {
      // calc tasks done
      if (doc.progress >= 100) {
        head.tasksDone += 1;
        sub.tasksDone += 1;
      }
      if (this._previousProgress >= 100 && doc.progress < 100) {
        head.tasksDone -= 1;
        sub.tasksDone -= 1;
      }

      // calc sub progress
      const oldSubProgress = sub.progress;
      const subProgNum = this._wasNew ? sub.tasksNum - 1 : sub.tasksNum;
      sub.progress = calcUpdatedProgress(
        sub.progress,
        subProgNum,
        this._previousProgress,
        doc.progress,
        sub.tasksNum
      );

      // calc subDone
      calcSubDone(sub, head, oldSubProgress);

      // calc head progress
      const headProgNum = oldSubProgress === 0 ? head.subNum - 1 : head.subNum;
      head.progress = calcUpdatedProgress(
        head.progress,
        headProgNum,
        oldSubProgress,
        sub.progress,
        head.subNum
      );
    }

    await head.save();
    await sub.save();

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.models.Task || mongoose.model("Task", tasksSchema);
