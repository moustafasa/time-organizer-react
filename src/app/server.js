const jsonServer = require("json-server");
// const WebSocket = require("ws");
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

// const ws = new WebSocket.Server({ port: 8080 });

// ws.on("connection", (socket) => {
//   socket.on("message", (message) => {
//     console.log(`Received message => ${message}`);
//   });

//   socket.send("Hello! Message received.");
//   setInterval(() => {
//     socket.send("this is message");
//   }, 1000);
// });

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
});

server.get("/runningTasks/:day", (req, res) => {
  const db = router.db;
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
});

server.delete("/runningTasks/:id", (req, res) => {
  const db = router.db;
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
});

// delete multi
server.post("/runningTasks/deleteMulti", (req, res) => {
  const db = router.db;
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
});

server.post("/runningTasks/didTask/:id", (req, res) => {
  const db = router.db;
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
});

server.use(router);
server.listen(
  port,
  setTimeout(() => {
    console.log("server is running in " + port);
  }, 1000)
);
