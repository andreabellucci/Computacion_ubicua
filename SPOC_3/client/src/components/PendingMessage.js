import React, { useContext, useState } from "react";
import { Context } from "./Context";

export default function PendingMessage() {

    const { value6, value10 } = useContext(Context);
    const [currentView, setCurrentView] = value6;
    const [pendingSendingMessage, setPendingSendingMessage] = value10;


    return (
        <div>
            {(currentView === "global" || currentView === "private") && pendingSendingMessage &&
                <div>
                    <div id="text_message_header_pending">
                        <p id="text_message_username_pending">{pendingSendingMessage.from}</p>
                        <p id="text_messagen_datetime_pending">{pendingSendingMessage.datetime}</p>
                    </div>
                    <div id="text_message_content_pending"><p>{pendingSendingMessage.text}</p></div>
                </div>
            }
        </div>
    );
}