const app = require("./server");
const socket = require("socket.io");
const chalk = require("chalk");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(chalk.blue(`>> [Port ${PORT}] I'm listening...`))
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", //change Me pre deployment 🔦
    methods: ["GET", "POST"],
  },
});
const connectedUsers = {};
io.on("connection", (socket) => {
  socket.on("loggedIn", ({ username, room_id }) => {
    connectedUsers[room_id] = username;
    socket.join(room_id);
  });

  socket.on("send-message", ({ recipient, message, sender }) => {
    console.log("sender", sender);
    socket.broadcast.to(recipient).emit("receive-message", { sender, message });
  });
});
