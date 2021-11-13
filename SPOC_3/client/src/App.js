import "./App.css";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import React from "react";


// COMPONENTS
import ConnectedUserList from "./components/ConnectedUserList";
import GlobalChat from "./components/GlobalChat";
import PrivateChat from "./components/PrivateChat";

const generator = require('project-name-generator');

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [publicMessageStack, setPublicMessageStack] = useState([]);
  const [privateMessageStack, setPrivateMessageStack] = useState([]);
  const [connectedUserList, setconnectedUserList] = useState([]);
  const [currentView, setCurrentView] = useState("global"); // global, private, users
  const [currentPrivateChat, setCurrentPrivateChat] = useState(""); // Who youre talking in private at the moment
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
    socket.on("deliver_public_message", (message) => {
      setPublicMessageStack((prevMessageStack) => [...prevMessageStack, message]);
    });

    // A new GLOBAL message comes from the server
    socket.on("deliver_private_message", (message) => {
      setPrivateMessageStack((prevMessageStack) => [...prevMessageStack, message]);
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
      document.getElementById("input_message").value = "";
      setNewMessage("");
    }
  }

  function sendPrivateMessage() {
    // Extract the message from the box and clear it
    if (newMessage != "") {
      let newPrivateMessage = { from: username, to: currentPrivateChat, text: newMessage, datetime: new Date().toLocaleString() };
      socket.emit("send_private_message", newPrivateMessage);
      document.getElementById("input_message").value = "";
      setNewMessage("");
    }
  }

  function handleOnInput(e) {
    setNewMessage(e.target.value);
  }

  // Here we build the entire app
  return (
    <div>
      <header id="header_div">
        <div>
          <img src="https://logodix.com/logo/1229689.png" alt="messenger butterfly icon" />
          <div>
            {currentView == "global" &&
              <p>Global Chat</p>
            }
            {currentView == "users" &&
              <p>User List</p>
            }
            {currentView == "private" &&
              <p>Prv: {currentPrivateChat}</p>
            }
          </div>
        </div>
        <div id="header_redirection">
          <img src="https://cdn-icons-png.flaticon.com/512/139/139706.png" alt="GlobalChat" />
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="UserList" />
          <img src="https://cdn-icons.flaticon.com/png/512/2593/premium/2593656.png?token=exp=1636808934~hmac=9a263504d8a0fd451a7781f24cdc83d8" alt="PrivateChat" />
        </div>
      </header>

      {currentView == "global" &&
        <GlobalChat messageList={publicMessageStack} username={username} />
      }
      {currentView == "users" &&
        <ConnectedUserList userList={connectedUserList} />
      }
      {currentView == "private" &&
        <PrivateChat messageList={privateMessageStack} currentChat={currentPrivateChat} />
      }

      {(currentView == "global" || currentView == "private") &&
        <footer id="footer_div">
          <input onInput={handleOnInput} type="text" id="input_message" placeholder="message..." />
          <input type="submit" onClick={sendPublicMessage} id="input_submit" value="&#10148;" />
        </footer>
      }
    </div>
  );
}

export default App;