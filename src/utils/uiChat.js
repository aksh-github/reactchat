import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { encryptText, decryptText } from "./utils";
import useStore from "./store";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
// const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = ({ user, room }) => {
  // const [messages, setMessages] = useState([]);
  const {
    // user,
    // room,
    // setRoom,
    // setUser,
    message,
    setMessage,
    messages,
    setMessages,
    publicKey,
    setPublickey,
  } = useStore();

  const socketRef = useRef();

  useEffect(() => {
    // socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
    //   query: { roomId },
    // });
    if (user && room)
      socketRef.current = socketIOClient(
        // socket = io(`https://crawler-app.herokuapp.com`, {
        `http://${window.location.hostname}:7000`,
        {
          query: { user: user, room: room },
        }
      );

    // imp step reset msgs
    // setMessages([]);

    socketRef?.current?.on("_", (data) => {
      setPublickey(data.publicKey);
    });

    return () => {
      console.log("conn cleaned");
      socketRef?.current?.disconnect();
    };
  }, [user, room]);

  socketRef?.current?.on("new_message", (data) => {
    const decrypted = decryptText(data, publicKey) || "";
    let _message = null;
    try {
      _message = JSON.parse(decrypted);
    } catch (err) {
      console.log("Error parsing the data");
      console.log("===========================");
      return;
    }

    // console.log(decrypted);
    setMessages([...messages, _message]);
    // setTo(message.from);
  });

  const sendMessage = () => {
    const encrypted = encryptText(
      JSON.stringify({
        // from: me(),
        from: user,
        to: null,
        toRoom: room,
        user: user,
        message: message,
      }),
      publicKey
    );
    // console.log(encrypted);

    socketRef.current?.emit("new_message", encrypted);
    setMessages([...messages, { from: "me", message: message }]);
    setMessage("");
  };

  return { sendMessage };
};

export default useChat;
