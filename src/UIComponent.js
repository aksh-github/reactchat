import "./App.css";
import React, { useState, useEffect, Component } from "react";
import { inject, xml2json } from "./uiLib/util";
import { UIBuilder } from "./uiLib/UIBuilder";
import { GlobalProvider } from "./uiLib/GlobalContext";
import { useNavigate, useLocation } from "react-router-dom";

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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(msgs);
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");

  let navigate = useNavigate();

  const _data = {
    intro: {
      user: user,
      room,
      chatBtnFlag: user.length < 4 || room.length < 4,
      tpd: " col ",
    },
    main: {
      message: message,
      messages: messages,
      sendBtnFlag: message || message.length < 1,
    },
  };
  const [Ui, setUi] = useState(null);

  useEffect(() => {
    const res = require(`./ui/${routeData[path].jsonKey}`);
    setUi(res);
  }, [path]);

  const buttonClicked = (e) => {
    // console.log(e);

    // console.log(inject("", _data));

    switch (e.target?.name) {
      case "btnGo":
        // if (user.length < 4 || room.length < 4) {
        //   console.log("> 4 reqd");
        //   return;
        // }

        console.log("processed");

        navigate("/room", { replace: true });

        break;
    }
  };

  const textChanged = (e) => {
    // console.log(e);

    switch (e.target?.name) {
      case "txtmsg":
        // console.log("change in username");
        setMessage(e.target.value);
        break;
      case "txtuser":
        // console.log("change in username");
        setUser(e.target.value);
        break;
      case "txtroom":
        // console.log("change in roomname");
        setRoom(e.target.value);
        break;
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
