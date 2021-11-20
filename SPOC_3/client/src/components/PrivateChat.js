import React, { useContext } from "react";

import { Context } from "./Context";

export default function PrivateChat() {

  const { value2, value4, value6, value7 } = useContext(Context);
  const [username, setUsername] = value2;
  const [privateMessageStack, setPrivateMessageStack] = value4;
  const [currentView, setCurrentView] = value6;
  const [currentPrivateChat, setCurrentPrivateChat] = value7;

  return (
    <div>
      {currentView === "private" &&
        <div id="chat_container">
          {privateMessageStack.map((msg, key) => {
            if (msg.from === currentPrivateChat && msg.to === username) {
              return (
                <div key={key} className='ur_text_message'>
                  <div className="text_message_header">
                    <p className="text_message_username">{msg.from}</p>
                    <p className="text_messagen_datetime">{msg.datetime}</p>
                  </div>
                  <div className="text_message_content"><p>{msg.text}</p></div>
                </div>
              );
            } else if (msg.from === username && msg.to === currentPrivateChat) {
              return (
                <div key={key} className='my_text_message'>
                  <div className="text_message_header">
                    <p className="text_message_username">{msg.from}</p>
                    <p className="text_messagen_datetime">{msg.datetime}</p>
                  </div>
                  <div className="text_message_content"><p>{msg.text}</p></div>
                </div>
              );
            } else
              return <div></div>
          })}
        </div>
      }
    </div>
  );
}