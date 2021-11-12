import io from "socket.io-client";

// Let and not CONST to make possible its modification on app
export let SOCKET = io("localhost:3001");