const app = require("./server");
const socket = require("socket.io");
const chalk = require("chalk");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(chalk.blue(`>> [Port ${PORT}] I'm listening...`))
);

const io = socket(server, {
  cors: {
    origin: "deployed-plantr-fe-sambrown0322.vercel.app", //change Me pre deployment 🔦
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("loggedIn", ({ username, room_id }) => {
    socket.join(room_id);
  });

  socket.on("send-message", ({ recipient, message, sender }) => {
    socket.broadcast.to(recipient).emit("receive-message", { sender, message });
  });
});
