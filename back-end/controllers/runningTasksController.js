const RuningTasks = require("../models/RuningTasks");
const Tasks = require("../models/Tasks");

const setRunningTasks = async (req, res) => {
  const data = req.body;
  const foundRuningTask = await RuningTasks.findOne({
    taskId: data.taskId,
    day: data.day,
  });

  try {
    if (!foundRuningTask) {
      await RuningTasks.create({
        day: data.day,
        taskId: data.taskId,
        userId: req.userId,
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

const refinedRunTasks = (task) => {
  const {
    _id,
    taskId: { _id: taskId, headId, subId, ...taskRest },
    ...rest
  } = task.toObject();
  return {
    taskId,
    headName: headId?.name,
    subName: subId?.name,
    ...taskRest,
    ...rest,
    id: _id,
  };
};

const getRunningTasksByDay = async (req, res) => {
  let unRefinedTasks;
  if (req.params.day === "all") {
    unRefinedTasks = await RuningTasks.find({
      userId: req.userId,
    }).populate({
      path: "taskId",
      populate: [
        { path: "headId", select: "name" },
        { path: "subId", select: "name" },
      ],
    });
  } else {
    unRefinedTasks = await RuningTasks.find({
      userId: req.userId,
      day: req.params.day,
    }).populate({
      path: "taskId",
      populate: [
        { path: "headId", select: "name" },
        { path: "subId", select: "name" },
      ],
    });
  }
  const tasks = unRefinedTasks.map(refinedRunTasks);
  res.send(tasks);
};

// delete multi
const deleteMultiRunTasks = async (req, res) => {
  const ids = req.body;
  try {
    await RuningTasks.deleteMany({ _id: { $in: ids } });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(404);
  }
};

const doRunTask = async (req, res) => {
  const { id } = req.params;
  const { subTasksDone } = req.body;

  const runTask = await RuningTasks.findById(id).populate("taskId");
  const task = runTask.taskId;
  if (task.subTasksNum - task.subTasksDone >= subTasksDone) {
    runTask.done = true;
    await runTask.save();
    await Tasks.updateOne(
      { _id: task._id },
      { $inc: { subTasksDone: subTasksDone } }
    );
    res.sendStatus(200);
  } else {
    res
      .status(422)
      .send("the number of done subTasks is more than the number of subTasks");
  }
};

const deleteRunTasksBeforeThisSaturday = async () => {
  try {
    // Get current date and set to start of today
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Find this week's Saturday (day 6)
    // If today is Saturday (6), this Saturday is today
    // Otherwise, add (6 - dayOfWeek) days to today
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    const thisSaturday = new Date(now);
    thisSaturday.setDate(now.getDate() + daysUntilSaturday);
    thisSaturday.setHours(0, 0, 0, 0);

    // Delete all RuningTasks with day < thisSaturday
    await RuningTasks.deleteMany({
      day: { $lt: thisSaturday },
    });
  } catch (err) {
    console.log("delete error");
  }
};

module.exports = {
  setRunningTasks,
  getRunningTasksByDay,
  deleteMultiRunTasks,
  doRunTask,
  deleteRunTasksBeforeThisSaturday,
};
