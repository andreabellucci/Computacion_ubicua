import React, { useContext, useState } from "react";
import { Context } from "./Context";

export default function Simon() {

  const { value6 } = useContext(Context);
  const [currentView, setCurrentView] = value6;
  const [inGame, setInGame] = useState(false);
  const [inMove, setInMove] = useState(false);
  const [movementSimonStack, setMovementSimonStack] = useState([]);
  const [userStackIndex, setUserStackIndex] = useState(0);
  const [movementCounter, setMovementCounter] = useState(0);
  const [simonRoundCounter, setSimonRoundCounter] = useState(0);

  function startGame() {
    setInGame(true);
    setInMove(false);
    setMovementSimonStack([]);
    setUserStackIndex(0);
    setMovementCounter(0);

    setTimeout(simonMovement, 1000);
  }

  function simonMovement() {
    let randomColor = Math.floor(Math.random() * 4); // rng [0,3]

    switch (randomColor) {
      case 0:
        setMovementSimonStack((prevMovementSimonStack) => [...prevMovementSimonStack, "yellow"]);
        darkenColor("yellow");
        break;
      case 1:
        setMovementSimonStack((prevMovementSimonStack) => [...prevMovementSimonStack, "blue"]);
        darkenColor("blue");
        break;
      case 2:
        setMovementSimonStack((prevMovementSimonStack) => [...prevMovementSimonStack, "red"]);
        darkenColor("red");
        break;
      case 3:
        setMovementSimonStack((prevMovementSimonStack) => [...prevMovementSimonStack, "green"]);
        darkenColor("green");
        break;
    }

    setMovementCounter((prev) => prev + 1);
    setUserStackIndex(0);
    setInMove(false);
    setSimonRoundCounter(simonRoundCounter + 1);
  }

  function printPrevStack() {

    setInMove(true);

    // Print all the previous simon movements
    for (let i = 0; i < movementSimonStack.length; i++) {
      setTimeout(() => darkenColor(movementSimonStack[i]), (i + 1) * 1000);
    }

    // Finally make simon move
    setTimeout(simonMovement, (movementSimonStack.length + 1) * 1000);
  }


  function darkenColor(color) {
    switch (color) {
      case "yellow":
        document.getElementById("simon_part_yellow").style.backgroundColor = "#887b02";
        setTimeout(() => { document.getElementById("simon_part_yellow").style.backgroundColor = "#ffea37" }, 300);
        break;
      case "blue":
        document.getElementById("simon_part_blue").style.backgroundColor = "#2e268a";
        setTimeout(() => { document.getElementById("simon_part_blue").style.backgroundColor = "#4b3edd"; }, 300);
        break;
      case "red":
        document.getElementById("simon_part_red").style.backgroundColor = "#69241e";
        setTimeout(() => { document.getElementById("simon_part_red").style.backgroundColor = "#dd4b3e"; }, 300);
        break;
      case "green":
        document.getElementById("simon_part_green").style.backgroundColor = "#26752d";
        setTimeout(() => { document.getElementById("simon_part_green").style.backgroundColor = "#3edd4b"; }, 300);
        break;
    }
  }


  function colorChoice(color) {

    if (inGame) {
      if (!inMove) {
        darkenColor(color);

        if (movementSimonStack[userStackIndex] !== color) {
          alert("Sequence NOT correct, you lose");
          setInGame(false);
        }

        if (userStackIndex === movementCounter - 1) {
          printPrevStack();
        } else {
          setUserStackIndex((prev) => prev + 1);
        }
      }
    } else {
      alert("Press PLAY BUTTON to start the game");
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
            <input type="submit" onClick={() => setInGame(false)} className="simon_button" value="	&#9209;" />
            <p>Ronda: {simonRoundCounter} </p>
            <p>Status: {inGame ? "Playing" : "Stopped"} </p>
          </div>
        </div>
      }
    </div>
  );
}