const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const formData = require("express-form-data");

const app = express();

const authRouter = require("./auth/auth-router");
const client_growr_connectionRouter = require("./router/client_growr_connection");
const userRouter = require("./router/user");
const messageRouter = require("./router/message");
const blogsRouter = require("./router/blogs");

const reviewsRouter = require("./router/reviews");

const portfolioRouter = require("./router/portfolio");

const restricted = require("./auth/restricted-middleware");

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(formData.parse());

app.use("/auth", authRouter);
app.use("/client-growr-connection", client_growr_connectionRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/blog-posts", blogsRouter);

app.use("/reviews", reviewsRouter);

app.use("/portfolio-posts", portfolioRouter);

app.get("/", (req, res) => {
  res.status(200).json({ Victor_Frankenstein: "Its ALIVE" });
});

module.exports = app;
