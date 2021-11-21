import React, { useContext, useEffect, useRef } from "react";
import { Context } from "./Context";

export default function Input() {

  const { value1, value2, value4, value6, value7, value8, value10 } = useContext(Context);
  const [socket, setSocket] = value1;
  const [username, setUsername] = value2;
  const [privateMessageStack, setPrivateMessageStack] = value4;
  const [currentView, setCurrentView] = value6;
  const [currentPrivateChat, setCurrentPrivateChat] = value7;
  const [newMessage, setNewMessage] = value8;
  const timerMessage = useRef();
  const [pendingSendingMessage, setPendingSendingMessage] = value10;
  // const [timeThreshold, setTimeThreshold] = useState(null);

  useEffect(() => {
    configureMouseMove();
    configureAccelerometer();
  }, []);

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
        timerMessage.current = setTimeout(() => {
          socket.emit("broadcast_public_message", newGlobalMessage);
          timerMessage.current = null;
          setPendingSendingMessage(null);
        }, 5000);
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
        configureMouseMove();
        configureAccelerometer();

        // Send the message in the next 5 seconds...
        timerMessage.current = setTimeout(() => {
          socket.emit("send_private_message", newPrivateMessage);
          setPrivateMessageStack((prevMessageStack) => [...prevMessageStack, newPrivateMessage]);
          timerMessage.current = null;
          setPendingSendingMessage(null);
        }, 5000);
      }
    }
  }

  function cancelMessage() {
    clearTimeout(timerMessage.current);
    timerMessage.current = null;
    setPendingSendingMessage(null);
  }

  function handleOnInput(e) {
    setNewMessage(e.target.value);
  }

  function configureAccelerometer() {

    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;

    let moving = false;

    const options = {
      threshold: 15
    };


    if ('Accelerometer' in window) {
      try {
        const acc = new window.Accelerometer({ frequency: 60 });

        acc.onreading = () => {
          const deltaX = Math.abs(lastX - acc.x);
          const deltaY = Math.abs(lastY - acc.y);
          const deltaZ = Math.abs(lastZ - acc.z);

          if (((deltaX > options.threshold) && (deltaY > options.threshold)) ||
            ((deltaX > options.threshold) && (deltaZ > options.threshold)) ||
            ((deltaY > options.threshold) && (deltaZ > options.threshold))
          ) {
            if (!moving) {
              cancelMessage();
              moving = true;
            }
          } else {
            if (moving) {
              moving = false;
            }
          }

          lastX = acc.x;
          lastY = acc.y;
          lastZ = acc.z;

        }

        acc.start();
      } catch (err) {
        console.log(err);
      }
    }
  }

  function configureMouseMove() {

    let lastX = 0;

    const options = {
      threshold: 300,
      windowJumpingError: 800 // control the excess of movement caused by the mouse hovering out of the html page
    };

    let timeThreshold;

    document.body.addEventListener('mousemove', e => {

      if (!timeThreshold) {
        if (lastX !== 0) {
          const deltaX = Math.abs(lastX - e.offsetX);

          if ((deltaX > options.threshold) && deltaX < options.windowJumpingError) {
            cancelMessage();
          }
        }

        lastX = e.offsetX;

        timeThreshold = setTimeout(() => timeThreshold = null, 50);
      }
    });
  }

  return (
    <div>
      {(currentView === "global" || currentView === "private") &&
        <footer id="footer_div">
          <input onInput={handleOnInput} type="text" id="input_message" placeholder="message..." />
          {timerMessage.current &&
            <input type="submit" onClick={cancelMessage} className="input_submit" value="&#128473;" />
          }
          {currentView === "global" && !timerMessage.current &&
            <input type="submit" onClick={() => sendPublicMessage("timer")} className="input_submit" value="&#128337;" />
          }
          {currentView === "private" && !timerMessage.current &&
            < input type="submit" onClick={() => sendPrivateMessage("timer")} className="input_submit" value="&#128337;" />
          }

          {currentView === "global" && !timerMessage.current &&
            < input type="submit" onClick={() => sendPublicMessage("normal")} className="input_submit" value="&#10148;" />
          }
          {currentView === "private" && !timerMessage.current &&
            < input type="submit" onClick={() => sendPrivateMessage("normal")} className="input_submit" value="&#10148;" />
          }
        </footer>
      }
    </div>
  );
}