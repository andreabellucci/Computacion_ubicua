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
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [publicMessageStack, setPublicMessageStack] = useState([]);
  const [connectedUserList, setconnectedUserList] = useState([]);
  const [currentView, setCurrentView] = useState("global"); // global, private, users
  const [newMessage, setNewMessage] = useState("");


  /* 
  * BLOCK 1
  * Socket EVENT declaration
  */
  useEffect(() => {
    const socket = io("localhost:3001");

    // When the socket connects to the server
    socket.on("connect", () => {
      const newUserName = generator({ words: 2, number: false }).dashed;
      setUsername(newUserName);
      socket.emit("register_user", newUserName);
    });

    // A new GLOBAL message comes from the server
    socket.on("send_public_message", (message) => {
      setPublicMessageStack((prevMessageStack) => [...prevMessageStack, message]);
    });

    setSocket(socket);
  }, []);

  /* 
   * BLOCK 2
   * Application FUNCTIONS
  */
  function sendPublicMessage() {
    // Extract the message from the box and clear it
    if (newMessage != "") {
      let newGlobalMessage = { from: username, text: newMessage, datetime: new Date().toLocaleString() };
      socket.emit("broadcast_public_message", newGlobalMessage);
      setNewMessage("");
    }
  }

  function handleOnInput(e) {
    setNewMessage(e.target.value);
  }

  // Here we build the entire app
  return (
    <div>
      {currentView == "global" &&
        <GlobalChat messageList={publicMessageStack} username={username} />
      }
      {currentView == "users" &&
        <ConnectedUserList userList={connectedUserList} />
      }
      {currentView == "private" &&
        <PrivateChat />
      }

      {currentView == "global" || currentView == "private" &&
        <footer id="footer_div">
          <input onInput={handleOnInput} type="text" id="input_message" placeholder="message..." />
          <input type="submit" onClick={sendPublicMessage} id="input_submit" value="&#10148;" />
        </footer>
      }
    </div>
  );
}

export default App;