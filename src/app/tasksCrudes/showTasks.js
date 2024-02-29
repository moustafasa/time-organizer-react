// heads
const getHeads = (db) => (req, res) => {
  const heads = db
    .get("data")
    .get("heads")
    .filter({ userId: req.userId })
    .value();
  res.send(heads);
};
const getHeadById = (db) => (req, res) => {
  const head = db.get("data").get("heads").find({ id: req.params.id }).value();
  if (head) {
    res.send(head);
  } else {
    res.sendStatus(404);
  }
};

// subs
const getSubs = (db) => (req, res) => {
  const headId = req.query.headId;
  console.log(req.query);
  const subs = db
    .get("data")
    .get("subs")
    .filter({ headId, userId: req.userId })
    .value();
  res.send(subs);
};

const getSubById = (db) => (req, res) => {
  const sub = db.get("data").get("subs").find({ id: req.params.id }).value();
  if (sub) {
    res.send(sub);
  } else {
    res.sendStatus(404);
  }
};

// tasks
const getTasks = (db) => (req, res) => {
  const headId = req.query.headId;
  const subId = req.query.subId;
  const tasks = db
    .get("data")
    .get("tasks")
    .filter({ headId, subId, userId: req.userId })
    .value();
  res.send(tasks);
};

module.exports = { getHeads, getHeadById, getSubs, getSubById, getTasks };
