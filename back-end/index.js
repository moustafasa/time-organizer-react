const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { hashPassword, checkAuth } = require("./controllers/authController");
const authRouter = require("./routes/authRoutes");
const addTasksRouter = require("./routes/addTasksRoutes");
const showTasksRouter = require("./routes/showTasksRoutes");
const server = express();
const PORT = process.env.PORT || 3000;

dbConnect();

server.use(express.json());
server.use(cookieParser());
server.use(cors(corsOptions));
server.use(hashPassword);

server.use(authRouter);
server.use(checkAuth);
server.use(addTasksRouter);
server.use(showTasksRouter);

server.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
