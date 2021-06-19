require("dotenv").config();
const URL = [`https://deployed-plantr-fe-git-main-plantr.vercel.app/`];
// const URL = `http://localhost:3000`;
module.exports = URL;
const app = require("./server");
const socket = require("socket.io");
const chalk = require("chalk");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(chalk.blue(`>> [Port ${PORT}] I'm listening...`))
);

const io = socket(server, {
  cors: {
    origin: `https://deployed-plantr-fe-git-main-plantr.vercel.app`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("loggedIn", ({ room_id }) => {
    socket.join(room_id);
  });

  socket.on("send-message", ({ recipient, message, sender }) => {
    socket.broadcast.to(recipient).emit("receive-message", { sender, message });
  });
});
