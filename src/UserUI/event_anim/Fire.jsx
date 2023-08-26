import React, { useEffect } from "react";


function Fire(){
    return(
        <video width="100%" height="100%" id="fire-vid">
            <source 
            src="../src/images/fire_VP8.webm"
            type="video/webm"/>
          </video>
    );
}

function setFire(arg){
    const video = document.querySelector("#fire-vid");
    if(arg){
        video.play();
    }
    else{
        video.currentTime = 0;
        video.pause();
    }
}


export { Fire, setFire };