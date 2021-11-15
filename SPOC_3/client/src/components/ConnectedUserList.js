import React, { useContext } from "react";

import { Context } from "./Context";

export default function ConnectedUserList(props) {

  const { value6, value7 } = useContext(Context);
  const [currentPrivateChat, setCurrentPrivateChat] = value7;
  const [currentView, setCurrentView] = value6;

  function changePrivateChat(user) {
    setCurrentPrivateChat(user);
    setCurrentView("private");
  }

  return (
    <div>
      {currentView === "users" &&
        <div>
          <div id="connected_users">
            {props.connectedUserList.map((val, key) => {
              if (props.username !== val.username) {
                return (
                  <div key={key} className="connected_user_container" onClick={() => changePrivateChat(val.username)}>
                    <img
                      src="https://img.utdstc.com/icon/9a8/867/9a8867eb77f8a20e62b5ea69f900de7c650546db544a00ce042d66945fd987bb:200"
                      alt="messenger butterfly icon" />
                    <div>
                      <p>{val.username}</p>
                    </div>
                  </div>
                );
              } else
                return <div key={key}></div>;
            })}
          </div>
        </div>
      }
    </div>
  );
}