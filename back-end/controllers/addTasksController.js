const Heads = require("../models/Heads");
const Subs = require("../models/Subs");
const Tasks = require("../models/Tasks");

async function insert(collection, data) {
  const dbObj = {
    tasks: Tasks,
    subs: Subs,
    heads: Heads,
  };
  const compareObj = { name: data.name, userId: data.userId };

  if (collection !== "heads") compareObj["headId"] = data.headId;

  if (collection === "tasks") compareObj["subId"] = data.subId;

  const isFound = await dbObj[collection].findOne(compareObj);

  if (isFound) {
    const task = await dbObj[collection].updateOne({ _id: isFound._id }, data);
    return task;
  } else {
    const newTask = await dbObj[collection].create(data);
    return newTask;
  }
}
async function add(data, type, user) {
  if (Array.isArray(data)) {
    const newTasks = await Promise.all(
      data.map(async (element) => {
        element["userId"] = user;
        return await insert(type, element);
      })
    );
    return newTasks;
  } else {
    const newTask = await insert(type, data); // Add a post
    return newTask;
  }
}

const addAll = async (req, res) => {
  try {
    const heads = await add(
      req.body.heads.map(({ id, ...rest }) => rest),
      "heads",
      req.userId
    );

    const subs = await add(
      req.body.subs.map(({ id, ...rest }) => ({
        ...rest,
        headId:
          heads[
            req.body.heads.findIndex((h) => h.id === rest.headId)
          ]._id.toString(),
      })),
      "subs",
      req.userId
    );

    await add(
      req.body.tasks.map(({ id, ...rest }) => ({
        ...rest,
        headId:
          heads[
            req.body.heads.findIndex((h) => h.id === rest.headId)
          ]._id.toString(),
        subId:
          subs[
            req.body.subs.findIndex((s) => s.id === rest.subId)
          ]._id.toString(),
      })),
      "tasks",
      req.userId
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding all:", error);
    res.status(500).send("Internal Server Error");
  }
};

const addHeads = async (req, res) => {
  try {
    await add(req.body, "heads", req.userId);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding heads:", error);
    res.status(500).send("Internal Server Error");
  }
};

const addSubs = async (req, res) => {
  try {
    await add(req.body, "subs", req.userId);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding subs:", error);
    res.status(500).send("Internal Server Error");
  }
};

const addTasks = async (req, res) => {
  try {
    await add(req.body, "tasks", req.userId);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding tasks:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  insert,
  add,
  addAll,
  addHeads,
  addSubs,
  addTasks,
};
