const {
  checkOrigin,
  hashPassword,
  register,
  login,
  refresh,
  logout,
  checkAuth,
} = require("./auth/auth");
const {
  addAll,
  addHeads,
  addSubs,
  addTasks,
} = require("./tasksCrudes/addTasks");

const {
  getHeads,
  getHeadById,
  getSubs,
  getSubById,
  getTasks,
} = require("./tasksCrudes/showTasks");

const {
  updateHead,
  updateSub,
  updateTask,
} = require("./tasksCrudes/updateTasks");

const {
  deleteHead,
  deleteSub,
  deleteTask,
  deleteMultiHeads,
  deleteMultiSubs,
  deleteMultiTasks,
} = require("./tasksCrudes/deleteTasks");

const {
  setRunningTasks,
  getRunningTasksByDay,
  deleteRunningTasks,
  deleteMultiRunTasks,
  doRunTask,
} = require("./tasksCrudes/runningTasks");

const jsonServer = require("json-server");
// const WebSocket = require("ws");
const server = jsonServer.create();
const router = jsonServer.router("src/app/db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const db = router.db;

server.use(middlewares);
// A middleware to hash the password before saving a new user
server.use(jsonServer.bodyParser);
server.use(cookieParser());
server.use(
  jsonServer.rewriter({
    "data/heads": "/heads",
    "data/subs": "/subs",
    "data/tasks": "/tasks",
    "data/runningTasks": "/runningTasks",
    "data/users": "/users",
    "data/heads/:id": "/heads/:id",
    "data/subs/:id": "/subs/:id",
    "data/tasks/:id": "/tasks/:id",
    "data/runningTasks/:page": "/runningTasks/:page",
  })
);

// Use the middleware function before the router
server.use(checkOrigin);
server.use(hashPassword);

// A middleware to handle user registration
server.post("/register", register(db));

// A middleware to handle user login
server.post("/login", login(db));

// A middleware to handle token refresh
server.get("/refresh", refresh(db));

server.get("/logout", logout(db));

// Apply the checkAuth middleware to all routes
server.use(checkAuth);

// server.get("/users/:id", (req, res) => {
//   const { id } = req.params;
//   const user = db.get("data").get("users").find({ id }).value();
//   if (user) {
//     res.status(201).send(JSON.stringify(user));
//   } else {
//     res.status(404).send("user not found");
//   }
// });

/////////////////////////////////////////////////////
//////////////////////post///////////////////////////
////////////////////////////////////////////////////

// all
server.post("/all", addAll(db));

// heads
server.post("/heads", addHeads(db));

// subs
server.post("/subs", addSubs(db));

// tasks
server.post("/tasks", addTasks(db));

////////////////////////////////////////////////////////////////////
/////////////////////////////////get////////////////////////////////
////////////////////////////////////////////////////////////////////

// heads
server.get("/heads", getHeads(db));
server.get("/heads/:id", getHeadById(db));

// subs
server.get("/subs", getSubs(db));

server.get("/subs/:id", getSubById(db));

// tasks
server.get("/tasks", getTasks(db));

////////////////////////////////////////////////////////////////////
/////////////////////////////////update/////////////////////////////
////////////////////////////////////////////////////////////////////

// heads
server.patch("/heads/:id", updateHead(db));

// subs
server.patch("/subs/:id", updateSub(db));

server.patch("/tasks/:id", updateTask(db));

////////////////////////////////////////////////////////////////////
/////////////////////////////////delete/////////////////////////////
////////////////////////////////////////////////////////////////////

// heads
server.delete("/heads/:id", deleteHead(db));

// subs
server.delete("/subs/:id", deleteSub(db));

// tasks
server.delete("/tasks/:id", deleteTask(db));

////////////////////////////////////////////////////////////////////
///////////////////////////delete multi/////////////////////////////
////////////////////////////////////////////////////////////////////

// heads
server.post("/heads/deleteMulti", deleteMultiHeads(db));

// subs
server.post("/subs/deleteMulti", deleteMultiSubs(db));

// tasks
server.post("/tasks/deleteMulti", deleteMultiTasks(db));

////////////////////////////////////////////////////////////////////
///////////////////////// running tasks ////////////////////////////
////////////////////////////////////////////////////////////////////

server.post("/runningTasks", setRunningTasks(db));

server.get("/runningTasks/:day", getRunningTasksByDay(db));

server.delete("/runningTasks/:id", deleteRunningTasks(db));

// delete multi
server.post("/runningTasks/deleteMulti", deleteMultiRunTasks(db));

server.post("/runningTasks/didTask/:id", doRunTask(db));

server.use(router);
server.listen(
  port,
  setTimeout(() => {
    console.log("server is running in " + port);
  }, 1000)
);
