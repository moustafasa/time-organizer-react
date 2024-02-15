const { calcTasks, calcSubs, calcHeads } = require("./commonFunctions");
const _ = require("lodash");

const setRunningTasks = (db) => (req, res) => {
  const data = req.body;
  const task = db.get("data").get("tasks").find({ id: data.taskId }).value();
  let obj = {};
  if (task) {
    obj.id = data.taskId + data.day;
    obj.taskId = data.taskId;
    obj.day = data.day;
    obj.headName = db
      .get("data")
      .get("heads")
      .find({ id: data.headId })
      .value()?.name;
    obj.subName = db
      .get("data")
      .get("subs")
      .find({ id: data.subId })
      .value()?.name;
    obj.done = false;
  }
  if (
    _.isEmpty(
      db
        .get("data")
        .get("runningTasks")
        .find({
          id: data.taskId + data.day,
        })
        .value()
    )
  ) {
    db.get("data")
      .get("runningTasks")
      .insert({ ...task, ...obj })
      .write();
    res.sendStatus(200);
  } else {
    console.log("done");
  }
};

const getRunningTasksByDay = (db) => (req, res) => {
  let tasks;
  if (req.params.day === "all") {
    tasks = db.get("data").get("runningTasks").value();
  } else {
    tasks = db
      .get("data")
      .get("runningTasks")
      .filter({ day: req.params.day })
      .value();
  }
  res.send(tasks);
};

const deleteRunningTasks = (db) => (req, res) => {
  const task = db
    .get("data")
    .get("runningTasks")
    .find({ id: req.params.id })
    .value();
  if (task) {
    db.get("data").get("runningTasks").remove({ id: req.params.id }).write();
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

// delete multi
const deleteMultiRunTasks = (db) => (req, res) => {
  const ids = req.body;
  const tasks = db
    .get("data")
    .get("runningTasks")
    .filter((task) => ids.includes(task.id))
    .value();

  if (tasks.length > 0) {
    ids.forEach((id) => {
      db.get("data").get("runningTasks").remove({ id }).write();
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

const doRunTask = (db) => (req, res) => {
  const { id } = req.params;
  const { subTasksDone } = req.body;

  const taskRun = db.get("data").get("runningTasks").find({ id }).value();
  const task = db.get("data").get("tasks").find({ id: taskRun.taskId }).value();
  if (task.subTasksNum - task.subTasksDone >= subTasksDone) {
    task.subTasksDone += subTasksDone;
    const sub = db.get("data").get("subs").find({ id: task.subId }).value();
    const head = db.get("data").get("heads").find({ id: task.headId }).value();

    calcTasks(task);
    calcSubs(db, sub);
    calcHeads(db, head);

    db.get("data")
      .get("tasks")
      .find({ id: taskRun.taskId })
      .assign(task)
      .write();
    db.get("data").get("subs").find({ id: task.subId }).assign(sub).write();
    db.get("data").get("heads").find({ id: task.headId }).assign(head).write();

    db.get("data")
      .get("runningTasks")
      .find({ id })
      .assign({ done: true, ...task })
      .write();

    res.sendStatus(200);
  } else {
    res
      .status(422)
      .send("the number of done subTasks is more than the number of subTasks");
  }
};

module.exports = {
  setRunningTasks,
  getRunningTasksByDay,
  deleteRunningTasks,
  deleteMultiRunTasks,
  doRunTask,
};
