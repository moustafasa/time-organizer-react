const Heads = require("../models/Heads");
const Subs = require("../models/Subs");
const Tasks = require("../models/Tasks");

async function insert(collection, data) {
  const dbObj = {
    tasks: Tasks,
    subs: Subs,
    heads: Heads,
  };
  const newObj = { userId: data.userId };

  if (collection !== "heads") newObj["headId"] = data.headId;

  if (collection === "tasks") newObj["subId"] = data.subId;

  const newTask = await dbObj[collection].create(data);

  return newTask.toJSON();
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
    const newTask = await insert(type, { ...data, userId: user }); // Add a post
    return newTask;
  }
}

const addAll = async (req, res) => {
  try {
    req.body.heads.map(async (head) => {
      await Heads.updateOne({ _id: head.id }, head);
    });

    req.body.subs.map(async (sub) => {
      await Subs.updateOne({ _id: sub.id }, sub);
    });

    req.body.tasks.map(async (task) => {
      await Tasks.updateOne({ _id: task.id }, task);
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding all:", error);
    res.status(500).send("Internal Server Error");
  }
};

const addHeads = async (req, res) => {
  try {
    const newHead = await add(req.body, "heads", req.userId);
    res.send(newHead);
  } catch (error) {
    console.error("Error adding heads:", error);
    res.status(500).send("Internal Server Error");
  }
};

const addSubs = async (req, res) => {
  try {
    const newSub = await add(req.body, "subs", req.userId);
    res.send(newSub);
  } catch (error) {
    console.error("Error adding subs:", error);
    res.status(500).send("Internal Server Error");
  }
};

const addTasks = async (req, res) => {
  try {
    const newTask = await add(req.body, "tasks", req.userId);
    res.send(newTask);
  } catch (error) {
    console.error("Error adding tasks:", error);
    res.status(500).send("Internal Server Error");
  }
};

const clearDraft = async () => {
  try {
    await Heads.deleteMany({ name: "" });
    await Subs.deleteMany({ name: "" });
    await Tasks.deleteMany({ name: "" });
  } catch (error) {
    console.error("Error clearing draft:", error);
  }
};

module.exports = {
  insert,
  add,
  addAll,
  addHeads,
  addSubs,
  addTasks,
  clearDraft,
};
