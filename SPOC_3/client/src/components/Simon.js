import React, { useContext, useState } from "react";
import { Context } from "./Context";

export default function Simon() {
    return (
        <div>
            <div id="upper_simon">
                <div id="simon_part_yellow"></div>
                <div id="simon_part_blue"></div>
            </div>
            <div id="lower_simon">
                <div id="simon_part_red"></div>
                <div id="simon_part_green"></div>
            </div>
        </div>
    );
}