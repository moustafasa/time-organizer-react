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

module.exports = {
  calcHeads,
  calcSubs,
  calcTasks,
};
