import "./App.css";
import React, { useState, useEffect, Component } from "react";
// import { inject, xml2json } from "./uiLib/util";
import { UIBuilder } from "./uiLib/UIBuilder";
import { GlobalProvider } from "./uiLib/GlobalContext";
import { useNavigate, useLocation } from "react-router-dom";
import useChat from "./utils/uiChat";
import useStore from "./utils/store";

const routeData = {
  "/": {
    dataKey: "intro",
    xmlKey: "chat-intro.xml",
    jsonKey: "chatintro.json",
  },
  "/room": {
    dataKey: "main",
    xmlKey: "chat-main.xml",
    jsonKey: "chatmain.json",
  },
};

const msgs = [
  {
    message: "hi",
    from: "me",
  },
  {
    message: "hieee",
    from: "jay4",
  },
  {
    message: "what doing",
    from: "me",
  },
  {
    message: "hi",
    from: "jay4",
  },
  {
    message: "hi",
    from: "me",
  },
  {
    message: "hi",
    from: "me",
  },
  {
    message: "hi",
    from: "jay4",
  },
  {
    message: "hi",
    from: "me",
  },
  {
    message: "hi",
    from: "me",
  },
  {
    message: "this is some big message",
    from: "jay4",
  },
];

// https://gist.github.com/Nachasic/0431415eec47b4bd090a65bade6e8597

function UIComponent() {
  let location = useLocation();
  // console.log(location);

  const path = location ? location.pathname : "/"; //this will be route

  const { user, room, setRoom, setUser, message, setMessage, messages, isConnected } = useStore();

  let navigate = useNavigate();

  // imp step

  if ((!user || !room) && path === "/room") {
    navigate("/");
  }

  const { sendMessage } = useChat({ user, room });

  const _data = {
    intro: {
      user: user,
      room,
      chatBtnFlag: user.length < 4 || room.length < 4,
      tpd: " col ",
    },
    main: {
      room,
      message: message,
      messages: messages,
      sendBtnFlag: message?.length < 1 || !isConnected,
      isConnText: isConnected ? ":)" : ":(",
    },
  };
  const [Ui, setUi] = useState(null);

  useEffect(() => {
    return () => {
      console.log("cleanup");
    };
  }, []);

  useEffect(() => {
    const res = require(`./ui/${routeData[path].jsonKey}`);
    setUi(res);
  }, [path]);

  const buttonClicked = (e) => {
    // console.log(e);

    // console.log(inject("", _data));

    switch (e.target?.name) {
      case "btnGo":
        if (user.length < 4 || room.length < 4) {
          console.log("> 4 reqd");
          return;
        }

        console.log("processed");

        navigate("/room");

        break;

      case "goBack":
        navigate(-1);

        break;

      case "sendMessage":
        sendMessage();

        break;
      default:
        console.log("No handler for ", e.target?.name);
    }
  };

  const textChanged = (e) => {
    // console.log(e);
    let txt = e.target.value;

    switch (e.target?.name) {
      case "txtmsg":
        // console.log("change in username");
        setMessage(txt);
        break;
      case "txtuser":
        // console.log("change in username");
        setUser(txt?.trim());
        break;
      case "txtroom":
        setRoom(txt?.trim());
        break;
      default:
        console.log("No handler for ", e.target?.name);
    }
  };

  return (
    <div className="App2">
      <GlobalProvider
        state={{
          data: _data[routeData[path].dataKey],
          fns: { buttonClicked, textChanged },
        }}
      >
        {Ui ? <UIBuilder Ui={Ui} /> : "Loading..."}
      </GlobalProvider>
    </div>
  );
}

export default UIComponent;
