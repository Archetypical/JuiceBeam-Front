import React, { useEffect, useLayoutEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserComponent } from "../UserComponent";
import { NavigationBar, Loading } from "../_components";
import Particles from "react-tsparticles";
import tankImage from "../../images/Tank_Ends.webp";
import { userActions } from "../../_actions";
import ReactDOM from "react-dom";
var loadStage = 0;

function HomePage(){
  var canvas, ctx;
  var vertexes = [];
  var diffPt = [];
  var autoDiff = 1000;
  var verNum = 250;
  var canvasW = window.innerWidth + 40;
  var canvasH = window.innerHeight;
  var container;
  var r = document.querySelector(':root');
  var rs = getComputedStyle(r)
  var addListener = function (e, str, func) {
    if (e.addEventListener) {
      e.addEventListener(str, func, false);
    } else if (e.attachEvent) {
      e.attachEvent("on" + str, func);
    }
  };

  function resize() {
    canvasW = document.getElementById("container").offsetWidth + 40;
    canvasH = document.getElementById("container").offsetHeight;
    initCanvas(canvasW, canvasH);
    var cW = canvas.width;
    var cH = canvas.height;
    for (var i = 0; i < verNum; i++)
      vertexes[i] = new Vertex((cW / (verNum - 1)) * i, cH / 2, cH / 2);
    initDiffPt();
    var win_3 = window.innerWidth / 3;
  }
  
  function init() {
    resize();
    var FPS = 30;
    var interval = (1000 / FPS) >> 0;
    var timer = setInterval(update, interval);
    if (window.addEventListener)
      addListener(window, "DOMMouseScroll", wheelHandler);
    addListener(window, "mousewheel", wheelHandler);
    //addListener(window, "resize", resize);

    container.onmousedown = function (e) {
      //div.innerHTML=e.clientX+":"+e.clientY;
      //var mx = document.getElementById("mx");

      //alert(1);
      var mouseX, mouseY;
      var bounds = document.getElementById("container").getBoundingClientRect();

      if (e) {
        mouseX = Math.floor(event.pageX - bounds.left);
        mouseY = Math.floor(event.pageY - bounds.top);
      } else {
        mouseX = event.x + document.body.scrollLeft;
        mouseY = event.y + document.body.scrollTop;
      }

      if (canvasH / 2 - mouseY < 50) {
        //diffPt[150] = autoDiff;
        autoDiff = 1000;
        if (mouseX < canvasW - 2) {
          xx = 1 + Math.floor(((verNum - 2) * mouseX) / canvasW);
          //console.log(mouseX);
          //console.log(xx);
          diffPt[xx] = autoDiff;
        }
      }
    };
  }

  var wheelHandler = function (e) {
    var s = e.detail ? -e.detail : e.wheelDelta;
    s > 0 ? (dd > 15 ? dd-- : (dd = dd)) : dd < 50 ? dd++ : (dd = dd);
  };

  function initDiffPt() {
    for (var i = 0; i < verNum; i++) diffPt[i] = 0;
  }
  var xx = 150;
  var dd = 15;

  function update() {
    //ctx.rect(50,20,280,620);
    //ctx.stroke();
    //ctx.clip();
    //
    ctx.clearRect(0, 0, canvasW, canvasH);
    autoDiff -= autoDiff * 0.9;
    diffPt[xx] = autoDiff;
    //Left side
    //Difference, so that each point is the next solution of the previous point, because the solution from the difference function is a curve, and after each iteration, the result of the curve addition forms a continuous wave
    for (var i = xx - 1; i > 0; i--) {
      var d = xx - i;
      if (d > dd) d = dd;
      diffPt[i] -= (diffPt[i] - diffPt[i + 1]) * (1 - 0.01 * d);
    }
    //Right Side
    for (i = xx + 1; i < verNum; i++) {
      d = i - xx;
      if (d > dd) d = dd;
      diffPt[i] -= (diffPt[i] - diffPt[i - 1]) * (1 - 0.01 * d);
    }

    //Update point Y coordinate
    for (i = 0; i < vertexes.length; i++) {
      vertexes[i].updateY(diffPt[i]);
    }

    draw();
  }
  

  function draw() {
    var color1 = rs.getPropertyValue('--color-main-var-3');
    var color2 = rs.getPropertyValue('--color-text-primary');
    ctx.beginPath();
    ctx.moveTo(0, canvasH);
    ctx.fillStyle = color1;
    ctx.lineTo(vertexes[0].x, vertexes[0].y);
    for (var i = 1; i < vertexes.length; i++) {
      ctx.lineTo(vertexes[i].x, vertexes[i].y);
    }
    ctx.lineTo(canvasW, canvasH);
    ctx.lineTo(0, canvasH);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, canvasH);
    ctx.fillStyle = color2;
    ctx.lineTo(vertexes[0].x + 15, vertexes[0].y + 5);
    for (i = 1; i < vertexes.length; i++) {
      ctx.lineTo(vertexes[i].x + 15, vertexes[i].y + 5);
    }
    ctx.lineTo(canvasW, canvasH);
    ctx.lineTo(0, canvasH);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#fff";
    ctx.fillText(
      " Viscosity: " + (((dd - 15) * 20) / 7).toFixed(2) + "%",
      70,
      canvas.height - 20
    );
  }

  function initCanvas(width, height) {
    canvas = document.getElementById("liquid");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
  }

  function Vertex(x, y, baseY) {
    this.baseY = baseY;
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.targetY = 0;
    this.friction = 0.15;
    this.deceleration = 0.95;
  }

  Vertex.prototype.updateY = function (diffVal) {
    this.targetY = diffVal + this.baseY;
    this.vy += this.targetY - this.y;
    this.y += this.vy * this.friction;
    this.vy *= this.deceleration;
  };

  const [showPopup, setIsOpen] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [isLoading, setLoadState] = React.useState(true);
  const [loadStop, preLoadStop] = React.useState(false);
  const [bubbleState, setBubbleState] = React.useState(true);
  const [forceReload, setForceReload] = useState(false);
  
  function toggleBubble() {
    setBubbleState(!bubbleState);
  }
  function toggleReload() {
    setForceReload(!forceReload);
  }

  function bubbleCheck() {
    var checkValue = JSON.parse(localStorage.getItem("settings"));
    return checkValue.bubbleState;
  }

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

  useLayoutEffect(() => {
    container = document.getElementById("container");
    init();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }

    addListener(window, "load", progressLoadStage);
    
    if (!bubbleCheck()) {
      setBubbleState(false);
    }
    if (!isLoading && document.getElementById("type-text").innerHTML == "" ) {
      var i = 0;
      var txt = "JUICEBEAM!";
      var speed = 100;
      setTimeout(typeWriter, 1000);
      function typeWriter() {
        if (i < txt.length) {
          document.getElementById("type-text").innerHTML += txt.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        }
      }
    }
  }, [isLoading, forceReload]);

  function progressLoadStage(){
    loadStage = loadStage + 1;
  }

  function loadStopper() {
    setTimeout(() => {
      if(document.readyState == "complete"){
        preLoadStop(true);
        setTimeout(() => {
          setLoadState(false);
        }, 200);
      }
      else loadStopper();
    }, 500);
  }


  //<Loading isLoading={isLoading} />

  return (
    <>
      {isLoading ? <Loading isLoading={isLoading} loadStop={loadStop}/> : "" }
      <span id="sub-body" className={isLoading ? "col-lg noscroll" : "col-lg scroll"}>
        {
          <NavigationBar
            logOut={setLoggedIn}
            popupShow={togglePopup}
            loggedIn={isLoggedIn}
            toggleBubble={toggleBubble}
            forceReload={toggleReload}
            style={
              isLoading
                ? "position-fixed "
                : "position-fixed slideInDown fast first-load "
            }
          />
        }
        <div className="row">
          <div className="background-overlay"></div>
          <div className="left-column">
            <span className="header-container">
              <h2
                className={
                  isLoading
                    ? "heading-title-1"
                    : "heading-title-1 slideInLeft fast third-load"
                }
              >
                Welcome to
              </h2>
              <span className="typing-container">
                <span id="type-text" className="heading-title-2"></span>
                <span className="typed-cursor">|</span>
              </span>
              <h2
                className={
                  isLoading
                    ? "heading-title-3"
                    : "heading-title-3 tada fast fourth-load"
                }
              >
                "Where real and unreal is only a matter of perspective."
              </h2>
            </span>
          </div>
          <div className="right-column">
            <div
              className={
                isLoading ? "tank-box" : "tank-box slideInDown fast second-load"
              }
            >
              <img
                className="tank_bottom"
                src={tankImage}
                onLoad={loadStopper}
              ></img>
              <div id="glass"></div>
              <div id="container">
                <canvas id="liquid" width="280" height="340"></canvas>
              </div>
            </div>
          </div>
        </div>
        {!bubbleState ? (
          ""
        ) : (
          <Particles
            id="tsparticles"
            options={{
              particles: {
                number: {
                  value: 6,
                  density: {
                    enable: true,
                    value_area: 800,
                  },
                },
                color: {
                  value: rs.getPropertyValue('--color-text-primary'),
                },
                shape: {
                  type: "circle",
                  stroke: {
                    width: 0,
                    color: "#000",
                  },
                  polygon: {
                    nb_sides: 3,
                  },
                  image: {
                    src: "img/github.svg",
                    width: 100,
                    height: 100,
                  },
                },
                opacity: {
                  value: 1,
                  random: true,
                  anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false,
                  },
                },
                size: {
                  value: 80,
                  random: false,
                  anim: {
                    enable: true,
                    speed: 7,
                    size_min: 40,
                    sync: false,
                  },
                },
                line_linked: {
                  enable: false,
                  distance: 200,
                  color: "#ffffff",
                  opacity: 1,
                  width: 2,
                },
                move: {
                  enable: true,
                  speed: 9,
                  direction: "top",
                  random: false,
                  straight: false,
                  out_mode: "out",
                  bounce: false,
                },
              },
              interactivity: {
                detect_on: "canvas",
                events: {
                  onhover: {
                    enable: true,
                    mode: "repulse",
                  },
                  onclick: {
                    enable: false,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  grab: {
                    distance: 400,
                    line_linked: {
                      opacity: 1,
                    },
                  },
                  bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.6,
                  },
                  push: {
                    particles_nb: 4,
                  },
                  remove: {
                    particles_nb: 4,
                  },
                },
              },
              retina_detect: true,
            }}
          />
        )}
        {
          <UserComponent
            setPopup={setIsOpen}
            show={showPopup}
            logIn={setLoggedIn}
          />
        }
      </span>
    </>
  );
}


export default HomePage;