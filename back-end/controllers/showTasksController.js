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
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};
const deleteHeads = async (req, res) => {
  const ids = req.body;
  try {
    await Tasks.deleteMany({
      headId: { $in: ids },
    });
    await Subs.deleteMany({
      headId: { $in: ids },
    });
    await Heads.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
};

// heads
const updateHead = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the head by ID and ensure it belongs to the current user
    const head = await Heads.findOne({ _id: id, userId: req.userId });

    if (!head) {
      return res.status(404).json({ message: "Head not found" });
    }

    // Update the head with the new data
    const updatedHead = await Heads.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Convert to JSON and format the response
    const response = updatedHead.toObject({ flattenObjectIds: true });
    const { _id, ...rest } = response;

    res.json({ id: _id, ...rest });
  } catch (err) {
    console.error("Error updating head:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// subs
const updateSub = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the sub by ID and ensure it belongs to the current user
    const sub = await Subs.findOne({ _id: id, userId: req.userId });

    if (!sub) {
      return res.status(404).json({ message: "Sub not found" });
    }

    // Update the sub with the new data
    const updatedSub = await Subs.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Convert to JSON and format the response
    const response = updatedSub.toObject({ flattenObjectIds: true });
    const { _id, ...rest } = response;

    res.json({ id: _id, ...rest });
  } catch (err) {
    console.error("Error updating sub:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the task by ID and ensure it belongs to the current user
    const task = await Tasks.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task with the new data
    const updatedTask = await Tasks.updateOne({ _id: id }, updateData);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Internal server error" });
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
  updateHead,
  updateSub,
  updateTask,
};
