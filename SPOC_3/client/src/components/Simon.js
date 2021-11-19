import React, { useContext, useState } from "react";
import { Context } from "./Context";

export default function Simon() {

  const { value6 } = useContext(Context);
  const [currentView, setCurrentView] = value6;

  return (
    <div>
      {currentView === "simon" &&
        <div id="simon_game_container">
          <div id="upper_simon">
            <div id="simon_part_yellow"></div>
            <div id="simon_part_blue"></div>
          </div>
          <div id="lower_simon">
            <div id="simon_part_red"></div>
            <div id="simon_part_green"></div>
          </div>
          <div id="simon_game_info">
            <input type="submit" onClick={() => alert("play")} className="simon_button" value="&#9654;" />
            <input type="submit" onClick={() => alert("pause")} className="simon_button" value="&#9208;" />
          </div>
        </div>
      }
    </div>
  );
}