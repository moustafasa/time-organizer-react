const Heads = require("../models/Heads");
const Subs = require("../models/Subs");
const Tasks = require("../models/Tasks");

// heads
const getHeads = async (req, res) => {
  try {
    const heads = await Heads.find({ userId: req.userId, name: { $ne: "" } });
    res.send(
      heads
        .map((head) => head.toObject({ flattenObjectIds: true }))
        .map(({ _id, ...rest }) => ({ id: _id, ...rest }))
    );
  } catch (err) {
    res.sendStatus(404);
  }
};
const getHeadById = async (req, res) => {
  const head = await Heads.findById(req.params.id);
  if (head) {
    res.send(head.toJSON());
  } else {
    res.sendStatus(404);
  }
};

// // subs
const getSubs = async (req, res) => {
  try {
    const headId = req.query.headId;
    const subs = await Subs.find({
      headId,
      userId: req.userId,
      name: { $ne: "" },
    });
    res.send(
      subs
        .map((sub) => sub.toObject({ flattenObjectIds: true }))
        .map(({ _id, ...rest }) => ({ id: _id, ...rest }))
    );
  } catch (err) {
    res.sendStatus(404);
  }
};

const getSubById = async (req, res) => {
  const sub = await Subs.findById(req.params.id);
  if (sub) {
    res.send(sub.toJSON());
  } else {
    res.sendStatus(404);
  }
};

// tasks
const getTasks = async (req, res) => {
  const headId = req.query.headId;
  const subId = req.query.subId;
  try {
    const tasks = await Tasks.find({
      headId,
      subId,
      userId: req.userId,
      name: { $ne: "" },
    });
    res.send(
      tasks
        .map((task) => task.toObject({ flattenObjectIds: true }))
        .map(({ _id, ...rest }) => ({ ...rest, id: _id }))
    );
  } catch (err) {
    res.sendStatus(404);
  }
};

const deleteTasks = async (req, res) => {
  const ids = req.body;
  try {
    await Tasks.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};
const deleteSubs = async (req, res) => {
  const ids = req.body;
  try {
    const test = await Tasks.deleteMany({
      subId: { $in: ids },
    });
    const subTest = await Subs.deleteMany({
      _id: { $in: ids },
    });
    console.log(test, subTest);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};
const deleteHeads = async (req, res) => {
  const ids = req.body;
  try {
    const test = await Tasks.deleteMany({
      headId: { $in: ids },
    });
    const subTest = await Subs.deleteMany({
      headId: { $in: ids },
    });
    const headTest = await Heads.deleteMany({
      _id: { $in: ids },
    });
    console.log(test, subTest, headTest);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = {
  getHeads,
  getHeadById,
  getSubs,
  getSubById,
  getTasks,
  deleteTasks,
  deleteSubs,
  deleteHeads,
};
