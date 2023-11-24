const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("src/app/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/heads", (req, res, next) => {
  // req.body.createdAt = Date.now();

  // req.body = req.body.flat();

  next();
});

server.get("/heads", (req, res) => {
  const db = router.db; // Assign the lowdb instance
  const heads = db.get("heads").value(); // Get the heads array
  res.send(heads); // Send the heads array as response
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
