import "./App.css";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Route, Routes, Navbar } from "react-router-dom";

// COMPONENTS
import GlobalChat from "./components/ConnectedUserList";
import ConnectedUserList from "./components/GlobalChat";
import PrivateChat from "./components/PrivateChat";

function App() {
  // const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(io("localhost:3001"));
  const [username, setUsername] = useState("");
  const [globalChat, setGlobalChat] = useState("");
  const [currentState, setCurrentState] = useState("global_chat");

  // Start the comms with the server
  // useEffect(() => {
  //   setSocket(() => {
  //     return io("localhost:3001");
  //   });
  // }, []);

  // The server returns our new username
  socket.on("new_username", function (myUserName) {
    setUsername(myUserName);
  });

  // A new GLOBAL message comes from the server
  socket.on("broadcast_public_message", function (newGLobalMessage) {
    
  });

  function sendPublicMessage() {
    // Extract the message from the box and clear it
    let message = document.getElementById("input_message").value;
    if (message != "") {
      document.getElementById("input_message").value = "";
      let newGlobalMessage = { from: username, text: message, datetime: new Date().toLocaleString() };
      socket.emit("send_public_message", newGlobalMessage);
    }
  }

  // Function that changes the pages that the app shows
  function changeAppState() {
    setCurrentState("");
  }

  return (
    <div>
      <header id="header_div">
        <img src="https://logodix.com/logo/1229689.png" alt="messenger butterfly icon" />
        <div>
          <p>sendertext</p>
        </div>
      </header>

      <div id="chat_container"></div>

      <footer id="footer_div">
        <input type="text" id="input_message" placeholder="message..." />
        <button onClick={sendPublicMessage} id="input_submit" value="&#10148;" />
      </footer>
    </div>
  );
}

export default App;

/*
const socket = io();
const button = document.querySelector("button");
const input = document.querySelector("input");
const msg = document.querySelector("#msg");

button.addEventListener("click", function(e) {
  const text = input.value;
  //enviarselo al servidor
  socket.emit("message_evt", {msg: text});
});

socket.on("message_evt", function(message){
  msg.innerHTML = message.msg;
});
*/



    // <main>
    //   <Routes>
    //     <Route path="/" component={GlobalChat} exact />
    //     <Route path="/UsersConnected" component={ConnectedUserList} />
    //     <Route path="/PrivateChat" component={PrivateChat} />
    //   </Routes>
    // </main>


      // function getMessageText(e) {
  //   setMessage(e.target.value);
  // }