const express = require("express");
const {
  setRunningTasks,
  getRunningTasksByDay,
  deleteMultiRunTasks,
  doRunTask,
} = require("../controllers/runningTasksController");

const runinngTasksRouter = express.Router();

runinngTasksRouter.post("/runningTasks", setRunningTasks);
runinngTasksRouter.get("/runningTasks/:day", getRunningTasksByDay);
runinngTasksRouter.post("/runningTasks/deleteMulti", deleteMultiRunTasks);
runinngTasksRouter.post("/runningTasks/didTask/:id", doRunTask);

module.exports = runinngTasksRouter;
