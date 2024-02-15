const { calcTasks, calcSubs, calcHeads } = require("./commonFunctions");
const _ = require("lodash");

// heads
const updateHead = (db) => (req, res) => {
  let head = db.get("data").get("heads").find({ id: req.params.id }).value();

  if (head) {
    head = _.merge(head, req.body);
    db.get("data")
      .get("heads")
      .find({ id: req.params.id })
      .assign(head)
      .write();
    res.send(req.body);
  } else {
    res.sendStatus(404);
  }
};

// subs
const updateSub = (db) => (req, res) => {
  let sub = db.get("data").get("subs").find({ id: req.params.id }).value();
  if (sub) {
    sub = _.merge(sub, req.body);
    db.get("data").get("heads").find({ id: req.params.id }).assign(sub).write();
    res.send(req.body);
  } else {
    res.sendStatus(404);
  }
};

const updateTask = (db) => (req, res) => {
  let task = db.get("data").get("tasks").find({ id: req.params.id }).value();
  if (task) {
    task = _.merge(task, req.body);
    if (req.body.subTasksNum || req.body.subTasksDone) {
      calcTasks(task);
    }

    db.get("data")
      .get("heads")
      .find({ id: req.params.id })
      .assign(task)
      .write();

    if (req.body.subTasksNum || req.body.subTasksDone) {
      // calc subs
      const subLowDb = db.get("data").get("subs").find({ id: task.subId });
      const subUpdated = subLowDb.value();
      calcSubs(db, subUpdated);
      subLowDb.assign(subUpdated).write();

      // calc heads
      const headLowDb = db.get("data").get("heads").find({ id: task.headId });
      const headUpdated = headLowDb.value();
      calcHeads(db, headUpdated);
      headLowDb.assign(headUpdated).write();
    }

    res.send({ ...req.body, progress: task.progress });
  } else {
    res.sendStatus(404);
  }
};

module.exports = { updateHead, updateSub, updateTask };
