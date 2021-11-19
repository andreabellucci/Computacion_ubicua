import React, { useContext } from "react";

import { Context } from "./Context";


export default function Header() {

  const { value6, value7 } = useContext(Context);
  const [currentPrivateChat, setCurrentPrivateChat] = value7;
  const [currentView, setCurrentView] = value6;

  return (
    <header id="header_div">
      <div id="header_div_title">
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
          {currentView === "simon" &&
            <p>Simon Game</p>
          }
        </div>
      </div>
      <div id="header_redirection">
        <img onClick={() => setCurrentView("global")} src="https://cdn-icons-png.flaticon.com/512/139/139706.png" alt="GlobalChat" />
        <img onClick={() => setCurrentView("users")} src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="UserList" />
        <img onClick={() => setCurrentView("simon")} src="https://cdn-icons-png.flaticon.com/512/489/489700.png" alt="SimonGame" />
      </div>
    </header>
  );
}

{/* <img onClick={() => setCurrentView("private")} src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="PrivateChat" /> */ }