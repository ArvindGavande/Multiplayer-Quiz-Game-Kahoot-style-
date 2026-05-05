# Multiplayer-Quiz-Game-Kahoot-style-
A real-time multiplayer quiz game built using WebSockets where players can join a room, answer questions, and compete on a live leaderboard.

Features
Create and join game rooms
Real-time question broadcasting
Live answer submission
Leaderboard updates after each round
Multiple players support

Tech Stack
Backend: Node.js, Express
Real-time: Socket.IO
Frontend: HTML, JavaScript

System Design

This project demonstrates key distributed systems concepts:

Real-time communication using WebSockets
Shared state management (game rooms)
Event-driven architecture
Horizontal scalability (extendable with Redis)

Project Structure
quiz-game/
  server.js
  /public
    index.html
    game.js

How to Run
Clone the repo:
git clone https://github.com/YOUR_USERNAME/quiz-game.git
Install dependencies:
npm install
Start server:
node server.js
Open browser:
http://localhost:3000

Future Improvements
Timer UI for questions
Speed-based scoring
Redis-based scaling
Player reconnection handling
Better UI (React)
📸 Demo

