const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();

const authRouter = require("./auth/auth-router");
const client_growr_connectionRouter = require("./router/client_growr_connection");
const userRouter = require("./router/user");
const restricted = require("./auth/restricted-middleware");

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/client_growr_connection", client_growr_connectionRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.sendFile("/Users/z/Documents/projects/Plantr Whole/plantrBE/index.html");
  res.status(200).json({ Victor_Frankenstein: "Its ALIVE" });
});

module.exports = app;
