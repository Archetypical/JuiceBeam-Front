jQuery(function($) {
    var twitchChat = null;
    var beamChat = null;
    var twitchState = "on"
    var beamState = "off"
    var commandInput = null;
    var dataText = null;
    var lineNumber = null;
    var isTyping = null;
    var currentMenu = "Main";
    var typeWriteTimeOut = null;
    var eventNames;
    var eventCost;
    var eventTable = null;
    var confirmState = false;
    var eventName;
    var eventInfo;
    var source = null;
    var beamInitCheck = 0;
    var eventCommands = [{

        "name": "buy",
        "function": buy
    }, {
        "name": "back",
        "function": beamChatStart
    }];
    var mainCommands = [{
        "name": "events",
        "function": events
    }, {
        "name": "juice",
        "function": juice
    }, {
        "name": "leaderboard",
        "function": leaderboard
    }];

    var addListener = function(e, str, func) {
        if (e.addEventListener) {
            e.addEventListener(str, func, false);
        } else if (e.attachEvent) {
            e.attachEvent("on" + str, func);
        }
    };

    addListener(window, "load", init);

    function init() {
        eventsInit();
        twitchChat = document.getElementById("twitch-chat");
        beamChat = document.getElementById("beam-chat");
        jQuery(".elementor-widget-container").css("height", "100%");
        //checkEvent();
        jQuery('#command-button').on('click touchstart', function() {
            processCommand();
        });
        jQuery('#command-box').keypress(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                processCommand();
            }
        
        });
        commandBoxAutoSize();
        //startConfetti();
    }

    function twitchChatOn() {
        if (twitchState === "on")
            return
        else {
            beamState = "off";
            twitchState = "on";

            //turn off beamchat and turn on twitchchat
            document.getElementById("btn2").classList.remove('isPressed');
            document.getElementById("btn2").classList.add('notPressed');
            beamChat.classList.remove('chat_on');
            beamChat.classList.add('chat_off');

            beamChatClear();
            document.getElementById("btn1").classList.remove('notPressed');
            document.getElementById("btn1").classList.add('isPressed');
            twitchChat.classList.remove('chat_off');
            twitchChat.classList.add('chat_on');
        }
    }

    function beamChatOn() {
        if (beamState === "on")
            return
        else {
            twitchState = "off";
            beamState = "on";

            //turn off twitchchat and turn on beamchat
            document.getElementById("btn1").classList.remove('isPressed');
            document.getElementById("btn1").classList.add('notPressed');
            twitchChat.classList.remove('chat_on');
            twitchChat.classList.add('chat_off');
            beamChatClear();

            document.getElementById("btn2").classList.remove('notPressed');
            document.getElementById("btn2").classList.add('isPressed');
            beamChat.classList.remove('chat_off');
            beamChat.classList.add('chat_on');

            if (beamInitCheck == 0){
                beamChatStart();
                return;
            }
            switch(currentMenu){
                case "Main": beamChatStart(); break;
                case "Events": events(); break;
            }

        }
    }
    // type one text in the typwriter
    // keeps calling itself until the text is finished
    function typeWriter(text, i, fnCallback) {
        // check if text isn't finished yet
        if (i < (text.length)) {
            if (!isTyping) {
                return;
            }

            // add next character to h1
            document.querySelector('#line' + lineNumber).innerHTML = text.substring(0, i + 1) + "<span class='caret' aria-hidden='true'></span>";
            if (isTyping) {
                //clears timeout if there is another typewrite request
                if (typeWriteTimeOut != null)
                    clearTimeout(typeWriteTimeOut);
                // wait for a while and call this function again for next character
                typeWriteTimeOut = setTimeout(function() {
                    typeWriter(text, i + 1, fnCallback)
                }, 15);
            }
        }// text finished, call callback if there is a callback function
        else if (typeof fnCallback == 'function' && beamState != 'off') {

            //If the currently printed line does not match what it should be, clear display and return to the callback function
            if (document.getElementById("line" + lineNumber).innerHTML != text + "<span class=\"caret\" aria-hidden=\"true\"></span>") {
                beamChatClear();
                return;
            }
            document.querySelector('.caret').remove();
            colorText(lineNumber);
            lineNumber = lineNumber + 1;
            var newLine = ("<h1 id='line" + lineNumber + "' class='p'> </h1>");
            //add new line
            document.querySelector('#display-container').innerHTML = document.querySelector('#display-container').innerHTML + newLine;
            // call callback after timeout
            typeWriteTimeOut = setTimeout(fnCallback, 100);
        }
    }

    //function that runs when typewriter 
    //is interrupted by user action
    function typeWriteCancel() {
        //clears timeout to stop the typewriter function from firing again
        clearTimeout(typeWriteTimeOut);
        isTyping = false;
        //clears display
        if (document.getElementById("line0").innerHTML != null) {
            beamChatClear();
        }
        lineNumber = 0;
        //prints out full menu without animation
        for (let line of dataText) {
            document.querySelector('#line' + lineNumber).innerHTML = line;
            colorText(lineNumber);
            lineNumber = lineNumber + 1;
            var newLine = ("<h1 id='line" + lineNumber + "' class='p'> </h1>");
            document.querySelector('#display-container').innerHTML = document.querySelector('#display-container').innerHTML + newLine;
        }

    }

    function StartTextAnimation(i) {
        //starts at beginning of data table when finished
        if (typeof dataText[i] == 'undefined') {
            isTyping = false;
            document.getElementById("line" + lineNumber).innerHTML = document.getElementById("line" + lineNumber).innerHTML + "<span class='caret' aria-hidden='true'></span>";
            return;
        }

        // check if dataText[i] exists
        if (i < dataText[i].length) {
            if (beamState === "off") {
                beamChatClear();
                i = 0;
                return;
            } else if (currentMenu != "Main" && document.getElementById("line0").innerHTML === "") {
                isTyping = true;
            }
        }
        // text exists! start typewriter animation
        typeWriter(dataText[i], 0, function() {
            if (!isTyping) {
                return;
            }
            // after callback (and whole text has been animated), start next line
            //callback also returns if error occurs
            StartTextAnimation(i + 1);
        });
    }

    function beamChatStart() {
        beamInitCheck = 1;
        isTyping = true;
        currentMenu = "Main";
        console.log("Main Menu Starting");
        //check if the first line is clear
        //to detect if the display still has content 
        // and clear display if it does
        if (document.getElementById("line0").innerHTML != null) {
            beamChatClear();
        }
        dataText = ["-Welcome to the JuiceStream Panel!", "-Enter 'events' to boot up the Event Menu.", "-Enter 'juice' to see your Juice Stats.", "-Enter 'leaderboard' to see who currently has the most juice."];

        lineNumber = 0;
        // start the text animation
        StartTextAnimation(0);
    }

    function beamChatClear() {
        for (var i = lineNumber; i >= 1; i--) {
            document.querySelector('#line' + lineNumber).remove();
            lineNumber = lineNumber - 1;
        }
        document.getElementById("line0").innerHTML = null;
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
                    mainCommands[i].function();
                    isValid = true;
                    break;
                }
            }
        }

        if (currentMenu == "Events") {
            for (i = 0; i < eventCommands.length; i++) {
                if (cmd.toLowerCase() === eventCommands[i].name.toLowerCase()) {
                    eventCommands[i].function(args);
                    isValid = true;
                    break;
                }
            }
        }

        if (confirmState == true){
            if (cmd.toLowerCase() === "yes" || cmd === "y"){
               isValid = true;
               runEvent(eventName);
               return
            }
            else if (cmd.toLowerCase() == "no" || cmd == "n"){
               isValid = true;   
               confirmState = false;
               writeText("Purchase Aborted");
               return;
            }
            else {
                isValid = false; 
                buyConfirmation();
                return;
            } 
        }
  

        if (!isValid) {
            isTyping = true;
            
            if (commandInput.trim().length > 0) //when invalid input has letters
                writeText("'" + commandInput + "' is not a valid command.");
            else //when invalid input is blank
                writeText("Please enter a command.");
        }

    }
    function colorText(line){
        //colors certain words based on the characters around it
        var lineText = document.querySelector('#line' + line).innerHTML;
        var textArray = lineText.split(" ");
     
        for (var i = 0; i < textArray.length; i++) {
            //colors Confetti Event blue
            if (textArray[i].includes("Confetti")) {
                lineText = lineText.replace(textArray[i], '<span style="color: #5fdaff;">' + textArray[i] + '</span>');
            }
            //colors Fire Event orange
            if (textArray[i].includes("Fire")) {
                lineText = lineText.replace(textArray[i], '<span style="color: #ff9900;">' + textArray[i] + '</span>');
            }
            //colors the commands white
            if (textArray[i].includes("'")) {
                lineText = lineText.replace(textArray[i], '<span style="color:white;">' + textArray[i] + '</span>');
            }
        }
        document.querySelector('#line' + line).innerHTML = lineText;
    }
    function events() {
        currentMenu = "Events";
        if (document.getElementById("line0").innerHTML != null)
            beamChatClear();

        console.log("Events Menu Loaded");
        dataText = ["-Welcome to the Events Menu!", "-Here is your list of available events and their prices.", "-Enter 'buy (event)' to purchase an event.", "-Enter 'back' to return to the main menu."];
        dataText = insertArrayAt(dataText, 2,  eventInfo);
        //will eventually pull events based on rank from backend
        StartTextAnimation(0);
    }

    function runEvent(name){
        confirmState = false;
         jQuery.ajax({
            url: my_ajax_object.ajax_url,
            type: "post",
            data: {
                event_name: name,
                run_event: 'run_event',
                check_balance: 'pass_check'
            },
            success: function(response) {
                console.log(response);
            }
        });   
    }

     function checkEvent(){
        source = new EventSource("/wordpress/events.php");
        source.onopen = function(e) {
           console.log("The connection to your server has been opened");
        }
        source.addEventListener("ping", function(e) {
           //console.log(e.data);
           if (e.data == 0){
                   //console.log("Event Is Dead");
                   stopConfetti()
                   return;
             }
                for (var i = 0; i < eventNames.length; i++){
                    if(e.data == eventNames[i].name){
                        animateEvent(e.data);
                        return;
                    }
                }
        });
        source.onerror = function(e) {
           console.log("The server connection has been closed due to some errors");
        } 
    }
    function animateEvent(result){
        if (result == "Confetti"){
            startConfetti();
        }
    }
    
    function juice() {
    }

    function leaderboard() {
    }


    function eventsInit() {

        
        jQuery.ajax({
            url: my_ajax_object.ajax_url,
            type: 'post',
            data: {
                get_event: 'get_event'
            },
            success: function(response) {
                console.log(response);
                eventTable = response;
            },
            complete: function() {
                eventNames = [{
                "name": "null",
                "cost": "null",
             }, {
                "name": "null",
                "cost": "null"
                }];
                //if event table has the event variables, run the converter
                if (eventTable != null) {
                    //events come in as string from the backend like "name1 cost1 name2 cost2"
                    //this splits them up using the blank space 
                    //and puts them in array like ("name1, cost1, name2, cost2")
                    eventInfo = eventTable.split(' ');
                    var t = 1
                    //gets names by iterating through eventNames like array like "0,1,2"
                    //iterates through eventInfo with even numbers like "0,2,4"
                    for (var i = 0; i < eventInfo.length; i += 2) {
                        eventNames[i/2].name = eventInfo[i];
                    }
                    //gets cost by iterating through eventNames like array like "0,1,2"
                    //iterates through eventInfo with odd numbers like "1,3,5"
                    for (var f = 0; f < eventNames.length; f += 1) {
                        eventNames[f].cost = eventInfo[t];
                        //allows iteration through lopsided array assignment
                        t = t + 2; 
                    }
                    //resets eventInfo to prepare it for display conversion
                    eventInfo = ["null", "null"];
                    //converts eventNames array objects into menu items
                    //Looks like "Confetti - 50 Gallons of Juice"
                    for(r = 0; r < eventNames.length; r++){
                        eventInfo[r] = eventNames[r].name  +  " - " + eventNames[r].cost + " Gallons of Juice";
                    }
                    
                }
            },
        });
	}

        

    function checkBalance(string) {
        writeText("Loading...");
        $.ajax({
            url: my_ajax_object.ajax_url,
            data: {
                event_name: string,
                check_balance: 'check_balance'
            },
            type: 'post',
            start_time: new Date().getTime(),
            success: function(hasEnough) {
                console.log('This request took '+(new Date().getTime() - this.start_time)+' ms');
                console.log(hasEnough);
                if(hasEnough == 1){
                  buyConfirmation();
                }
                else
                    writeText("You do not have enough Juice for the " + string + " event");
            },
        });   
    }

    function buy(args) {
        // event holds the first argument, which is the event name
        eventName = args[0];
        var eventValid = false;
        console.log(args);
        for(var i = 0; i < eventNames.length; i++){
            if(eventName.toUpperCase() == eventNames[i].name.toUpperCase()){
                eventCost = eventNames[i].cost;
                eventName = eventNames[i].name;
                checkBalance(eventName);
                eventValid = true;
                break;
            }
        }
        if (!eventValid){
            writeText("You do not have an event called '" + eventName + "'");
        }
       

    }

    function buyConfirmation() {
        writeText("Spill " +  eventCost + " Gallons of Juice for " + eventName + "? " + "Enter 'Yes' Or 'No'.");
        confirmState = true;
        return;
    }

    function insertArrayAt(array, index, arrayToInsert) {
        Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
        return array;
    }

    function writeText(string) {
        isTyping = true;
        typeWriter(string, 0, function() {
            console.log("wrote " + string);
        });
    }

    function commandBoxAutoSize() {
        var commandBox = document.getElementById("command-box");
        var boxHeight = commandBox.clientHeight;
        autosize(document.querySelectorAll('textarea'));
        //new ResizeSensor(jQuery('#input-container'), function () {
        //	if (commandBox.clientHeight > 44){
        //		//writeText("Row Added");
        //	}
        //});
    }

