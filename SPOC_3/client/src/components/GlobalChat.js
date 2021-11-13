import React from "react";

function GlobalChat(props) {
  return (
    <div>
      <header id="header_div">
        <img src="https://logodix.com/logo/1229689.png" alt="messenger butterfly icon" />
        <div>
          <p>Global Chat</p>
        </div>
      </header>

      <div id="chat_container">
        {props.messageList.map((msg, key) => {
          return (
            <div key={key} className={props.username == msg.from ? 'my_text_message' : 'ur_text_message'}>
              <div className="text_message_header">
                <p className="text_message_username">{msg.from}</p>
                <p className="text_messagen_datetime">{msg.datetime}</p>
              </div>
              <div className="text_message_content"><p>{msg.text}</p></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GlobalChat;