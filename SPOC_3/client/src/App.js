import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;



// import "./App.css";
// import { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// function App() {
//   const [message, setMessage] = useState("");
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     setSocket(() => {
//       return io("https://socketio-chatserver.andreabellucci1.repl.co");
//     });
//   }, []);

//   function handleOnClick() {
//     socket.emit("message_evt", { msg: message });
//   }

//   function handleOnChange(e) {
//     setMessage(e.target.value);
//   }

//   return (
//     <div>
//       <input type="text" onChange={handleOnChange}></input>
//       <button onClick={handleOnClick}>send</button>
//     </div>
//   );
// }

// export default App;
// /*
// const socket = io();
// const button = document.querySelector("button");
// const input = document.querySelector("input");
// const msg = document.querySelector("#msg");

// button.addEventListener("click", function(e) {
//   const text = input.value;
//   //enviarselo al servidor
//   socket.emit("message_evt", {msg: text});
// });

// socket.on("message_evt", function(message){
//   msg.innerHTML = message.msg;
// });
// */
