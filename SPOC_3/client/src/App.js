import "./App.css";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

// COMPONENTS
import GlobalChat from "./components/ConnectedUserList";
import ConnectedUserList from "./components/GlobalChat";
import PrivateChat from "./components/PrivateChat";


function App() {

  // const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(io("localhost:3001", { autoConnect: false }));
  const [username, setUsername] = useState("");
  const [globalChat, setGlobalChat] = useState();
  // const [currentState, setCurrentState] = useState("global_chat");

  useEffect(() => {
    setSocket(() => {
      return io("localhost:3001");
    });
  }, []);

  useEffect(() => {
    // The server gives us our username on connect
    socket.on("new_username", function (myUserName) {
      setUsername(myUserName);
    });

    // A new GLOBAL message comes from the server
    socket.on("broadcast_public_message", function (newGLobalMessage) {
      let newHtmlMessage = buildTextMessage(newGLobalMessage);
      setGlobalChat(newHtmlMessage);
    });
  }, [socket]);


  /* 
 * BLOCK 1
 * Socket EVENT declaration
*/
  // // Start the comms with the server
  // useEffect(() => {
  //   if (socket == null) {
  //     setSocket(() => {
  //       return io("localhost:3001");
  //     });
  //   }
  // }, []);


  /* 
   * BLOCK 2
   * Application FUNCTIONS
  */
  function sendPublicMessage() {
    console.log(username);
    // Extract the message from the box and clear it
    let message = document.getElementById("input_message").value;
    if (message != "") {
      document.getElementById("input_message").value = "";
      let newGlobalMessage = { from: username, text: message, datetime: new Date().toLocaleString() };
      socket.emit("send_public_message", newGlobalMessage);
    }
  }

  // // Function that changes the pages that the app shows
  // function changeAppState() {
  //   setCurrentState("");
  // }


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

