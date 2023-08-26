import React, { useEffect, useState, createRef } from "react";
import { NavigationBar } from "../_components";
import { userActions } from "../../_actions";


function ArchivePage() {
    const [showPopup, setIsOpen] = React.useState(false);
    const [isLoggedIn, setLoggedIn] = React.useState(false);
    var items;

    useEffect(() => {
        if (localStorage.getItem("user")) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, null );

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

  return (
    <div id="sub-body" className="scroll col-lg">
        <NavigationBar
        popupShow={togglePopup}
        loggedIn={isLoggedIn}
        logOut={setLoggedIn}
        style="slideInDown fast first-load "
        />
      <VideoCarousel />
      <div className="text-container">
        <h2 className="heading-title-4">Past Videos</h2>
      </div>
      <VideoLoader/>
    </div>
  );
}


function VideoCarousel() {
  const [forceReload, setForceReload] = useState(false);
  const [slideState, setSlideState] = useState(1);
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [slideMove, setSlideMove] = useState(0);
  var items = parent.children;
  const itemRef = createRef();


  var addListener = function (e, str, func) {
    if (e.addEventListener) {
      e.addEventListener(str, func, false);
    } else if (e.attachEvent) {
      e.attachEvent("on" + str, func);
    }
  };

  

  var carouselArray = [
    <li className="carousel-elem-active"></li>,
    <li className="carousel-elem future-1"></li>,
    <li className="carousel-elem future-2"></li>,
    <li className="carousel-elem future-2"></li>,
    <li className="carousel-elem- future-4"></li>,
  ];

  var carouselArrayReady = null ;

  function carouselRender() {
    for (var i = 0; i < carouselArray.length; i++) {
      if (carouselArray[i].props.className == "carousel-elem-active") {
        console.log("The Active Carousel Element is " + i);
        if (i == 0) {
          carouselArrayReady = [
            carouselArray[carouselArray.length],
            ...carouselArray,
          ];
        } else if (i == carouselArray.length) {
          carouselArrayReady = [
            carouselArray[carouselArray.length],
            ...carouselArray,
          ];
        }
        console.log(carouselArrayReady);
        setForceReload(!forceReload);
        //carouselRender();
      }
    }
  }

  function carouselAdvance() {
    var parent = document.querySelector(".carousel-container");
    items = parent.children;
    if (slideState < 5) {
      for(let i = 0; i < items.length; i++){
            items[i].style.transition = null;
      }
      parent.style.transition = null;
      
      if (slideState == 1){
        parent.style.left = "-30%";
      }
      else{
        parent.style.left = null;
      }
      setSlideState(slideState + 1); 
    } 
    else {
      setSlideState(slideState + 1);
      setTimeout(function () {
        for (var i = 0; i < items.length; i++) {
          items[i].style.transition = "none";
        }
        parent.style.transition = "none";
        setTimeout(() => {
          if (slideState >= 5) {
            for(let i = 0; i < items.length; i++){
                  items[i].style.transition = null;
            }
            parent.style.transition = null;
          }
        }, 50);
        setSlideState(1); 
      }, 390);
    }
  }

  function carouselReturn() {
    var parent = document.querySelector(".carousel-container");
    var items = parent.children;

    if (slideState > 1) {
      for(let i = 0; i < items.length; i++){
            items[i].style.transition = null;
      }

      parent.style.transition = null;
      if (slideState == 3 ){
        parent.style.left = "-30%";
      } 
      else if (slideState < 3){
        parent.style.left = "-65%";
      }
      else{
        parent.style.left = null;
      } 
      setSlideState(slideState - 1); 
    } 
    else {

      setSlideState(slideState - 1); 
      setTimeout(function () {
        for (var i = 0; i < items.length; i++) {
          items[i].style.transition = "none";
        }
        parent.style.transition = "none";
        setTimeout(() => {
          if (slideState < 5) {
            for(let i = 0; i < items.length; i++){
                  items[i].style.transition = null;
            }
            parent.style.transition = null;
          }
        }, 50);
        setSlideState(5); 
        //setTranslate(-1138);
        //setForceReload(!forceReload);
      },380);
    }
  }
  
function clickAssign(){
  for (var i = 0; i < items.length; i++) {
    if (items[i].classList[1] == "past-1"){
      items[i].firstChild.addEventListener("click", carouselReturn, false);
    }
    else if(items[i].classList[1] == "future-1"){
      items[i].firstChild.addEventListener("click", carouselAdvance, true);
    }
    else{
      items[i].firstChild.replaceWith(items[i].firstChild.cloneNode(true));
    }
  }
}
  

  function carouselAssign(slide) {
    if (slide == 0 && !loading) {
      mostRecent();
    }
    var past = slideState - slide;
    var future = slide - slideState;
    if (slide < slideState){
        return "carousel-elem past-" + past;
    }
    if (slide > slideState){
        return "carousel-elem future-" + future;
    }
  }

  function carouselLooper() {
    var parent = document.querySelector(".carousel-container");
    var active = document.querySelector(".active");
    const cloneFirst = document.querySelector(".future-4");
    cloneFirst.classList.remove("");
    const cloneLast = document.createElement("li");
    if (!document.querySelector(".past-1")) {
      parent.insertBefore(cloneFirst, active);
    }
  }
  async function mostRecent(){
    var videos = await userActions.getVideos(1);
    var dataHusk = [];
    console.log(videos);
    dataHusk = []  = videos.currPage;
    for (var i = 0; i < videos.length; i++) {
      //dataHusk[i].thumbnail = videos[i].thumbnail;
    }
    dataFormatter(dataHusk);
    setVideoData(dataHusk);
  }

  function dataFormatter(dataHusk){
    var today = Date.now()
    var url = "https://www.youtube.com/watch?v="
    for (var i = 0; i < dataHusk.length; i++) {
      var videoDate = new Date(dataHusk[i].date);
      var timePassed = timeDifference(today, videoDate);
      dataHusk[i].date = timePassed;
      dataHusk[i].resourceId = url + dataHusk[i].resourceId;
    }
  }


  function slideChange(slideNum){
    if (slideNum < slideState){
      var difference  = (slideState - slideNum) * -1;
      setSlideMove(difference);
    }
    else if (slideNum > slideState){
      var difference  =  slideNum - slideState;
      setSlideMove(difference);  
    }
  }

  function slideContinue(){
    if(slideMove != 0){
      if(slideMove < 0){
        setSlideMove(slideMove + 1);
        carouselReturn();
      }
      if(slideMove > 0){
        setSlideMove(slideMove - 1);
        carouselAdvance();
      }
    }
  }


  function resize(){
    var parent = document.querySelector(".carousel-container");
    items = parent.children;
    let positions = [] ;
    parent = document.querySelector(".carousel-container");

    for (var i = 0; i < items.length; i++) {
      let leftPos = items[i].offsetLeft;
      positions[i] = -1 * (leftPos + items[i].offsetWidth  / 2 - parent.offsetWidth / 2);
      if (i > slideState) items[i].style.zindex = (items.length - i).toString();
      else if (i == slideState) items[i].style.zindex = (items.length + 1).toString();
      else items[i].style.zindex = i.toString();
    }

    if (slideState >= 3 ){
      parent.style.left = null;
      parent.style.transform = "translateX( " + positions[slideState - 1] + "px)";
      //console.log(positions);
    }
    else {
      if (slideState == 2 ){
        parent.style.left = "-30%";
      } 
      else if(slideState == 1) {
        parent.style.left = "-65%";
      }
      else if (slideState == 0){
        parent.style.left = "-290px";
      }
      parent.style.transform = "translateX( " + (positions[slideState - 1] * 2) + "px)"
    }
  }

  function checkActive(e){
    if(e == slideState){
      return true;
    }
    else return false;
  }

  function delayLink(link){
    setTimeout(() => {
      var active = document.querySelector(".caro-active");
      var past = document.querySelector(".past-1");
      var future = document.querySelector(".future-1");
      active.children[0].children[1].setAttribute("href", link);
      past.children[0].children[1].removeAttribute("href", link);
      future.children[0].children[1].removeAttribute("href", link);
    }, 350);
    return null;
  }

  function init(){
    addListener(window, "resize", resize);
    slideContinue()
    resize();
    clickAssign();
  }

  useEffect(() => {
    if(!loading){
      setLoading(true);
    }
    init();
    
    //windowWidth = window.innerWidth;
    //carouselLooper();
  }, [slideState, videoData, slideMove]);


  return (
        <div id="carousel-main slideInDown fast second-load">
            <div className="carousel-overflow">
                <ul className="carousel-container">
                  {slideState <= 2 ? 
                    <li className={slideState == 0 ? "carousel-elem caro-active" : carouselAssign(0)}>
                      <div className="carousel-elem-content">
                        <div className="video-side-block"></div>
                          <div className="content-block">
                            <img className ="video-image" src={!videoData ? "" : videoData[4].thumbnail}></img>
                            <h2 className="video-title">{!videoData ? "" : videoData[4].title}</h2>
                            <h2 className="video-date">{!videoData ? "" : videoData[4].date}</h2>
                          </div>
                      </div>
                    </li> : ""}
                    {!videoData? "" : videoData.map(data => (
                    <li key={data.id} className={slideState == data.id ? "carousel-elem caro-active" : carouselAssign(data.id)}>
                      <div className="carousel-elem-content">
                        <div className="video-side-block"></div>
                        <a href={checkActive(data.id) ? delayLink(data.resourceId) : false } target={checkActive(data.id) ? "_blank" : false} rel={checkActive(data.id) ?"noopener noreferrer": false} className="content-block">
                            <img className ="video-image" src={!videoData ? "" : data.thumbnail}></img>
                            <h2 className="video-title">{!videoData ? "" : data.title}</h2>
                            <h2 className="video-date">{!videoData ? "" : data.date}</h2>
                        </a>
                      </div>
                    </li>
                    ))}
                    {slideState >= 4 ? 
                    <li className={slideState == 6 ? "carousel-elem caro-active" : carouselAssign(6)}>
                      <div className="carousel-elem-content">
                        <div className="video-side-block"></div>
                        <div className="content-block">
                            <img className ="video-image" src={!videoData ? "" : videoData[0].thumbnail}></img>
                            <h2 className="video-title">{!videoData ? "" : videoData[0].title}</h2>
                            <h2 className="video-date">{!videoData ? "" : videoData[0].date}</h2>
                        </div>
                      </div>
                    </li> : ""}
                </ul>
                <div className="carousel-footer">
                  <ul className="carousel-dots">
                      <li onClick={() => slideChange(1)} className={slideState == 1 || slideState == 6? "active": ""}></li>
                      <li onClick={() => slideChange(2)} className={slideState == 2? "active": ""}></li>
                      <li onClick={() => slideChange(3)} className={slideState == 3? "active": ""}></li>
                      <li onClick={() => slideChange(4)} className={slideState == 4? "active": ""}></li>
                      <li onClick={() => slideChange(5)} className={slideState == 0 || slideState == 5? "active": ""}></li>
                  </ul>
                  <h2 className="heading-title-5">Latest Videos</h2>
                </div>
            </div>
        </div>
  );
}



function timeDifference(current, previous) {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerWeek =  msPerDay * 7
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  var result;

  var elapsed = Math.abs(current - previous);


  if (elapsed < msPerHour) {
      result =  Math.round(elapsed/msPerMinute);
      if(result > 1){
        return  result + ' minutes ago';
      }
      else{
        return  result + ' minute ago';
      }   
  }

  else if (elapsed < msPerDay ) {
    result = Math.round(elapsed/msPerHour );
    if(result > 1){
      return  result + ' hours ago';
    }
    else{
      return  result + ' hour ago';
    }   
  }

  else if (elapsed < msPerWeek) {
    result = Math.round(elapsed/msPerDay);
    if(result > 1){
      return  result + ' days ago';
    }
    else{
      return  result + ' day ago';
    }   
  }

  else if (elapsed < msPerMonth ) {
    result = Math.round(elapsed/msPerWeek );
    if(result > 1){
      return  result + ' weeks ago';
    }
    else{
      return  result + ' week ago';
    }   
  }

  else if (elapsed < msPerYear) {
    result = Math.round(elapsed/msPerMonth);
      if(result > 1){
        return  result + ' months ago';
      }
      else{
        return  result + ' month ago';
      }   
  }

  else {
    result =  Math.round(elapsed/msPerYear );
      if(result > 1){
        return  result + ' years ago';
      }
      else{
        return  result + ' year ago';
      }   
  }
}

var loadBool = false;
function VideoLoader(){
  const [videoData, setVideoData] = useState(null);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(loadBool);
  const [videoTotal, setVideoTotal] = useState(25);
  const [operation, setOperation] = useState(true);
  ///const[loadCrossed, setLoadCross] = useState(false);
  const [initial, setInitial] = useState(false);
  const [prevY, setPrevY] = useState(0);
  var dataHusk = [];
  var loadCrossed = false;


  async function videoLoader(){
    setLoading(true);
    var loadThreshold = document.querySelector(".loading-icon-container");
    loadThreshold.classList.add('in-viewport');
    //var scrollDiv = document.querySelector("#sub-body");
    //scrollDiv.scrollTop = scrollDiv.scrollHeight;
      var newPage = videoData.length / 5 + 2;
      if (videoData.length < videoTotal - 5){
          await userActions.getVideos(newPage).then( videos => {
          videos.currPage = dataFormatter(videos.currPage);
          dataHusk = videoData; 
          if(videoData[videoData.length - 1].id == videos.currPage[videos.currPage.length - 1].id ){
            videoLoader();
          }
          else if (videoData.length < videos.total - 5){
            //setTimeout(() => {
              dataHusk.push(...videos.currPage);
              setVideoData(dataHusk);
              setLoading(false);
              loadThreshold.classList.remove('in-viewport');
            //}, 350);
          }
          setVideoTotal(videos.total);
          setLoading(false);
          loadThreshold.classList.remove('in-viewport');
        });
      }
      else if (videoData.length >= videoTotal - 5){
        setLoading(false);
        setOperation(false);
        loadThreshold.classList.remove('in-viewport');
        observer.unobserve(loadThreshold);
      }
  }


  async function videoInit(){
    var videos = await userActions.getVideos(page);
    //console.log(videos);
    dataHusk = []  = videos.currPage;
    dataFormatter(dataHusk);
    setVideoData(dataHusk);
    setPage(page + 1);
  }


  function dataFormatter(videos){
    var today = Date.now()
    var url = "https://www.youtube.com/watch?v="
    for (var i = 0; i < videos.length; i++) {
      var videoDate = new Date(videos[i].date);
      var timePassed = timeDifference(today, videoDate);
      videos[i].date = timePassed;
      videos[i].resourceId = url + videos[i].resourceId;
    }
    return videos;
  }


  useEffect(() => {
    if (!initial){
      videoInit();
      setInitial(true);
    }

    var options = {
      root: document.querySelector("#sub-body"),
      rootMargin: "0px",
      threshold: 1.0
    };

    var loadThreshold = document.querySelector(".loading-icon-container");
    if (operation){
      var observer = new IntersectionObserver(handleObserver.bind(), options);
      observer.observe(loadThreshold);
    }
  }, [initial, videoData, loading, prevY]);


  function handleObserver(entities, observer) {
    var loadThreshold = document.querySelector(".loading-icon-container");
    const y = entities[0].boundingClientRect.y;
    if (prevY > y && loadThreshold.classList[1] != 'in-viewport' && videoData != null && operation) {
      videoLoader();
    }
    setPrevY(y);
  }

  function solidify(e){
    //var videoGrid = documet.querySelector(".video-grid");
    //var items = videoGrid.children;
    //for(var i = 0; i < items.length; i++) {}
    e.currentTarget.classList.remove("slideInLeft");
    e.currentTarget.classList.remove("fast");
  }

  return(
    <div className = "video-tile-container">
      <div className="video-grid">
        {!videoData? "" : videoData.map(data => (
          <a key={data.id} href={data.resourceId} target="_blank" rel="noopener noreferrer"  onMouseEnter={solidify} className="video-tile slideInLeft fast">
            <img className="tile-thumbnail" src={data.thumbnail}></img>
            <h2 className="tile-title">{data.title}</h2>
            <h2 className="tile-date">{data.date}</h2>
          </a>
        ))}
      </div>
      <div className="loading-icon-container"> 
        {loading ? <SlimeLoading/> : ""}
      </div>
    </div>
  );
}

function SlimeLoading(){



  return (
    <svg
      style={{margin: "auto", display: "block" }}
      width="200px"
      height="80px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <defs>
        <filter
          id="ldio-ot22ivltt-filter"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="3"></feGaussianBlur>
          <feComponentTransfer result="cutoff">
            <feFuncA type="linear" slope="60" intercept="-40"></feFuncA>
          </feComponentTransfer>
        </filter>
      </defs>
      <g filter="url(#ldio-ot22ivltt-filter)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="3.0303030303030303s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        ></animateTransform>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="0"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.7666666666666666 0 0.6666666666666666 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="1"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.7333333333333333 0 0.6333333333333333 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="2"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.7 0 0.6 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="3"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.6666666666666666 0 0.5666666666666667 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="4"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.6333333333333333 0 0.5333333333333333 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="5"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.6 0 0.5 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.5666666666666667 0 0.4666666666666667 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="7"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.5333333333333333 0 0.43333333333333335 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="8"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.5 0 0.4 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.4666666666666667 0 0.36666666666666664 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="10"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.43333333333333335 0 0.3333333333333333 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="11"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.4 0 0.3 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.3666666666666667 0 0.26666666666666666 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="13"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.33333333333333337 0 0.23333333333333334 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="14"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.30000000000000004 0 0.2 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="15"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.26666666666666666 0 0.16666666666666666 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="16"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.23333333333333334 0 0.13333333333333333 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="17"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.2 0 0.1 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="18"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.16666666666666669 0 0.06666666666666667 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
        <g>
          <g transform="translate(50 20)">
            <circle
              cx="0"
              cy="0"
              r="19"
              fill="var(--color-text-primary)"
              transform="scale(0.5)"
            ></circle>
          </g>
          <animateTransform
            attributeName="transform"
            calcMode="spline"
            type="rotate"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
            dur="1.0101010101010102"
            keySplines="0.13333333333333333 0 0.03333333333333333 1"
            repeatCount="indefinite"
          ></animateTransform>
        </g>
      </g>
    </svg>
  );
}


export { ArchivePage };
