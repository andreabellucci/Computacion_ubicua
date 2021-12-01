import React, { useContext, useState } from "react";
import { Context } from "./Context";

export default function Challenge() {

  const { value1, value9, value11 } = useContext(Context);
  const [challenge, setChallenge] = value9;
  const [socket, setSocket] = value1;
  const [arrayShuffledQuestions, setArrayShuffledQuestions] = value11;

  function sendChallengeAnswer(answer) {
    socket.emit("user_send_response", (challenge.correct_answer === answer ? true : false));
    setChallenge(null);
  }


  return (
    <div>
      {challenge && arrayShuffledQuestions &&
        <div id="challenge">
          <h2>{challenge.question}</h2>
          {arrayShuffledQuestions.map((val, key) => {
            return <p onClick={() => sendChallengeAnswer(val)} key={key}>{val}</p>;
          })}
        </div>
      }
    </div >
  );
}