import React, { useEffect, useRef } from "react";
import { UserComponent } from "../UserComponent";
import { NavigationBar, Loading } from "../_components";
import { userActions } from "../../_actions";
import { Confetti, Tickerinner, Fire } from "../event_anim";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { store } from "../../_helpers";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

var loadStage = 0;
function StreamPage(settings) {
  const [beamChatOn, setBeamChat] = React.useState(false);
  const [twitchChatOn, setTwitchChat] = React.useState(true);
  const [showPopup, setIsOpen] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [isLoading, setLoadState] = React.useState(true);
  const [loadStop, preLoadStop] = React.useState(false);
  const [forceReload, setForceReload] = React.useState(false);
  const [streamName, setStreamName] = React.useState("");
  const [chatLink, setChatLink] = React.useState(
    "https://www.twitch.tv/embed/jerma985/chat?parent=localhost"
  );
  var addListener = function (e, str, func) {
    if (e.addEventListener) {
      e.addEventListener(str, func, false);
    } else if (e.attachEvent) {
      e.attachEvent("on" + str, func);
    }
  };

  function handleClick(button) {
    if (beamChatOn && button != "BeamChat") {
      setIsOpen(false);
      setBeamChat(!beamChatOn);
      setTwitchChat(!twitchChatOn);
    } else if (twitchChatOn && button != "Twitch") {
      setIsOpen(false);
      setBeamChat(!beamChatOn);
      setTwitchChat(!twitchChatOn);
    }
  }

  //opens login menu
  function togglePopup() {
    if (showPopup) {
      setIsOpen(false);
      //opens the login menu again after page rerender
      setTimeout(() => {
        setIsOpen(true);
      }, 50);
      return isLoggedIn;
    }
    setIsOpen(true);
  }

  getChannel();
  async function getChannel() {
    let channel = await userActions.reqSettings().then((settings) => {
      setStreamName(settings[1].twitchName);
      setChatLink(
        "https://www.twitch.tv/embed/" +
          settings[1].twitchName +
          "/chat?parent=localhost"
      );
      //Intialize Embedded Twitch Player
      var options = {
        width: document.getElementById("twitch-player").offsetWidth,
        height: document.getElementById("twitch-player").offsetHeight,
        channel: settings[1].twitchName,
        // Only needed if this page is going to be embedded on other websites
        parent: [],
      };
      if (
        document.readyState != "complete" ||
        document.querySelector("#SamplePlayerDivID").childNodes.length <= 0
      ) {
        var player = new Twitch.Player("SamplePlayerDivID", options);
        player.setVolume(0.5);
      }

      addListener(window, "load", loadStopper);
      var iframe = document.querySelector("#twitch-chat-embed");
      addListener(iframe, "load", loadStopper);
    });
  }

  useEffect(() => {
    //reset persistant BeamChat variables after page mounts
    lineNumber = 0;
    typeWriteTimeOut = null;
    eventInitCheck = 0;
    codexInitCheck = 0;
    eventInfo = null;
    eventList = [0];
    let eventStatus = userActions.notifyListener();
    console.log(eventStatus);
    //Check if user is logged in
    if (localStorage.getItem("user")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [isLoading]);

  function loadStopper() {
    setTimeout(() => {
      if (document.readyState == "complete") {
        preLoadStop(true);
        setTimeout(() => {
          setLoadState(false);
        }, 800);
      } else loadStopper();
    }, 500);
  }

  return (
    <>
      {isLoading ? <Loading isLoading={isLoading} /> : ""}

      <div id="sub-body" className="col-lg noscroll">
        {
          <NavigationBar
            popupShow={togglePopup}
            loggedIn={isLoggedIn}
            logOut={setLoggedIn}
            style={
              isLoading
                ? "position-relative "
                : "position-relative slideInDown fast first-load "
            }
          />
        }
        <div className="row h-100 d-flex flex-nowrap">
          {<Confetti />}
          {<Fire />}
          <div className="juicetime-column"></div>
          <div
            className={
              isLoading
                ? "player-container pre-load-bottom"
                : "player-container bounceInUp normal"
            }
          >
            <div id="twitch-player">
              <div id="SamplePlayerDivID"></div>
            </div>
            <div className="ticker-outer">
              <div className="ticker-wrap">
                {<Tickerinner forceReload={() => setForceReload} />}
              </div>
            </div>
          </div>
          <div
            className={
              isLoading
                ? "chat-column pre-load-right"
                : "chat-column bounceInRight normal"
            }
          >
            <div className="chat-toggle">
              <a
                onClick={() => handleClick("Twitch")}
                className={
                  twitchChatOn
                    ? "pressed d-flex w-50 h-100"
                    : "notPressed d-flex w-50 h-100"
                }
              >
                <span className="m-auto">Twitch</span>
              </a>
              <a
                onClick={() => handleClick("BeamChat")}
                className={
                  beamChatOn
                    ? "pressed d-flex w-50 h-100"
                    : "notPressed d-flex w-50 h-100"
                }
              >
                <span className="m-auto">BeamChat</span>
              </a>
            </div>
            <div
              className={twitchChatOn ? "twitch-chat" : "twitch-chat d-none"}
            >
              <iframe
                frameBorder="0"
                id="twitch-chat-embed"
                src={chatLink}
              ></iframe>
            </div>
            {beamChatOn ? <BeamChat isOpen={beamChatOn} /> : ""}
          </div>
        </div>
        {
          <UserComponent
            setPopup={setIsOpen}
            show={showPopup}
            logIn={setLoggedIn}
          />
        }
      </div>
    </>
  );
}

//variables that persist when BeamChat is hidden
var lineNumber = 0;
//var currentMenu = "Main";
var typeWriteTimeOut = null;
var eventInitCheck = 0;
var codexInitCheck = 0;
var eventInfo = null;
var eventList = [0];
var menuPersist = "Main";

function BeamChat(settings) {
  var commandInput = null;
  var isTyping = null;
  var dataText = null;
  var confirmState = false;
  let eventCost;
  let eventName;
  //const callback = useRef(loginCheck);
  const [forceReload, setForceReload] = React.useState(false);
  const [menuInit, setMenuInit] = React.useState(false);
  const [currentMenu, setCurrentMenu] = React.useState(menuPersist);
  const userState = store.getState().authentication;

  var eventCommands = [
    {
      name: "buy",
      function: buy,
    },
    {
      name: "back",
      function: beamChatStart,
    },
  ];
  var codexCommands = [
    {
      name: "back",
      function: beamChatStart,
    },
  ];

  var mainCommands = [
    {
      name: "events",
      function: eventsInit,
    },
    {
      name: "codex",
      function: codex,
    },
    {
      name: "leaderboard",
      function: leaderboard,
    },
  ];

  useEffect(() => {
    if (!settings.isOpen && document.getElementById("line0").innerHTML != "") {
      beamChatClear();
    } else if (settings.isOpen) {
      init();
    }

    subscribe();
  }, [currentMenu, forceReload]);

  function select() {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user")).points;
    }
  }

  let currentUser;

  //Checks for changes in player data
  //So that the juice points are refreshed after being spent
  function handleChange() {
    let previousUser = currentUser;
    currentUser = select();

    if (previousUser && previousUser !== currentUser) {
      toggleReload();
    }
  }

  const subscribe = () => store.subscribe(handleChange);

  function init() {
    commandBoxAutoSize();

    if (document.querySelector("#line0").innerHTML == "") {
      lineNumber = 0;
    }

    menuRoutes();
  }

  function menuRoutes() {
    var string = "Hello! Please Login To Use BeamChat.";
    if (!userState.loggedIn) {
      if (document.getElementById("line0").innerHTML != string) {
        beamChatClear();
        writeText(string);
        return;
      }
    }
    //document.querySelector(".menu-title").firstChild.innerHTML = `${currentMenu} Menu`;
    switch (currentMenu) {
      case "Main":
        beamChatStart();
        break;
      case "Events":
        eventsInit();
        break;
      case "Codex":
        codex();
        break;
    }
  }

  function menuTitle() {
    return `${currentMenu} Menu`;
  }

  function enterButtonHandler(event) {
    if (event.charCode == 13) {
      if (userState.loggedIn) {
        event.preventDefault();
        processCommand();
      } else {
        beamChatClear();
        writeText("Please Login To Use Beam Chat Commands.");
        document.getElementById("command-box").value = "";
      }
    }
  }

  function commandBoxAutoSize() {
    var commandBox = document.getElementById("command-box");
    commandBox.style.height = commandBox.scrollHeight + "px";
    commandBox.style.overflowY = "hidden";

    commandBox.addEventListener("input", (e) => OnInput(e), false);
  }

  function OnInput(event) {
    for (let i = 0; i < 15; i++)
      event.target.style.height = event.target.scrollHeight + "px";
  }

  function processCommand() {
    if (isTyping) {
      typeWriteCancel();
    }
    var isValid = false;
    commandInput = document.getElementById("command-box").value;
    //Wipe command input textarea
    document.getElementById("command-box").value = "";
    // Create args list by splitting the command input like,
    //("command, argument, argument")
    var args = commandInput.split(" ");
    var cmd = args[0];
    //removes the command and leaves the argument
    args.shift();

    //if we're in the main menu, check the mainCommands for a match to the input
    if (currentMenu == "Main") {
      for (var i = 0; i < mainCommands.length; i++) {
        if (cmd.toLowerCase() === mainCommands[i].name.toLowerCase()) {
          if (mainCommands[i].name == "events") {
            menuPersist = "Events";
            setCurrentMenu("Events");
          } else if (mainCommands[i].name == "codex") {
            menuPersist = "Codex";
            setCurrentMenu("Codex");
          } else {
            eventCommands[i].function(args);
          }
          isValid = true;
          break;
        }
      }
    }

    if (currentMenu == "Events") {
      for (i = 0; i < eventCommands.length; i++) {
        if (cmd.toLowerCase() === eventCommands[i].name.toLowerCase()) {
          if (eventCommands[i].name == "back") {
            menuPersist = "Main";
            setCurrentMenu("Main");
          } else {
            eventCommands[i].function(args);
          }
          isValid = true;
          break;
        }
      }
    }

    if (currentMenu == "Codex") {
      for (i = 0; i < codexCommands.length; i++) {
        if (cmd.toLowerCase() === codexCommands[i].name.toLowerCase()) {
          if (codexCommands[i].name == "back") {
            menuPersist = "Main";
            setCurrentMenu("Main");
          } else {
            codexCommands[i].function(args);
          }
          isValid = true;
          break;
        }
      }
    }

    if (confirmState) {
      if (cmd.toLowerCase() === "yes" || cmd === "y") {
        confirmState = false;
        runEvent(eventName);
        userActions.updateLocalUser();
        toggleReload();
        return;
      } else if (cmd.toLowerCase() == "no" || cmd == "n") {
        confirmState = false;
        writeText("Purchase Aborted");
        return;
      } else {
        buyConfirmation();
        return;
      }
    }

    //catches invalid commands
    if (!isValid) {
      isTyping = true;

      if (commandInput.trim().length > 0)
        //when invalid input has letters
        writeText("'" + commandInput + "' is not a valid command.");
      //when invalid input is blank
      else writeText("Please enter a command.");
    }
  }

  function beamChatStart() {
    isTyping = true;
    console.log("Main Menu Starting");
    //check if the first line is clear
    //to detect if the display still has content
    // and clear display if it does
    if (document.getElementById("line0").innerHTML != "") {
      beamChatClear();
    }
    dataText = [
      "-Welcome to the JuiceStream Panel!",
      "-Enter 'events' to boot up the Event Menu.",
      "-Enter 'codex' to open your codex.",
      "-Enter 'leaderboard' to see who currently has the most juice.",
    ];

    // start the text animation
    StartTextAnimation(0);
  }

  function eventsInit() {
    if (eventInitCheck == 1) {
      events();
      return;
    }
    eventInitCheck = 1;
    eventInfo = [];
    userActions.getEvents().then((response) => {
      for (let i = 0; i < response.length; i++) {
        eventInfo[i] = response[i];
        eventList[i] =
          eventInfo[i].name + " - " + eventInfo[i].cost + " Gallons of Juice";
      }
      events();
    });
  }

  function events() {
    if (document.getElementById("line0").innerHTML != "") {
      beamChatClear();
    }

    console.log("Events Menu Loaded");
    dataText = [
      "-Welcome to the Events Menu!",
      "-Here is your list of available events and their prices.",
      "-Enter 'buy (event)' to purchase an event.",
      "-Enter 'back' to return to the main menu.",
    ];
    dataText = insertArrayAt(dataText, 2, eventList);
    //will eventually pull events based on rank from backend
    StartTextAnimation(0);
  }

  function insertArrayAt(array, index, arrayToInsert) {
    Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
    return array;
  }

  function writeText(string) {
    isTyping = true;
    typeWriter(string, 0, function () {
      autoScroll();
      //console.log("wrote " + string);
    });
  }

  // type one text in the typwriter
  // keeps calling itself until the text is finished
  function typeWriter(text, i, fnCallback) {
    // check if text isn't finished yet
    if (i < text.length) {
      if (!isTyping) {
        return;
      }

      //currently printed text on line
      var currentString = text.substring(0, i);
      //puts the next character in text into a variable
      var nextChar = text.substring(0, i + 1);
      nextChar = nextChar.replace(currentString, "");

      //runs colorText at each space in case a word needs to be colored on the fly
      if (currentString.substring(currentString.length - 1) == " ") {
        colorText(lineNumber);
      }
      //deletes the caret before adding nextChar to avoid having carets between each character
      document.querySelector("#line" + lineNumber).innerHTML = document
        .querySelector("#line" + lineNumber)
        .innerHTML.replace(
          '<span class="caret" aria-hidden="true"></span>',
          ""
        );
      // add next character to h1
      document.querySelector("#line" + lineNumber).innerHTML =
        document.querySelector("#line" + lineNumber).innerHTML +
        nextChar +
        "<span class='caret' aria-hidden='true'></span>";
      if (isTyping) {
        //clears timeout if there is another typewrite request
        if (typeWriteTimeOut != null) clearTimeout(typeWriteTimeOut);
        // wait for a while and call this function again for next character
        typeWriteTimeOut = setTimeout(() => {
          typeWriter(text, i + 1, fnCallback);
        }, 8);
      }
    } // text finished, call callback if there is a callback function
    else if (typeof fnCallback == "function" && settings.isOpen) {
      document.querySelector(".caret").remove();
      lineNumber = lineNumber + 1;
      var newLine = "<h1 id='line" + lineNumber + "' class='text-line'> </h1>";
      //add new line
      document.querySelector("#display-container").innerHTML =
        document.querySelector("#display-container").innerHTML + newLine;
      // run callback after timeout
      typeWriteTimeOut = setTimeout(fnCallback, 40);
    }
  }

  //function that runs when typewriter
  //is interrupted by user action
  function typeWriteCancel() {
    //clears timeout to stop the typewriter function from firing again
    clearTimeout(typeWriteTimeOut);
    isTyping = false;
    //clears display
    if (document.getElementById("line0").innerHTML != "") {
      beamChatClear();
    }
    //prints out full menu without animation
    for (const line of dataText) {
      document.querySelector("#line" + lineNumber).innerHTML = line;
      colorTextAll(lineNumber);
      lineNumber = lineNumber + 1;
      var newLine = "<h1 id='line" + lineNumber + "' class='text-line'> </h1>";
      document.querySelector("#display-container").innerHTML =
        document.querySelector("#display-container").innerHTML + newLine;
    }
  }

  function StartTextAnimation(i) {
    //check if we've reached the end of dataText
    //add caret to end of current line
    if (typeof dataText[i] == "undefined") {
      isTyping = false;
      document.getElementById("line" + lineNumber).innerHTML =
        document.getElementById("line" + lineNumber).innerHTML +
        "<span class='caret' aria-hidden='true'></span>";
      return;
    }

    //stop typing if beamchat is closed
    if (i < dataText[i].length) {
      if (!settings.isOpen) {
        beamChatClear();
        i = 0;
        return;
      } else if (
        currentMenu != "Main" &&
        document.getElementById("line0").innerHTML === ""
      ) {
        isTyping = true;
      }
    }
    // text exists! start typewriter animation
    typeWriter(dataText[i], 0, function () {
      if (!isTyping) {
        return;
      }
      // after callback (and whole line has been animated), itereate i and start next line
      //callback also returns if error occurs
      StartTextAnimation(i + 1);
    });
  }

  function colorTextAll(line) {
    //colors certain words based on the characters around it
    var lineText = document.querySelector("#line" + line).innerHTML;
    var textArray = lineText.split(" ");

    for (var i = 0; i < textArray.length; i++) {
      //colors Confetti Event blue
      if (textArray[i].includes("Confetti")) {
        lineText = lineText.replace(
          textArray[i],
          '<span style="color: #5fdaff;">' + textArray[i] + "</span>"
        );
      }
      //colors Fire Event orange
      if (textArray[i].includes("Fire")) {
        lineText = lineText.replace(
          textArray[i],
          '<span style="color: #ff9900;">' + textArray[i] + "</span>"
        );
      }
      //colors the commands green
      if (textArray[i].includes("'")) {
        lineText = lineText.replace(
          textArray[i],
          '<span style="color: #b8ff0b;">' + textArray[i] + "</span>"
        );
      }
    }
    document.querySelector("#line" + line).innerHTML = lineText;
  }

  function colorText(line) {
    //this function breaks up all the text before the space
    //after this, it selects the last word in the new array
    //it then checks to see if that word matches one of the color cases
    var lineText = document.querySelector("#line" + line).innerHTML;
    lineText = lineText.replace(
      '<span class="caret" aria-hidden="true"></span>',
      ""
    );
    var textArray = lineText.split(" ");
    textArray = textArray.filter((item) => item);

    //colors Confetti Event blue
    if (textArray[textArray.length - 1].includes("Confetti")) {
      lineText = lineText.replace(
        textArray[textArray.length - 1],
        '<span style="color: #5fdaff;">' +
          textArray[textArray.length - 1] +
          "</span>"
      );
    }
    //colors Fire Event orange
    if (textArray[textArray.length - 1].includes("Fire")) {
      lineText = lineText.replace(
        textArray[textArray.length - 1],
        '<span style="color: #ff9900;">' +
          textArray[textArray.length - 1] +
          "</span>"
      );
    }
    //colors the commands green
    if (textArray[textArray.length - 1].includes("'")) {
      lineText = lineText.replace(
        textArray[textArray.length - 1],
        '<span style="color: #b8ff0b;">' +
          textArray[textArray.length - 1] +
          "</span>"
      );
    }
    document.querySelector("#line" + line).innerHTML = lineText;
  }

  function beamChatClear() {
    for (var i = lineNumber; i >= 1; i--) {
      document.querySelector("#line" + lineNumber).remove();
      lineNumber = lineNumber - 1;
    }
    document.getElementById("line0").innerHTML = "";
    lineNumber = 0;
  }

  function buy(args) {
    // event holds the first argument, which is the event name
    eventName = args[0];
    var eventValid = false;
    console.log(args);
    for (var i = 0; i < eventInfo.length; i++) {
      if (eventName.toUpperCase() == eventInfo[i].name.toUpperCase()) {
        eventCost = eventInfo[i].cost;
        eventName = eventInfo[i].name;
        checkBalance(eventName);
        eventValid = true;
        break;
      }
    }
    if (!eventValid) {
      writeText("You do not have an event called '" + eventName + "'");
    }
  }

  function buyConfirmation() {
    writeText(
      "Spill " +
        eventCost +
        " Gallons of Juice for " +
        eventName +
        "? " +
        "Enter 'Yes' Or 'No'."
    );
    confirmState = true;
  }

  function checkBalance(event) {
    userActions.checkBalance(event).then((isEnough) => {
      if (isEnough) {
        buyConfirmation();
      } else
        writeText("You do not have enough Juice for the " + event + " event");
    });
  }

  function runEvent(event) {
    userActions.runEvent(event).then((active) => {
      if (active.status) {
        console.log("Event Added to Queue Succesfully");
        return;
      }
      console.log("Event Run failed");
    });
  }

  function codex() {
    if (document.getElementById("line0").innerHTML != "") {
      beamChatClear();
    }
    if (codexInitCheck == 0) {
      toggleReload();
      codexInitCheck = 1;
    }
  }

  function toggleReload() {
    setForceReload(!forceReload);
  }

  function leaderboard() {}

  function autoScroll() {
    var displayContainer = document.querySelector("#display-container");
    displayContainer.scrollTop = displayContainer.scrollHeight;
  }

  return (
    <>
      <div
        id="beamChat"
        className={settings.isOpen ? "beam-chat" : "beam-chat  d-none"}
      >
        <div id="beam-container">
          <div id="overlay"> </div>
          <div id="display-container">
            <div className="menu-title">
              <h2>{menuTitle()}</h2>
            </div>
            <Codex
              forceUpdate={() => toggleReload}
              open={currentMenu != "Codex" ? false : true}
              clear={beamChatClear}
            />
            <h1 id="line0" className="text-line"></h1>
          </div>
          <div id="input-container">
            <textarea
              type="text"
              onKeyPress={enterButtonHandler}
              onChange={autoScroll}
              name="command-box"
              id="command-box"
              placeholder="Type Your Command"
            ></textarea>
            <div className="input-footer">
              <div className="juice-amount_chat">
                <FontAwesomeIcon
                  className="juice-icon-small"
                  style={{ position: "relative" }}
                  icon="tint"
                ></FontAwesomeIcon>
                {userState.loggedIn ? userState.user.points : "0"} Gallons
              </div>
              <button
                className="button"
                onClick={processCommand}
                role="button"
                id="command-button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Codex(settings) {
  var forward = new Audio(
    "https://sounds.pond5.com/single-click-20-sound-effect-000688351_nw_prev.m4a"
  ); // buffers automatically when created
  var backward = new Audio(
    "https://sounds.pond5.com/single-click-15-sound-effect-000688356_nw_prev.m4a"
  ); // buffers automatically when created
  var unlock = new Audio(
    "https://sounds.pond5.com/lock-padlock-sound-effect-008863055_nw_prev.m4a"
  );
  var reset = new Audio(
    "https://sounds.pond5.com/winding-watch-0001-sound-effect-037821417_nw_prev.m4a"
  );
  var clickIndex = 0;
  var oldRotation = 0;
  //forward backward forward
  //first and third number must be higher than second
  var combo = [0, 0, 0];
  var step = 1;
  var errorCount = 0;
  if (!settings.open) {
    return <div></div>;
  }

  //Generate Combination
  combo[0] = getRandomInt(5, 25);
  combo[2] = getRandomInt(5, 25);
  if (combo[0] > combo[2]) {
    combo[1] = getRandomInt(2, combo[2]);
  } else {
    combo[1] = getRandomInt(2, combo[0]);
  }
  console.log(combo);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var final = Math.floor(Math.random() * (max - min) + min);
    return final;
  }

  useEffect(() => {
    if (settings.open) {
      //settings.forceUpdate();
    }
    const draggable = Draggable.create("#knob", {
      type: "rotation",
      inertia: false,
      dragResistance: 0.1,
      onDrag: function () {
        //console.log(this.rotation);
        if (!document.querySelector(".gear-container")) {
          return;
        }
        document.querySelector("#back-gear").style.transform =
          "rotate(" + this.rotation * 0.25 + "deg)";
        document.querySelector("#front-gear").style.transform =
          "rotate(" + this.rotation * 2.5 + "deg)";
        document.addEventListener("visibilitychange", () =>
          this.endDrag(this.pointerEvent)
        );

        if (
          this.rotation > clickIndex + 30 ||
          this.rotation < clickIndex - 30
        ) {
          if (this.rotation > oldRotation) {
            forward.play();
            clickIndex = clickIndex + 30;
            console.log(clickIndex / 30);
            if (step == 1 && errorCount > 0) {
              errorCount = errorCount - 1;
            }
            if (
              (step == 1 && clickIndex / 30 > clickIndex / 30 + errorCount) ||
              (step == 3 && clickIndex / 30 > clickIndex / 30 + errorCount)
            ) {
              console.log(clickIndex / 30);
              errorCount = 0;
            }
            if (step == 1 && clickIndex / 30 == combo[0]) {
              step = 2;
              console.log("Success! Switching to step " + step);
            } else if (step == 3 && clickIndex / 30 == combo[2]) {
              console.log("Unlock!");
              unlock.play();
              step = 1;
              clickIndex = 0;
              gsap.to("#knob", { rotation: 0, duration: 1 });
              this.disable();
              setTimeout(() => {
                this.enable();
              }, [100]);
            } else if (step == 2) {
              errorCount = errorCount + 1;
              console.log("Error: " + errorCount);
              if (errorCount == 3) {
                console.log("Clicks = " + clickIndex / 3 + " Resetting");
                step = 1;
                clickIndex = 0;
                errorCount = 0;
                reset.play();
                gsap.to("#knob", {
                  rotation: 0,
                  duration: 1,
                  onComplete: () => {
                    setTimeout(() => {
                      reset.pause();
                      reset.currentTime = 0;
                    }, [20]);
                  },
                });
                this.disable();
                setTimeout(() => {
                  this.enable();
                }, [100]);
              }
            }
          } else {
            clickIndex = clickIndex - 30;
            backward.play();
            if (step == 2 && clickIndex / 30 < combo[1] + 3) {
              errorCount = 0;
            }
            if (step == 2 && clickIndex / 30 == combo[1]) {
              step = 3;
              console.log("Success! Switching to step " + step);
            } else if (step == 1 || step == 3) {
              errorCount = errorCount + 1;
              console.log("Error: " + errorCount);
              if (errorCount == 3) {
                console.log("Clicks = " + clickIndex / 3 + " Resetting");
                step = 1;
                clickIndex = 0;
                errorCount = 0;
                reset.play();
                gsap.to("#knob", {
                  rotation: 0,
                  duration: 1,
                  onComplete: () => {
                    setTimeout(() => {
                      reset.pause();
                      reset.currentTime = 0;
                    }, [20]);
                  },
                });
                this.disable();
                setTimeout(() => {
                  this.enable();
                }, [100]);
              }
            }
          }
          oldRotation = this.rotation;
        }
      },
    });
  });

  return (
    <div className="gear-container">
      <img
        id="back-gear"
        src="https://imgur.com/fvceanT.png"
        width="300"
        height="300"
      />
      <img
        id="knob"
        src="https://imgur.com/j4Ka5cw.png"
        width="300"
        height="300"
      />
      <img
        id="front-gear"
        src="https://imgur.com/JH1HTZE.png"
        width="300"
        height="300"
      />
    </div>
  );
}

export default StreamPage;
