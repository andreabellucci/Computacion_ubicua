const express = require('express');
const { SocketAddress } = require('net');
const app = express();
const server = require("http").Server(app);
const axios = require('axios');
const { getEventListeners } = require('events');

// Connected user data
let user_list = [];

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", function (socket) {

  socket.on('register_user', function (username) {
    // Make a new user for each one connected
    let new_user = { id: socket.id, username: username }
    user_list = [...user_list, new_user]

    console.log("NEW REGISTER --> ID: [" + new_user.id + "], USERNAME: [" + new_user.username + "]");

    io.emit("update_connected_users_list", user_list);
    console.log(user_list);
  });

  // Handle disconnect
  socket.on('disconnect', function () {
    console.log('User: [' + socket.id + "] has been disconnected");

    const isUser = (user) => user.id == socket.id;

    let rmUsrIndex = user_list.findIndex(isUser);
    user_list.splice(rmUsrIndex, 1);

    io.emit("update_connected_users_list", user_list);
    console.log(user_list);
  });

  // Public message broadcasting
  socket.on("broadcast_public_message", function (message) {
    console.log("GLOBAL FROM: [" + message.from + "]");
    console.log(message);
    io.emit("deliver_public_message", message);
  });

  // Private message sending
  socket.on("send_private_message", function (message) {
    let sourceUser = message.from;
    let destinationUser = message.to;

    const isUser = (user) => user.username == destinationUser;
    let destinationUserIndex = user_list.findIndex(isUser);

    let destinationSocket = user_list[destinationUserIndex].id;

    if (destinationSocket != null) {
      console.log("SENDING FROM: [" + sourceUser + "] TO [" + destinationUser + "]");
      io.to(destinationSocket).emit("deliver_private_message", message);
    } else {
      console.log("CANNOT SEND FROM: [" + sourceUser + "] TO [" + destinationUser + "]");
    }
  });

  // Function that gives the connected user list
  socket.on("get_connected_list", function () {
    console.log("REQUESTING USER LIST TO: [" + socket.id + "]");
    io.to(socket.id).emit("get_connected_list", user_list);
  });

  // User's response to the challenge
  socket.on("user_send_response", function (response) {
    console.log("USER ANSWER RECEIVED: [" + socket.id + "]");
    answerCurrentChallenge(response);
  });

});


// Time left for the user to answer the question
let userResponseTimer;
let secondsToAnswer = 30;

// Stores the correct answer to the current challenge
let correctAnswer;
let currentChallengedUser;

// Challenges a random user on a certain period of time
async function challengeRandomUser() {
  // If there is any available user...
  if (user_list.length > 0) {

    // Pick a random user
    let randomIndex = Math.floor(Math.random() * user_list.length);
    currentChallengedUser = user_list[randomIndex];

    // Get the random question
    const question = await getTriviaQuestion();
    correctAnswer = question.correct_answer;

    console.log("NEW CHALLENGED USER: [" + currentChallengedUser.username + "]");
    console.log(question);

    let answersArray = question.incorrect_answers;
    answersArray.push(question.correct_answer);

    let challenge = {
      question: question.question,
      answers: shuffleQuestions(answersArray)
    };

    // Send the user the challenge
    io.to(currentChallengedUser.id).emit("server_challenge", challenge);

    // If the user doesn't answer in the specified time, disconnect him
    userResponseTimer = setTimeout(disconnectUser, secondsToAnswer * 1000);
  }

  // Challenge another user in one minute
  setTimeout(challengeRandomUser, 60000);
}

function disconnectUser() {
  io.to(currentChallengedUser.id).emit("disconnect_user");
  console.log("DISCONNECTING USER: [" + currentChallengedUser.username + "]");
}

// If the answer is right, let the user go
function answerCurrentChallenge(response) {
  if (response == correctAnswer) {
    console.log("THE ANSWER IS CORRECT!");
    clearTimeout(userResponseTimer);
  }
  else {
    console.log("THE ANSWER IS INCORRECT...");
    disconnectUser();
  }

}

// Makes a petition to the API and brings a random question
const getTriviaQuestion = async () => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple');
    return response.data.results[0];
  } catch (err) {
    console.log(err);
  }
}

function shuffleQuestions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// A user is challenged every minute
setTimeout(challengeRandomUser, 60000);

server.listen(3001, () => console.log('server started'));
