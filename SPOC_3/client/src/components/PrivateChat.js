import React from "react";

function PrivateChat(props) {
  return (
    <div>
      <div id="chat_container">
        {props.messageList.map((msg, key) => {
          if (msg.from === props.currentChat && msg.to === props.username) {
            return (
              <div key={key} className='ur_text_message'>
                <div className="text_message_header">
                  <p className="text_message_username">{msg.from}</p>
                  <p className="text_messagen_datetime">{msg.datetime}</p>
                </div>
                <div className="text_message_content"><p>{msg.text}</p></div>
              </div>
            );
          } else if (msg.from === props.username && msg.to === props.currentChat) {
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
            return;
        })}
      </div>
    </div>
  );
}

export default PrivateChat;