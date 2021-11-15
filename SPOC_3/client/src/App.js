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


  /* 
  * BLOCK 2
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

    // A new PRIVATE message comes from the server
    socket.on("deliver_private_message", (message) => {
      console.log("new message!!!!!");
      console.log(message);
      setPrivateMessageStack((prevMessageStack) => [...prevMessageStack, message]);
    });

    // The updated user connected list arrives
    socket.on("update_connected_users_list", (userList) => {
      setConnectedUserList(userList);
    });

    // The server challenge us
    socket.on("server_challenge", (challenge) => {
      setChallenge(challenge);
    });

    // The server force-disconnect us
    socket.on("disconnect_user", () => {
      socket.disconnect();
    });

    setSocket(socket);
  }, []);


  /* 
  * BLOCK 3
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
        value9: [challenge, setChallenge]
      }}>
        <Challenge></Challenge>
        <Header currentPrivateChat={currentPrivateChat} />
        <GlobalChat messageList={publicMessageStack} username={username} currentView={currentView} />
        <ConnectedUserList username={username} connectedUserList={connectedUserList} />
        <PrivateChat messageList={privateMessageStack} currentChat={currentPrivateChat} username={username} currentView={currentView} />
        <Input></Input>
      </Context.Provider>
    </div >
  );
}