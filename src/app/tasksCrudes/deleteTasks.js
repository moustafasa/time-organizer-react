////////////////////////////////////////////////////////////////////
/////////////////////////////////delete/////////////////////////////
////////////////////////////////////////////////////////////////////

const { calcSubs, calcHeads } = require("./commonFunctions");

function deleteHeads(db, id) {
  db.get("data").get("heads").remove({ id: id }).write();
  db.get("data").get("subs").remove({ headId: id }).write();
  db.get("data").get("tasks").remove({ headId: id }).write();
}

function deleteSubs(db, id, headId) {
  // remove sub and tasks
  db.get("data").get("subs").remove({ id: id }).write();
  db.get("data").get("tasks").remove({ subId: id }).write();

  // calc after delete
  const head = db.get("data").get("heads").find({ id: headId });
  const headUpdated = head.value();
  calcHeads(db, headUpdated);
  head.assign(headUpdated).write();
}

function deleteTasks(db, id, headId, subId) {
  // remove task
  db.get("data").get("tasks").remove({ id: id }).write();

  // calc after delete
  const sub = db.get("data").get("subs").find({ id: subId });
  const head = db.get("data").get("heads").find({ id: headId });
  const subUpdated = sub.value();
  const headUpdated = head.value();

  calcSubs(db, subUpdated);
  calcHeads(db, headUpdated);
  sub.assign(subUpdated).write();
  head.assign(headUpdated).write();
}

// heads
const deleteHead = (db) => (req, res) => {
  let head = db.get("data").get("heads").find({ id: req.params.id }).value();

  if (head) {
    deleteHeads(db, req.params.id);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

// subs
const deleteSub = (db) => (req, res) => {
  let sub = db.get("data").get("subs").find({ id: req.params.id }).value();
  if (sub) {
    deleteSubs(db, req.params.id, sub.headId);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

// tasks
const deleteTask = (db) => (req, res) => {
  let task = db.get("data").get("tasks").find({ id: req.params.id }).value();

  if (task) {
    deleteTasks(db, req.params.id, task.headId, task.subId);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

////////////////////////////////////////////////////////////////////
///////////////////////////delete multi/////////////////////////////
////////////////////////////////////////////////////////////////////

// heads
const deleteMultiHeads = (db) => (req, res) => {
  let ids = req.body;
  const heads = db
    .get("data")
    .get("heads")
    .filter((head) => ids.includes(head.id))
    .value();
  if (heads.length > 0) {
    ids.forEach((id) => {
      deleteHeads(db, id);
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

// subs
const deleteMultiSubs = (db) => (req, res) => {
  let ids = req.body;
  const subs = db
    .get("data")
    .get("subs")
    .filter((sub) => ids.includes(sub.id))
    .value();
  if (subs.length > 0) {
    subs.forEach((sub) => {
      deleteSubs(db, sub.id, sub.headId);
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

// tasks
const deleteMultiTasks = (db) => (req, res) => {
  let ids = req.body;
  const tasks = db
    .get("data")
    .get("tasks")
    .filter((task) => ids.includes(task.id))
    .value();
  if (tasks.length > 0) {
    tasks.forEach((task) => {
      deleteTasks(db, task.id, task.headId, task.subId);
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

module.exports = {
  deleteHead,
  deleteSub,
  deleteTask,
  deleteMultiHeads,
  deleteMultiSubs,
  deleteMultiTasks,
};
