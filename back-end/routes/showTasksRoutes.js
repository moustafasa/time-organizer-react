const express = require("express");
const {
  getHeads,
  getHeadById,
  getSubs,
  getSubById,
  getTasks,
  deleteTasks,
  deleteSubs,
  deleteHeads,
} = require("../controllers/showTasksController");
const server = express();
const showTasksRouter = server.router;

showTasksRouter.get("/heads", getHeads);
showTasksRouter.get("/heads/:id", getHeadById);
showTasksRouter.get("/subs", getSubs);
showTasksRouter.get("/subs/:id", getSubById);
showTasksRouter.get("/tasks", getTasks);

showTasksRouter.post("/tasks/deleteMulti", deleteTasks);
showTasksRouter.post("/subs/deleteMulti", deleteSubs);
showTasksRouter.post("/heads/deleteMulti", deleteHeads);

module.exports = showTasksRouter;
