import React, { useContext, useState } from "react";
import { Context } from "./Context";

export default function Input() {

  const { value1, value2, value4, value6, value7, value8, value10 } = useContext(Context);
  const [socket, setSocket] = value1;
  const [username, setUsername] = value2;
  const [privateMessageStack, setPrivateMessageStack] = value4;
  const [currentView, setCurrentView] = value6;
  const [currentPrivateChat, setCurrentPrivateChat] = value7;
  const [newMessage, setNewMessage] = value8;
  const [timerMessage, setTimerMessage] = useState(null);
  const [pendingSendingMessage, setPendingSendingMessage] = value10;


  function sendPublicMessage(mode) {
    // Extract the message from the box and clear it
    if (newMessage !== "") {
      let newGlobalMessage = { from: username, text: newMessage, datetime: new Date().toLocaleString() };
      document.getElementById("input_message").value = "";
      setNewMessage("");

      if (mode === "normal") {
        socket.emit("broadcast_public_message", newGlobalMessage);
      } else if (mode === "timer") {

        setPendingSendingMessage(newGlobalMessage);

        // Send the message in the next 5 seconds...
        setTimerMessage(setTimeout(() => {
          socket.emit("broadcast_public_message", newGlobalMessage);
          setTimerMessage(null);
        }, 5000));
      }
    }
  }

  function sendPrivateMessage(mode) {
    // Extract the message from the box and clear it
    if (newMessage !== "") {
      let newPrivateMessage = { from: username, to: currentPrivateChat, text: newMessage, datetime: new Date().toLocaleString() };
      document.getElementById("input_message").value = "";
      setNewMessage("");

      if (mode === "normal") {
        socket.emit("send_private_message", newPrivateMessage);
      } else if (mode === "timer") {

        setPendingSendingMessage(newPrivateMessage);

        // Send the message in the next 5 seconds...
        setTimerMessage(setTimeout(() => {
          socket.emit("send_private_message", newPrivateMessage);
          setPrivateMessageStack((prevMessageStack) => [...prevMessageStack, newPrivateMessage]);
          setTimerMessage(null);
        }, 5000));
      }
    }
  }

  function cancelMessage() {
    clearTimeout(timerMessage);
    setTimerMessage(null);
  }

  function handleOnInput(e) {
    setNewMessage(e.target.value);
  }

  return (
    <div>
      {(currentView === "global" || currentView === "private") &&
        <footer id="footer_div">
          <input onInput={handleOnInput} type="text" id="input_message" placeholder="message..." />
          {timerMessage &&
            <input type="submit" onClick={cancelMessage} class="input_submit" value="&#128473;" />
          }
          {currentView === "global" && !timerMessage &&
            <input type="submit" onClick={() => sendPublicMessage("timer")} class="input_submit" value="&#128337;" />
          }
          {currentView === "private" && !timerMessage &&
            < input type="submit" onClick={() => sendPrivateMessage("timer")} class="input_submit" value="&#128337;" />
          }

          {currentView === "global" && !timerMessage &&
            < input type="submit" onClick={() => sendPublicMessage("normal")} class="input_submit" value="&#10148;" />
          }
          {currentView === "private" && !timerMessage &&
            < input type="submit" onClick={() => sendPrivateMessage("normal")} class="input_submit" value="&#10148;" />
          }
        </footer>
      }
    </div>
  );
}