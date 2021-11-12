import "./App.css";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import React from "react";


// COMPONENTS
import GlobalChat from "./components/ConnectedUserList";
import ConnectedUserList from "./components/GlobalChat";
import PrivateChat from "./components/PrivateChat";

const generator = require('project-name-generator');

function App() {
  const [username, setUsername] = useState(null);
  const [globalChat, setGlobalChat] = useState([]);
  const [socket, setSocket] = useState(null);

  /* 
  * BLOCK 1
  * Socket EVENT declaration
  */
  useEffect(() => {
    const socket = io("localhost:3001");

    socket.on("connect", () => {
      const newUserName = generator({ words: 2, number: false }).dashed;
      setUsername(newUserName);
      socket.emit("register_user", newUserName);
    });

    // A new GLOBAL message comes from the server
    socket.on("send_public_message", function (message) {
      let formattedMessage = buildTextMessage(message);
      setGlobalChat(formattedMessage);
    });

    setSocket(socket);
  }, []);

  /* 
   * BLOCK 2
   * Application FUNCTIONS
  */
  function sendPublicMessage() {
    // Extract the message from the box and clear it
    let message = document.getElementById("input_message").value;
    if (message != "") {
      document.getElementById("input_message").value = "";
      let newGlobalMessage = { from: username, text: message, datetime: new Date().toLocaleString() };
      socket.emit("broadcast_public_message", newGlobalMessage);
    }
  }

  /* 
   * BLOCK 3
   * Auxiliar FUNCTIONS
  */
  function buildTextMessage(message) {
    console.log("Mi nombre es.... " + username);
    if (username === message.from)
      return (
        <div className="my_text_message" >
          <div className="text_message_header">
            <p className="text_message_username">{message.from}</p>
            <p className="text_messagen_datetime">{message.datetime}</p>
          </div>
          <div className="text_message_content"><p>{message.text}</p></div>
        </div>
      );
    else
      return (
        <div className="ur_text_message" >
          <div className="text_message_header">
            <p className="text_message_username">{message.from}</p>
            <p className="text_messagen_datetime">{message.datetime}</p>
          </div>
          <div className="text_message_content"><p>{message.text}</p></div>
        </div>
      );
  }

  // Here we build the entire app
  return (
    <div>
      <header id="header_div">
        <img src="https://logodix.com/logo/1229689.png" alt="messenger butterfly icon" />
        <div>
          <p>sendertext</p>
          <p>{username}</p>
        </div>
      </header>

      <div id="chat_container">{globalChat}</div>

      <footer id="footer_div">
        <input type="text" id="input_message" placeholder="message..." />
        <input type="submit" onClick={sendPublicMessage} id="input_submit" value="&#10148;" />
      </footer>
    </div>
  );
}

export default App;