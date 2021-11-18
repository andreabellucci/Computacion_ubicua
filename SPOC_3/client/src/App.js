import "./App.css";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import React from "react";


// COMPONENTS
import { Context } from "./components/Context";
import Challenge from "./components/Challenge";
import Header from "./components/Header";
import ConnectedUserList from "./components/ConnectedUserList";
import GlobalChat from "./components/GlobalChat";
import PrivateChat from "./components/PrivateChat";
import PendingMessage from "./components/PendingMessage";
import Input from "./components/Input";


const generator = require('project-name-generator');

export default function App() {

  /* 
  * BLOCK 1
  * Constants
  */
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [publicMessageStack, setPublicMessageStack] = useState([]);
  const [privateMessageStack, setPrivateMessageStack] = useState([]);
  const [connectedUserList, setConnectedUserList] = useState([]);
  const [currentView, setCurrentView] = useState("global"); // global, private, users
  const [currentPrivateChat, setCurrentPrivateChat] = useState(""); // Who you're talking in private at the moment
  const [newMessage, setNewMessage] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [pendingSendingMessage, setPendingSendingMessage] = useState(null);
  const [arrayShuffledQuestions, setArrayShuffledQuestions] = useState(null);


  /* 
  * BLOCK 2
  * Socket EVENT declaration
  */
  useEffect(() => {
    const socket = io("localhost:3001");

    // When the socket connects to the server
    socket.on("connect", () => {
      const newUserName = generator({ words: 1, number: true }).dashed;
      setUsername(newUserName);
      socket.emit("register_user", newUserName);
    });

    // A new GLOBAL message comes from the server
    socket.on("deliver_public_message", (message) => {
      setPublicMessageStack((prevMessageStack) => [...prevMessageStack, message]);
    });

    // A new PRIVATE message comes from the server
    socket.on("deliver_private_message", (message) => {
      setPrivateMessageStack((prevMessageStack) => [...prevMessageStack, message]);
    });

    // The updated user connected list arrives
    socket.on("update_connected_users_list", (userList) => {
      setConnectedUserList(userList);
    });

    // The server challenge us
    socket.on("server_challenge", () => {
      // Makes a petition to the API and brings a random question

      fetch('https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple')
        .then(response => response.json())
        .then(data => {
          setChallenge(data.results[0]);

          let array = data.results[0].incorrect_answers;
          array.push(data.results[0].correct_answer);
          setArrayShuffledQuestions(shuffleQuestions(array));
        })
        .catch(err => {
          console.log(err);
          setChallenge(null);
        });
    });

    // The server force-disconnect us
    socket.on("disconnect_user", () => {
      setChallenge(null);
      socket.disconnect();
      alert("Prueba no superada, desconexión del servidor...");
    });

    setSocket(socket);
  }, []);

  /* 
  * BLOCK 3
  * Aux functions
  */
  function shuffleQuestions(array) {

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    console.log(array);

    return array;
  }


  /* 
  * BLOCK 4
  * App build
  */
  return (
    <div>
      <Context.Provider value={{
        value1: [socket, setSocket],
        value2: [username, setUsername],
        value3: [publicMessageStack, setPublicMessageStack],
        value4: [privateMessageStack, setPrivateMessageStack],
        value5: [connectedUserList, setConnectedUserList],
        value6: [currentView, setCurrentView],
        value7: [currentPrivateChat, setCurrentPrivateChat],
        value8: [newMessage, setNewMessage],
        value9: [challenge, setChallenge],
        value10: [pendingSendingMessage, setPendingSendingMessage],
        value11: [arrayShuffledQuestions, setArrayShuffledQuestions]
      }}>
        <Challenge />
        <Header />
        <GlobalChat />
        <ConnectedUserList />
        <PrivateChat />
        <PendingMessage />
        <Input />
      </Context.Provider>
    </div >
  );
}