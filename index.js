const app = require("./server");
const socket = require("socket.io");
const chalk = require("chalk");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(chalk.blue(`>> [Port ${PORT}] I'm listening...`))
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("user connected", socket.handshake.query.username);
  socket.on("message", (message) => {
    io.emit("message", {
      sender: socket.handshake.query.username,
      message: `${message}`,
    });
  });
  socket.on("disconnect", () => {
    console.log(`${socket.handshake.query.username} disconnected`);
  });
});
