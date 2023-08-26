import React, { useEffect } from "react";
import { userActions } from "../../../../_actions";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { history } from "../../../../_helpers";

function Profile(settings) {
  var juiceBalance = 0;
  const ranks = [
    {
      rank: "Dreamer",
      cost: "0",
      number: "1",
    },
    {
      rank: "Heartbeat",
      cost: "200",
      number: "2",
    },
    {
      rank: "Insightful",
      cost: "350",
      number: "3",
    },
    {
      rank: "Lucid",
      cost: "400",
      number: "4",
    },
    {
      rank: "Visionary",
      cost: "550",
      number: "5",
    },
    {
      rank: "Enlightened",
      cost: "2000",
      number: "6",
    },
  ];
  var percentage = 0;
  var bar = null;
  var rankNumber = 1;
  var addListener = function (e, str, func) {
    if (e.addEventListener) {
      e.addEventListener(str, func, false);
    } else if (e.attachEvent) {
      e.attachEvent("on" + str, func);
    }
  };
  const [isUpdated, setUpdateStatus] = React.useState(false);
  const [currentBalance, setBalance] = React.useState(0);
  const [isTablet, setTablet] = React.useState(false);
  const user = useSelector(state => state.authentication.user)
  const dispatch = useDispatch();

  if (localStorage.getItem("user")) {
    console.log("Access Granted");
  } else {
    history.push('/');
    return null;
  }

  function updateRank() {
    dispatch(userActions.updateRank(changeLocalUser));
  }

 async function changeLocalUser(){
    const callBack = () => {
      console.log(user);
      let oldBalance = document.querySelector(".juice-amount").innerHTML.replace("<br> Gallons Of Juice", "");
      oldBalance = oldBalance * 1;
      setBalance(oldBalance);
    }
    
    dispatch(userActions.updateLocalUser(callBack))
  }


  async function updateLocalUser(){
    let oldUser = JSON.parse(localStorage.getItem("user"));
    if(!isUpdated){
      dispatch(userActions.updateLocalUser())
        console.log(user);
        setUpdateStatus(true);
        if(oldUser.points != user.points  || oldUser.username != user.username){
          juiceBalance = user.points;
          setUpdateStatus(true);
        }
    }
  }

  function Initialize() {
    juiceBalance = user.points;
    if (currentBalance > 0){
      pointAnimation();
    }
    else emptyPointAnimation();
    for(let i = 0; i + 1 <= ranks.length; i++){
      if(ranks[i].rank == user.rank && i != ranks.length - 1){
        percentage = Math.round((juiceBalance * 100) / ranks[i+1].cost);
        break;
      }
    }
    if (percentage > 100) {
      percentage = 100;
    }
    document.querySelector(".liquid").style.animation = "load 2.5s ease-in";
    update();
  }
  function JuiceLeft(){
    var juiceNeeded;
    for(var i=0; i + 1 <= ranks.length; i++){
      if (ranks[i].rank == user.rank && i != ranks.length - 1){
        juiceNeeded = ranks[i+1].cost - user.points;
        if (juiceNeeded < 0){
          juiceNeeded = 0;
        }
        return juiceNeeded;
      }
    }
    return 0;
  }
  function update() {
    document.querySelector(".tank-amount").innerHTML = percentage + "% Full";
    //document.getElementById("rankTitle").innerHTML = currentRank + " Rank";
    bar.style.setProperty("--progress", percentage + "%");
  }

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function pointAnimation() {
    const obj = document.querySelector(".juice-amount");
    animateValue(obj, currentBalance, juiceBalance, 1900);
  }

  function emptyPointAnimation() {
    const obj = document.querySelector(".juice-amount");
    animateValue(obj, 0, juiceBalance, 1900);
  }

  function Username() {
    return user.username.toUpperCase();
  }
  
  function Rank(){
    return user.rank;
  }

  function textResizer(){
    var resizedText = document.querySelector(".user-greeting");
    var textContainer = document.querySelector("#user-header")
    if (resizedText != null){
      let fontSize = window.getComputedStyle(resizedText).fontSize;
      let marginTop = window.getComputedStyle(resizedText).marginTop;
      if (resizedText.clientWidth >= textContainer.clientWidth) {
        setTimeout(() => {
          resizedText.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
          resizedText.style.marginTop = (parseFloat(marginTop) + 3) + 'px';
          textResizer()
        }, 5);
      }
    }
  }

  function Position(){
    for(let i = 0; i <= ranks.length; i++){
      if(ranks[i].rank == user.rank){
        rankNumber = ranks[i].number;
        break;
      }
    }
    return rankNumber;
  }

  function resize(){
    if (window.innerWidth < 1090){
      setTablet(true);
    }
    else{
      textResizer();
      setTablet(false);
    }
  }

  useEffect(() => {
    settings.changePage();
    addListener(window, "resize", resize);
    resize();
    bar = document.querySelector(".bar");
    updateLocalUser();
    Initialize();
  }, [currentBalance, isUpdated, isTablet]);

    return (
      <div id="profile-background" className="slideInRight fast">
      <section id="profile-page">
        <div id="juice-balance-module">
          {isTablet ? "" : <><div id="user-header">
            <img className="greeting-logo" src="../src/images/JuiceBeam-Logo-1.png"></img>
            <h2 className="user-greeting">
              <i className="styling1">Greetings,</i>
              <br/>
              {<Username/>}
            </h2>
          </div> </>}
          <div id="juice-balance-details">
            <FontAwesomeIcon className="juice-icon-big"style={{position: "relative"}} icon="tint"></FontAwesomeIcon>
            <h2 className="juice-amount"> 0 </h2>
            <h2 className="amount-text">Gallons Of Juice</h2>
          </div>
          {!isTablet ? "" : <><div id="rank-module">
              <h2 id="rank-header">- Rank -</h2>
            <div id="rank-details">
              <div id="rank-title">{<Rank/>}</div>
              <div id="rank-interface">
                <FontAwesomeIcon id="rank-number" icon="angle-double-up"></FontAwesomeIcon>
                <a id="rank-number">{<Position/>}</a>
              </div>
            </div>
          </div></>}
        </div>
        <div id="tank-module">
          <div id="tank-body">
            <div className="bar center">
              <div className="liquid">
                <div className="liquid-body"></div>
              </div>
              <div className="glass-cover"></div>
            </div>
            <div id="tank-interface">
              <h2 className="amount-needed"> 
              <FontAwesomeIcon className="juice-icon"style={{position: "relative"}} icon="tint"></FontAwesomeIcon> 
               {<JuiceLeft/>}  <br/> 
               Juice <br/> 
               Needed to Fill Tank</h2>
              <p className="tank-desc">
                When your juice tank reaches 100%, you can dump it out to rank up.
              </p>
              <h2 className="tank-amount"> 0% Full</h2>
              <button onClick={updateRank} id="tank-button">
                <div className="left"></div>
                Dump Tank!
                <div className="right"></div>
              </button>
            </div>
          </div>
        </div>
        {isTablet ? "" : <><div id="rank-module">
          <h2 id="rank-header">- Rank -</h2>
          <div id="badge-container">
            <div id="rank-badge"></div>
          </div>
          <div id="rank-details">
            <div id="rank-title">{<Rank/>}</div>
            <div id="rank-interface">
              <FontAwesomeIcon id="rank-number" icon="angle-double-up"></FontAwesomeIcon>
              <a id="rank-number">{<Position/>}</a>
            </div>
          </div>
        </div></>}
      </section>
      </div>
    );
  }

  export {Profile};