import "./App.css";
import { useState, useEffect, useRef } from "react";
import { SOCKET } from "./components/Socket"; // SOCKET is a constant from another file, that is to prevent multiple connections
import React from "react";

// COMPONENTS
import GlobalChat from "./components/ConnectedUserList";
import ConnectedUserList from "./components/GlobalChat";
import PrivateChat from "./components/PrivateChat";


function App() {

  const [username, setUsername] = useState("");
  const [globalChat, setGlobalChat] = useState();

  /* 
  * BLOCK 1
  * Socket EVENT declaration
  */
  useEffect(() => {
    // The server gives us our username on connect
    SOCKET.on("new_username", function (myUserName) {
      setUsername(myUserName);
    });

    // A new GLOBAL message comes from the server
    SOCKET.on("broadcast_public_message", function (newGLobalMessage) {
      console.log("me acaba de llegar un mensage global que cosas");
      let newHtmlMessage = buildTextMessage(newGLobalMessage);
      setGlobalChat(newHtmlMessage);
    });
  }, [SOCKET]);


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
      SOCKET.emit("send_public_message", newGlobalMessage);
    }
  }

  /* 
   * BLOCK 3
   * Auxiliar FUNCTIONS
  */
  function buildTextMessage(message) {
    if (message.username == username)
      return (
        <div className="my_text_message" >
          <div className="text_message_header">
            <p className="text_message_username">{message.username}</p>
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