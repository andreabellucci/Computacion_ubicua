import React, { useContext, useState } from "react";
import { Context } from "./Context";

export default function Simon() {

  const { value6 } = useContext(Context);
  const [currentView, setCurrentView] = value6;
  const [inGame, setInGame] = useState(false);
  const [movementSimonStack, setMovementSimonStack] = useState([]);
  const [userStackIndex, setUserStackIndex] = useState(0);

  function startGame() {
    setMovementSimonStack([]);
    setInGame(true);
  }

  function stopGame() {
    setInGame(false);
  }

  function colorChoice(color) {
    if (inGame) {
      if (movementSimonStack[userStackIndex] === color) {
        setUserStackIndex(userStackIndex + 1);
      } else {
        alert("Sequence NOT correct, you lose");
        setInGame(false);
      }
    }
  }

  return (
    <div>
      {currentView === "simon" &&
        <div id="simon_game_container">
          <div id="upper_simon">
            <div id="simon_part_yellow" onClick={() => colorChoice("yellow")}></div>
            <div id="simon_part_blue" onClick={() => colorChoice("blue")}></div>
          </div>
          <div id="lower_simon">
            <div id="simon_part_red" onClick={() => colorChoice("red")}></div>
            <div id="simon_part_green" onClick={() => colorChoice("green")}></div>
          </div>
          <div id="simon_game_info">
            <input type="submit" onClick={() => startGame()} className="simon_button" value="&#9654;" />
            <input type="submit" onClick={() => stopGame()} className="simon_button" value="	&#9209;" />
          </div>
        </div>
      }
    </div>
  );
}