import React, { useContext } from "react";
import { Context } from "./Context";

export default function Input() {

  const { value1, value2, value4, value6, value7, value8 } = useContext(Context);
  const [socket, setSocket] = value1;
  const [username, setUsername] = value2;
  const [privateMessageStack, setPrivateMessageStack] = value4;
  const [currentView, setCurrentView] = value6;
  const [currentPrivateChat, setCurrentPrivateChat] = value7;
  const [newMessage, setNewMessage] = value8;

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

  return (
    <div>
      {(currentView === "global" || currentView === "private") &&
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
    </div>
  );
}