import React, { useContext } from "react";

import { Context } from "./Context";

export default function GlobalChat() {

  const { value2, value3, value6 } = useContext(Context);
  const [username, setUsername] = value2;
  const [publicMessageStack, setPublicMessageStack] = value3;
  const [currentView, setCurrentView] = value6;

  return (
    <div>
      {currentView === "global" &&
        <div id="chat_container">
          {publicMessageStack.map((msg, key) => {
            return (
              <div key={key} className={username === msg.from ? 'my_text_message' : 'ur_text_message'}>
                <div className="text_message_header">
                  <p className="text_message_username">{msg.from}</p>
                  <p className="text_messagen_datetime">{msg.datetime}</p>
                </div>
                <div className="text_message_content"><p>{msg.text}</p></div>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
