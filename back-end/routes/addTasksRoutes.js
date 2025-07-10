const express = require("express");
const {
  addHeads,
  addTasks,
  addSubs,
  addAll,
} = require("../controllers/addTasksController");

const addTasksRouter = express.Router();

addTasksRouter.post("/tasks", addTasks);
addTasksRouter.post("/subs", addSubs);
addTasksRouter.post("/heads", addHeads);
addTasksRouter.post("/all", addAll);

module.exports = addTasksRouter;
