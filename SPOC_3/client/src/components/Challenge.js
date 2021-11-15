import React, { useContext } from "react";
import { Context } from "./Context";

export default function Challenge() {

    const { value9 } = useContext(Context);
    const [challenge, setChallenge] = value9;

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