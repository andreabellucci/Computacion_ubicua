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
  const [connectedUserList, setConnectedUserList] = useState([]);
  const [currentView, setCurrentView] = useState("global"); // global, private, users
  const [currentPrivateChat, setCurrentPrivateChat] = useState(""); // Who you're talking in private at the moment
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
      console.log("new message!!!!!");
      console.log(message);
      setPrivateMessageStack((prevMessageStack) => [...prevMessageStack, message]);
    });

    // A new GLOBAL message comes from the server
    socket.on("update_connected_users_list", (userList) => {
      setConnectedUserList(userList);
    });

    setSocket(socket);
  }, []);

  /* 
   * BLOCK 2
   * Application FUNCTIONS
  */
  function sendPublicMessage() {
    // Extract the message from the box and clear it
    if (newMessage !== "") {
      let newGlobalMessage = { from: username, text: newMessage, datetime: new Date().toLocaleString() };
      socket.emit("broadcast_public_message", newGlobalMessage);
      document.getElementById("input_message").value = "";
      setNewMessage("");
    }
  }

  function sendPrivateMessage() {
    // Extract the message from the box and clear it
    if (newMessage !== "") {
      let newPrivateMessage = { from: username, to: currentPrivateChat, text: newMessage, datetime: new Date().toLocaleString() };
      socket.emit("send_private_message", newPrivateMessage);
      setPrivateMessageStack((prevMessageStack) => [...prevMessageStack, newPrivateMessage]);
      document.getElementById("input_message").value = "";
      setNewMessage("");
    }
  }

  function handleOnInput(e) {
    setNewMessage(e.target.value);
  }

  function changeAppView(view) {
    setCurrentView(view);
  }

  function changePrivateChat(user) {
    setCurrentPrivateChat(user);
    setCurrentView("private");
  }

  // Here we build the entire app
  return (
    <div>
      <header id="header_div">
        <div>
          <img src="https://logodix.com/logo/1229689.png" alt="msn butterfly icon" />
          <div>
            {currentView === "global" &&
              <p>Global Chat</p>
            }
            {currentView === "users" &&
              <p>User List</p>
            }
            {currentView === "private" &&
              <p>{currentPrivateChat}</p>
            }
          </div>
        </div>
        <div id="header_redirection">
          <img onClick={() => changeAppView("global")} src="https://cdn-icons-png.flaticon.com/512/139/139706.png" alt="GlobalChat" />
          <img onClick={() => changeAppView("users")} src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="UserList" />
          <img onClick={() => changeAppView("private")} src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="PrivateChat" />
        </div>
      </header>

      {currentView === "global" &&
        <GlobalChat messageList={publicMessageStack} username={username} />
      }
      {currentView === "users" &&
        // <ConnectedUserList usersList={connectedUserList} />
        <div>
          <div id="connected_users">
            {connectedUserList.map((val, key) => {
              if (username != val.username) {
                return (
                  <div key={key} className="connected_user_container" onClick={() => changePrivateChat(val.username)}>
                    <img
                      src="https://img.utdstc.com/icon/9a8/867/9a8867eb77f8a20e62b5ea69f900de7c650546db544a00ce042d66945fd987bb:200"
                      alt="messenger butterfly icon" />
                    <div>
                      <p>{val.username}</p>
                    </div>
                  </div>
                );
              } else
                return;
            })}
          </div>
        </div>
      }
      {
        currentView === "private" &&
        <PrivateChat messageList={privateMessageStack} currentChat={currentPrivateChat} username={username} />
      }

      {
        (currentView === "global" || currentView === "private") &&
        <footer id="footer_div">
          <input onInput={handleOnInput} type="text" id="input_message" placeholder="message..." />
          {currentView === "global" &&
            <input type="submit" onClick={sendPublicMessage} id="input_submit" value="&#10148;" />
          }
          {currentView === "private" &&
            <input type="submit" onClick={sendPrivateMessage} id="input_submit" value="&#10148;" />
          }
        </footer>
      }
    </div >
  );
}

export default App;