var maxParticleCount = 150;
    //set max confetti count
    var particleSpeed = 2;
    //set the particle animation speed
    var colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"]
    var streamingConfetti = false;
    var animationTimer = null;
    var particles = [];
    var waveAngle = 0;

    function resetParticle(particle, width, height) {
        particle.colors = colors[(Math.random() * colors.length) | 0];
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = Math.random() * 10 + 5;
        particle.tilt = Math.random() * 10 - 10;
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
        particle.tiltAngle = 0;
        return particle;
    }

    function startConfetti() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                return window.setTimeout(callback, 16.6666667);
            };
        })();
        if(document.querySelector('#confetti-canvas') == null){
            var canvas = document.createElement("canvas");
            canvas.setAttribute("id", "confetti-canvas");
            document.getElementById("effect-container").appendChild(canvas);
        }
        var canvas = document.querySelector('#confetti-canvas');
        canvas.width = width;
        canvas.height = height;
        window.addEventListener("resize", function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, true);

        var context = canvas.getContext("2d");
        while (particles.length < maxParticleCount)
            particles.push(resetParticle({}, width, height));
        streamingConfetti = true;
        if (animationTimer === null) {
            (function runAnimation() {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (particles.length === 0)
                    animationTimer = null;
                else {
                    updateParticles();
                    drawParticles(context);
                    animationTimer = requestAnimFrame(runAnimation);
                }
            }
            )();
        }
    }

    function stopConfetti() {
        streamingConfetti = false;
    }

    function removeConfetti() {
        stopConfetti();
        particles = [];
    }

    function drawParticles(context) {
        var particle;
        var x;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            context.beginPath();
            context.lineWidth = particle.diameter;
            context.strokeStyle = particle.colors;
            x = particle.x + particle.tilt;
            context.moveTo(x + particle.diameter / 2, particle.y);
            context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
            context.stroke();
        }
    }

    function updateParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            if (!streamingConfetti && particle.y < -15)
                particle.y = height + 100;
            else {
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle);
                particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
                particle.tilt = Math.sin(particle.tiltAngle) * 15;
            }
            if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
                if (streamingConfetti && particles.length <= maxParticleCount)
                    resetParticle(particle, width, height);
                else {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }
});
	
