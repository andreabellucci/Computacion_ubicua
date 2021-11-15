import React, { useContext } from "react";

import { Context } from "./Context";


export default function Header(props) {

  const { value6 } = useContext(Context);
  const [currentView, setCurrentView] = value6;

  return (
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
            <p>{props.currentPrivateChat}</p>
          }
        </div>
      </div>
      <div id="header_redirection">
        <img onClick={() => setCurrentView("global")} src="https://cdn-icons-png.flaticon.com/512/139/139706.png" alt="GlobalChat" />
        <img onClick={() => setCurrentView("users")} src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="UserList" />
        <img onClick={() => setCurrentView("private")} src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="PrivateChat" />
      </div>
    </header>
  );
}