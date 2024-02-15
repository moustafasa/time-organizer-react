const { calcHeads, calcSubs, calcTasks } = require("./commonFunctions");
const _ = require("lodash");

/**
 * Checks whether the id of the new data already exists in the DB
 * @param {*} db - DB object
 * @param {String} collection - Name of the array / collection in the DB / JSON file
 * @param {*} data - New record
 */
function insert(db, collection, data) {
  const calc = {
    tasks: () => calcTasks(data),
    subs: () => calcSubs(db, data),
    heads: () => calcHeads(db, data),
  };
  calc[collection]();
  const table = db.get("data").get(collection);

  if (_.isEmpty(table.find({ name: data.name }).value())) {
    table.push(data).write();
  } else {
  }
}
function add(data, type, db, user) {
  if (Array.isArray(data)) {
    data.forEach((element) => {
      element["userId"] = user;
      insert(db, type, element); // Add a post
    });
  } else {
    insert(db, type, data); // Add a post
  }
}

const addAll = (db) => (req, res) => {
  add(req.body.tasks, "tasks", db, req.userId);
  add(req.body.subs, "subs", db, req.userId);
  add(req.body.heads, "heads", db, req.userId);
  res.sendStatus(200);
};

const addHeads = (db) => (req, res) => {
  add(req.body, "heads", db, req.userId);
  res.sendStatus(200);
};

const addSubs = (db) => (req, res) => {
  add(req.body, "subs", db, req.userId);
  res.sendStatus(200);
};

const addTasks = (db) => (req, res) => {
  add(req.body, "tasks", db, req.userId);
  res.sendStatus(200);
};

module.exports = {
  insert,
  add,
  addAll,
  addHeads,
  addSubs,
  addTasks,
};
