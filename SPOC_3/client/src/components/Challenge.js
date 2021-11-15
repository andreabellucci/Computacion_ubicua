import React, { useContext } from "react";
import { Context } from "./Context";

export default function Challenge() {

  const { value1, value9 } = useContext(Context);
  const [challenge, setChallenge] = value9;
  const [socket, setSocket] = value1;

  function sendChallengeAnswer(answer) {
    socket.emit("user_send_response", answer);
    setChallenge(null);
  }

  return (
    <div>
      {challenge &&
        <div id="challenge">
          <h2>{challenge.question}</h2>
          <div id="challenge_answers">
            {challenge.answers.map((val, key) => {
              return <p onClick={() => sendChallengeAnswer(val)} key={key}>{val}</p>;
            })}
          </div>
        </div>
      }
    </div>
  );
}