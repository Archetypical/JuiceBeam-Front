import React, { useEffect } from "react";

var text = "Welcome to Juicebeam!";

function tickerText(name, event) {
  console.log(event, name);
  if (name != null && event != null) {
    if (name != {} && event != {}) {
      text = name + " activated the " + event + " event!";
      //document.querySelector("#TickerText").innerHTML = text;
    }
  } else {
    setTimeout(() => {
      text = "Welcome to JuiceBeam!";
    }, 2000);
    //document.querySelector("#TickerText").innerHTML = text;
  }
}

function Tickerinner() {
  const [tickerState, setTickerState] = React.useState(false);
  var oldText = text;

  // checks text variable every second to see if it has changed
  // when it does change the ticker is reloaded by the ticker state
  function tickerHeartBeat() {
    if (text != oldText) {
      setTickerState(!tickerState);
    }
    setTimeout(() => {
      tickerHeartBeat();
    }, 1000);
  }

  function Tickershow() {
    return text;
  }

  useEffect(() => {
    console.log("Reloaded Ticker");
    tickerHeartBeat();
  }, [text]);

  return (
    <>
      <div className="ticker-title">
        <span>JuiceBeam</span>
        <span>JuiceBeam</span>
        <span>JuiceBeam</span>
        <span>JuiceBeam</span>
        <span>JuiceBeam</span>
        <span>JuiceBeam</span>
        <span>JuiceBeam</span>
        <span>JuiceBeam</span>
        <span>JuiceBeam</span>
      </div>
      <div className="ticker">
        <span id="TickerText">{<Tickershow />}</span>
      </div>
    </>
  );
}

export { Tickerinner, tickerText };
