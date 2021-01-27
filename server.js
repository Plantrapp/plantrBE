const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("./auth/auth-router");
const client_growr_connectionRouter = require("./router/client_growr_connection");
const userRouter = require("./router/user");
const restricted = require("./auth/restricted-middleware");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

server.use("/auth", authRouter);
server.use("/client_growr_connection", client_growr_connectionRouter);
server.use("/user", userRouter);

server.get("/", (req, res) => {
  res.status(200).json({ Victor_Frankenstein: "Its ALIVE" });
});

module.exports = server;
