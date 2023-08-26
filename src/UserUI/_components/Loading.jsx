import React, { useEffect } from "react";


var bubbleScore = 0;

function Loading(settings) {
  // ---------
  // Functions
  // ---------
  var ctx;
  var canvas;
  var count;
  var bubbles = [];
  var bubbleCount = 5;
  var bubbleSpeed = 2.4;
  var popLines = 6;
  var popDistance = 40;
  var mouseOffset = {
    x: 0,
    y: 0,
  };

  function animateInit(){
    animate(canvas, bubbles, bubbleSpeed, ctx, mouseOffset)
  }


      // ------------------
      // Bubble Constructor
      // ------------------
      // Bubble Function Object
      var createBubble = function () {
        this.position = { x: 0, y: 0 }; // initial position of bubble
        this.radius = 60 + Math.random() * 10; // sets bubble size using radius
        this.xOff = Math.random() * canvas.width - this.radius; // X offset that is derived
        this.yOff = Math.random() * canvas.height; // Y offset that decides what wave the bubble should
        this.distanceBetweenWaves = 50 + Math.random() * 40; //either 50 or 90
        // count is either double the canvas height or the normal canvas height
        // it helps seperate the bubbles so that there is a new wave of bubbles at the bottom by the time one reaches the top
        this.count = canvas.height + this.yOff;
        this.color = "#fff";
        this.lines = []; // Array for lines that appear when bubble pops
        this.popping = false;
        this.maxRotation = 25;
        this.rotation = // this variable randomizes the starting rotation angle of the bubble
          Math.floor(
            // it upholds the max rotation gate while allowing the bubble to start from 2 different angles
            Math.random() * (this.maxRotation - this.maxRotation * -1)
          ) +
          this.maxRotation * -1;
        this.rotationDirection = "forward"; //always start bubble rotating forward

        // Populate Lines
        // Creates 6 lines,
        // the bubble var marks this object as its owner
        // the index var numbers the lines incrementally
        for (var i = 0; i < popLines; i++) {
          var tempLine = new createLine();
          tempLine.bubble = this;
          tempLine.index = i;

          this.lines.push(tempLine);
        }

        // function that resets the beginning default values of bubble
        // this way, when it starts over it feels like a new bubble
        this.resetPosition = function () {
          this.position = { x: 0, y: 0 };
          this.radius = 40 + Math.random() * 10;
          this.xOff = Math.random() * canvas.width - this.radius;
          this.yOff = Math.random() * canvas.height;
          this.distanceBetweenWaves = 50 + Math.random() * 40;
          this.count = canvas.height + this.yOff;
          this.popping = false;
        };

        // Function that changes how the bubble renders each frame based on the objects changing variables
        this.render = function () {
          if (this.rotationDirection === "forward") {
            if (this.rotation < this.maxRotation) {
              // if bubble hasn't reached max rotation going forward,
              this.rotation++; // keep turning forwards
            } else {
              this.rotationDirection = "backward"; // else change direction
            }
          } else {
            if (this.rotation > this.maxRotation) {
              //if bubble rotation hasn't reached max rotation backwards
              this.rotation--; // keep turning backwards
            } else {
              this.rotationDirection = "forward"; // else change direction
            }
          }

          ctx.save(); // saves previous bubble settings to the stack
          ctx.translate(this.position.x, this.position.y); //move the bubble to the next position
          ctx.rotate((this.rotation * Math.PI) / 180); // rotate the bubble according to the rotation directions
          //if this bubble hasn't popped yet, pass on these settings
          if (!this.popping) {
            ctx.beginPath(); // start defining instructions for the bubble's highlight
            //ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.arc(0, 0, this.radius - 6, -1.4, Math.PI * 1.1, true);
            ctx.stroke();
            //ctx.shadowBlur = 9;
            //ctx.shadowColor = "white";
            ctx.beginPath(); // start defining instructions for the bubble's circle
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
          }

          ctx.restore(); // use these settings in this bubble for the next bubble

          // Draw the lines
          for (var a = 0; a < this.lines.length; a++) {
            if (this.lines[a].popping) {
              if (
                this.lines[a].lineLength < popDistance &&
                !this.lines[a].inversePop
              ) {
                this.lines[a].popDistance += 0.06;
              } else {
                if (this.lines[a].popDistance >= 0) {
                  this.lines[a].inversePop = true;
                  this.lines[a].popDistanceReturn += 1;
                  this.lines[a].popDistance -= 0.03;
                } else {
                  this.lines[a].resetValues();
                  this.resetPosition(); //reset bubble at bottom after the lines finish animating
                  if (a == 5) {
                    bubbleScore = bubbleScore + 1;
                    console.log("Got" + bubbleScore + " Bubbles");
                  }
                }
              }
              this.lines[a].updateValues();
              this.lines[a].render();
            }
          }
        };
      };



      // ----------------
      // Line Constructor
      // ----------------

      function createLine() {
        this.lineLength = 0;
        this.popDistance = 0;
        this.popDistanceReturn = 0;
        this.inversePop = false; // When the lines reach full length they need to shrink into the end position
        this.popping = false;

        this.resetValues = function () {
          this.lineLength = 0;
          this.popDistance = 0;
          this.popDistanceReturn = 0;
          this.inversePop = false;
          this.popping = false;

          this.updateValues();
        };

        this.updateValues = function () {
          this.x =
            this.bubble.position.x +
            (this.bubble.radius + this.popDistanceReturn) *
              Math.cos((2 * Math.PI * this.index) / this.bubble.lines.length);
          this.y =
            this.bubble.position.y +
            (this.bubble.radius + this.popDistanceReturn) *
              Math.sin((2 * Math.PI * this.index) / this.bubble.lines.length);
          this.lineLength = this.bubble.radius * this.popDistance;
          this.endX = this.lineLength;
          this.endY = this.lineLength;
        };

        this.render = function () {
          this.updateValues();

          ctx.beginPath();
          //ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.moveTo(this.x, this.y);
          if (this.x < this.bubble.position.x) {
            this.endX = this.lineLength * -1;
          }
          if (this.y < this.bubble.position.y) {
            this.endY = this.lineLength * -1;
          }
          if (this.y === this.bubble.position.y) {
            this.endY = 0;
          }
          if (this.x === this.bubble.position.x) {
            this.endX = 0;
          }
          ctx.lineTo(this.x + this.endX, this.y + this.endY);
          ctx.stroke();
        };
      }



  useEffect(() => {
    bubbleScore = 0;
    if (settings.isLoading) {


      canvas = document.querySelector("canvas");
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      ctx = canvas.getContext("2d");
      count = canvas.height;
      

      // --------------
      // Animation Loop
      // --------------

      

      window.requestAnimationFrame(animateInit);

      

      // ----------------
      // Populate Bubbles
      // ----------------

      for (var i = 0; i < bubbleCount; i++) {
        var tempBubble = new createBubble();

        bubbles.push(tempBubble);
      }

    
      // ---------------
      // Event Listeners
      // ---------------

      canvas.addEventListener("mousemove", mouseMove);

      function mouseMove(e) {
        mouseOffset.x = e.offsetX;
        mouseOffset.y = e.offsetY;
      }

      window.addEventListener("resize", function () {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
      });

      // ---------------
      // Event Listeners
      // ------------------------------
    }
  }, [settings.isLoading]);

  var animateStart = false;
  var canvas;
  var bubbles;
  var bubbleSpeed;
  var ctx;
  var mouseOffset;

  function animate(globalCanvas, globalBubbles, globalBubbleSpeed, newctx, globalMouseOffset) {
    if (!animateStart){
      animateStart = true;
      canvas = globalCanvas;
      bubbles = globalBubbles;
      bubbleSpeed = globalBubbleSpeed;
      ctx = newctx;
      mouseOffset = globalMouseOffset;
    }

    // ------------
    // Clear Canvas
    // ------------

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ------------
    // Draw Bubbles
    // ------------

    ctx.beginPath(); //stop drawing on the last cleared frame and start drawing on this new frame
    // this loop cycles through the bubbles and animates the movement for each frame
    // it controls the way each bubble moves left to right as it floats to the top of the canvas
    ctx.font = "130px AudioWide, serif";
    ctx.fillText(bubbleScore, 50 , 150);
    ctx.fillStyle = "white";
    for (var i = 0; i < bubbles.length; i++) {
      // first num = distance between waves
      // second num = wave height
      // third num = move the center of the wave away from the edge
      bubbles[i].position.x =
        Math.sin(bubbles[i].count / bubbles[i].distanceBetweenWaves) * 50 +
        bubbles[i].xOff; //
      bubbles[i].position.y = bubbles[i].count;
      bubbles[i].render(); // show each bubbles state based on how its variables changed this frame

      if (bubbles[i].count < 0 - bubbles[i].radius) {
        bubbles[i].count = canvas.height + bubbles[i].yOff;
      } else {
        bubbles[i].count -= bubbleSpeed;
      }
    }
    // ---------------
    // On Bubble Hover
    // ---------------
    for (var i = 0; i < bubbles.length; i++) {
      if (
        mouseOffset.x > bubbles[i].position.x - bubbles[i].radius &&
        mouseOffset.x < bubbles[i].position.x + bubbles[i].radius
      ) {
        if (
          mouseOffset.y > bubbles[i].position.y - bubbles[i].radius &&
          mouseOffset.y < bubbles[i].position.y + bubbles[i].radius
        ) {
          for (var a = 0; a < bubbles[i].lines.length; a++) {
            bubbles[i].popDistance = bubbles[i].radius * 0.5;
            bubbles[i].lines[a].popping = true;
            bubbles[i].popping = true;
          }
        }
      }
    }
    if(document.querySelector("#load-screen") != null){
      window.requestAnimationFrame(animate);
    }
  }
  
  return (
    <div id="load-screen" className={settings.loadStop ? "fadeOutDown normal": ""}>
      <div className="overlay noscroll"></div>
      <canvas className="bubbles noscroll"></canvas>
      <h3 className="load-text noscroll">
        <ul className="pre-loader">
          <li>L</li>
          <li>O</li>
          <li>A</li>
          <li>D</li>
          <li>I</li>
          <li>N</li>
          <li>G</li>
        </ul>
      </h3>
    </div>
  );
}


export { Loading };