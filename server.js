const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

const questions = [
  {
    question: "Capital of India?",
    options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    answer: 1
  },
  {
    question: "2 + 2 = ?",
    options: ["3", "4", "5", "6"],
    answer: 1
  }
];

function createRoom() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

io.on("connection", (socket) => {

  socket.on("createRoom", () => {
    const roomCode = createRoom();
    rooms[roomCode] = {
      players: {},
      questionIndex: 0,
      answers: {}
    };

    socket.join(roomCode);
    socket.emit("roomCreated", roomCode);
  });

  socket.on("joinRoom", ({ roomCode, name }) => {
    if (!rooms[roomCode]) return;

    rooms[roomCode].players[socket.id] = {
      name,
      score: 0
    };

    socket.join(roomCode);
    io.to(roomCode).emit("playerList", rooms[roomCode].players);
  });

  socket.on("startGame", (roomCode) => {
    sendQuestion(roomCode);
  });

  socket.on("answer", ({ roomCode, answer }) => {
    if (!rooms[roomCode]) return;
    rooms[roomCode].answers[socket.id] = answer;
  });

  socket.on("disconnect", () => {
    for (let roomCode in rooms) {
      delete rooms[roomCode].players[socket.id];
    }
  });
});

function sendQuestion(roomCode) {
  const room = rooms[roomCode];
  const q = questions[room.questionIndex];

  room.answers = {};

  io.to(roomCode).emit("question", q);

  setTimeout(() => {
    calculateScores(roomCode);
  }, 10000);
}

function calculateScores(roomCode) {
  const room = rooms[roomCode];
  const correct = questions[room.questionIndex].answer;

  for (let id in room.answers) {
    if (room.answers[id] == correct) {
      room.players[id].score += 10;
    }
  }

  io.to(roomCode).emit("leaderboard", room.players);

  room.questionIndex++;

  if (room.questionIndex < questions.length) {
    setTimeout(() => sendQuestion(roomCode), 3000);
  } else {
    io.to(roomCode).emit("gameOver", room.players);
  }
}

server.listen(3000, () => console.log("Server running on port 3000"));