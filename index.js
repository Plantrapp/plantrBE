require("dotenv").config();
<<<<<<< HEAD
const URL = `https://deployed-plantr-fe-git-main-plantr.vercel.app/`;
=======
const URL = `https://deployed-plantr-fe-git-main-plantr.vercel.app`;
>>>>>>> cb5d34aff3f2de43dcee55d8601b74f776a01ba0
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
    origin: `${URL}`,
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
