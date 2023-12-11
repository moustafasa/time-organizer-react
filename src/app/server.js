const jsonServer = require("json-server");
const server = jsonServer.create();
const _ = require("lodash");
const router = jsonServer.router("src/app/db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(
  jsonServer.rewriter({
    "data/heads": "/heads",
    "data/subs": "/subs",
    "data/tasks": "/tasks",
    "data/runningTasks": "/runningTasks",
    "data/heads/:id": "/heads/:id",
    "data/subs/:id": "/subs/:id",
    "data/tasks/:id": "/tasks/:id",
    "data/runningTasks/:page": "/runningTasks/:page",
  })
);

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

function calcSubs(db, sub) {
  const tasks = db.get("data").get("tasks").filter({ subId: sub.id }).value();
  sub.tasksNum = tasks.length;
  sub.tasksDone = tasks.filter((task) => task.progress >= 100).length;
  sub.progress = Math.floor(
    tasks.reduce((prev, curr) => prev + curr.progress, 0) / sub.tasksNum
  );
}

function calcHeads(db, head) {
  const subs = db.get("data").get("subs").filter({ headId: head.id }).value();
  head.tasksNum = subs.reduce((prev, curr) => prev + curr.tasksNum, 0);
  head.tasksDone = subs.reduce((prev, curr) => prev + curr.tasksDone, 0);
  head.subNum = subs.length;
  head.subDone = subs.filter((sub) => sub.progress >= 100).length;
  head.progress = Math.floor(
    subs.reduce((prev, curr) => prev + curr.progress, 0) / head.subNum
  );
}

function calcTasks(task) {
  task.subTasksNum = +task.subTasksNum;
  task.subTasksDone = +task.subTasksDone;
  task.progress = Math.floor((task.subTasksDone / task.subTasksNum) * 100);
}

function add(data, type, db) {
  if (Array.isArray(data)) {
    data.forEach((element) => {
      insert(db, type, element); // Add a post
    });
  } else {
    insert(db, type, data); // Add a post
  }
}

/////////////////////////////////////////////////////
//////////////////////post///////////////////////////
////////////////////////////////////////////////////

// all
server.post("/all", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  add(req.body.tasks, "tasks", db);
  add(req.body.subs, "subs", db);
  add(req.body.heads, "heads", db);
  res.sendStatus(200);
});

// heads
server.post("/heads", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  add(req.body, "heads", db);
  res.sendStatus(200);
});

// subs
server.post("/subs", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  add(req.body, "subs", db);
  res.sendStatus(200);
});

// tasks
server.post("/tasks", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  add(req.body, "tasks", db);
  res.sendStatus(200);
});

////////////////////////////////////////////////////////////////////
/////////////////////////////////get////////////////////////////////
////////////////////////////////////////////////////////////////////

// heads
server.get("/heads", (req, res) => {
  const db = router.db;
  const heads = db.get("data").get("heads").value();
  res.send(heads);
});
server.get("/heads/:id", (req, res) => {
  const db = router.db;
  const head = db.get("data").get("heads").find({ id: req.params.id }).value();
  res.send(head);
});

// subs
server.get("/subs", (req, res) => {
  const db = router.db;
  const headId = req.query.headId;
  const subs = db.get("data").get("subs").filter({ headId }).value();
  res.send(subs);
});

server.get("/subs/:id", (req, res) => {
  const db = router.db;
  const sub = db.get("data").get("subs").find({ id: req.params.id }).value();
  res.send(sub);
});

// tasks
server.get("/tasks", (req, res) => {
  const db = router.db;
  const headId = req.query.headId;
  const subId = req.query.subId;
  const tasks = db.get("data").get("tasks").filter({ headId, subId }).value();
  res.send(tasks);
});

////////////////////////////////////////////////////////////////////
/////////////////////////////////update/////////////////////////////
////////////////////////////////////////////////////////////////////

// heads
server.patch("/heads/:id", (req, res) => {
  const db = router.db; // Assign the lowdb instance
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
});

// subs
server.patch("/subs/:id", (req, res) => {
  const db = router.db;
  let sub = db.get("data").get("subs").find({ id: req.params.id }).value();
  if (sub) {
    sub = _.merge(sub, req.body);
    db.get("data").get("heads").find({ id: req.params.id }).assign(sub).write();
    res.send(req.body);
  } else {
    res.sendStatus(404);
  }
});

server.patch("/tasks/:id", (req, res) => {
  const db = router.db;
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
      subLowDb.assign(subUpdated);

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
});

////////////////////////////////////////////////////////////////////
/////////////////////////////////delete/////////////////////////////
////////////////////////////////////////////////////////////////////

function deleteHeads(db, id) {
  db.get("data").get("heads").remove({ id: id }).write();
  db.get("data").get("subs").remove({ headId: id }).write();
  db.get("data").get("tasks").remove({ headId: id }).write();
}

function deleteSubs(db, id, headId) {
  db.get("data").get("subs").remove({ id: id }).write();
  db.get("data").get("tasks").remove({ subId: id }).write();
  calcHeads(db, headId);
}

function deleteTasks(db, id, headId, subId) {
  db.get("data").get("tasks").remove({ id: id }).write();
  calcSubs(db, subId);
  calcHeads(db, headId);
}

// heads
server.delete("/heads/:id", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  let head = db.get("data").get("heads").find({ id: req.params.id }).value();

  if (head) {
    deleteHeads(db, req.params.id);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// subs
server.delete("/subs/:id", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  let sub = db.get("data").get("subs").find({ id: req.params.id }).value();
  if (sub) {
    deleteSubs(db, req.params.id, sub.headId);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// tasks
server.delete("/tasks/:id", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  let task = db.get("data").get("tasks").find({ id: req.params.id }).value();

  if (task) {
    deleteTasks(db, req.params.id, task.headId, task.subId);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

////////////////////////////////////////////////////////////////////
///////////////////////////delete multi/////////////////////////////
////////////////////////////////////////////////////////////////////

// heads
server.post("/heads/deleteMulti", (req, res) => {
  const db = router.db;
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
});

// subs
server.post("/subs/deleteMulti", (req, res) => {
  const db = router.db;
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
});

// tasks
server.post("/tasks/deleteMulti", (req, res) => {
  const db = router.db;
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
});

////////////////////////////////////////////////////////////////////
///////////////////////// running tasks ////////////////////////////
////////////////////////////////////////////////////////////////////

server.post("/runningTasks", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  const data = req.body.data;
  const task = db.get("data").get("tasks").find({ id: data.task }).value();
  let obj = {};
  if (task) {
    obj.day = data.day;
    obj.headName = db
      .get("data")
      .get("heads")
      .find({ id: data.head })
      .value()?.name;
    obj.subName = db
      .get("data")
      .get("subs")
      .find({ id: data.sub })
      .value()?.name;

    obj.id = data.task + data.day;
    obj.taskId = data.task;
  }

  if (
    _.isEmpty(
      db
        .get("data")
        .get("runningTasks")
        .find({
          id: data.task + data.day,
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
});

server.get("/runningTasks/:page", (req, res) => {
  const db = router.db;
  let tasks;
  if (req.params.page === "week") {
    tasks = db.get("data").get("runningTasks").value();
  } else if (req.params.page === "day") {
    const nowData = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );
    tasks = db
      .get("data")
      .get("runningTasks")
      .filter({ day: nowData.toDateString() })
      .value();
  }
  res.send(tasks);
});

server.use(router);
server.listen(
  port,
  setTimeout(() => {
    console.log("server is running in " + port);
  }, 1000)
);
