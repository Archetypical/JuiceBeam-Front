"use strict";(self.webpackChunkJuiceBeam_Front=self.webpackChunkJuiceBeam_Front||[]).push([[739],{77739:(e,t,n)=>{n.r(t),n.d(t,{default:()=>T});var o=n(55043),a=n(35466),r=n(22503),i=n(77474),c=n(81751),l=n(74998),u=n(99879),s=n(43267),m=n(77043),d=n(69350);function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}m.p8.registerPlugin(d._);var h=0,p=null,g=0,v=0,y=null,E=[0],b="Main";function w(e){var t,n,r,i=null,l=null,m=null,d=!1,w=a.useState(!1),T=(0,o.Z)(w,2),M=T[0],L=T[1],I=a.useState(!1),C=(0,o.Z)(I,2),k=(C[0],C[1],a.useState(b)),H=(0,o.Z)(k,2),x=H[0],B=H[1],N=s.h.getState().authentication,q=[{name:"buy",function:function(e){n=e[0];var o=!1;console.log(e);for(var a=0;a<y.length;a++)if(n.toUpperCase()==y[a].name.toUpperCase()){t=y[a].cost,K(n=y[a].name),o=!0;break}o||J("You do not have an event called '"+n+"'")}},{name:"back",function:Z}],A=[{name:"back",function:Z}],P=[{name:"events",function:j},{name:"codex",function:$},{name:"leaderboard",function:function(){}}];function _(){var e=r;r=function(){if(localStorage.getItem("user"))return JSON.parse(localStorage.getItem("user")).points}(),e&&e!==r&&Q()}(0,a.useEffect)((function(){var t;e.isOpen||""==document.getElementById("line0").innerHTML?e.isOpen&&((t=document.getElementById("command-box")).style.height=t.scrollHeight+"px",t.style.overflowY="hidden",t.addEventListener("input",(function(e){return function(e){for(var t=0;t<15;t++)e.target.style.height=e.target.scrollHeight+"px"}(e)}),!1),""==document.querySelector("#line0").innerHTML&&(h=0),function(){var e="Hello! Please Login To Use BeamChat.";if(!N.loggedIn&&document.getElementById("line0").innerHTML!=e)return G(),void J(e);switch(x){case"Main":Z();break;case"Events":j();break;case"Codex":$()}}()):G(),O()}),[x,M]);var O=function(){return s.h.subscribe(_)};function D(){l&&function(){clearTimeout(p),l=!1,""!=document.getElementById("line0").innerHTML&&G();var e,t=function(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var o=0,a=function(){};return{s:a,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i=!0,c=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return i=e.done,e},e:function(e){c=!0,r=e},f:function(){try{i||null==n.return||n.return()}finally{if(c)throw r}}}}(m);try{for(t.s();!(e=t.n()).done;){var n=e.value;document.querySelector("#line"+h).innerHTML=n,Y(h);var o="<h1 id='line"+(h+=1)+"' class='text-line'> </h1>";document.querySelector("#display-container").innerHTML=document.querySelector("#display-container").innerHTML+o}}catch(e){t.e(e)}finally{t.f()}}();var e=!1;i=document.getElementById("command-box").value,document.getElementById("command-box").value="";var t,o=i.split(" "),a=o[0];if(o.shift(),"Main"==x)for(var r=0;r<P.length;r++)if(a.toLowerCase()===P[r].name.toLowerCase()){"events"==P[r].name?(b="Events",B("Events")):"codex"==P[r].name?(b="Codex",B("Codex")):q[r].function(o),e=!0;break}if("Events"==x)for(r=0;r<q.length;r++)if(a.toLowerCase()===q[r].name.toLowerCase()){"back"==q[r].name?(b="Main",B("Main")):q[r].function(o),e=!0;break}if("Codex"==x)for(r=0;r<A.length;r++)if(a.toLowerCase()===A[r].name.toLowerCase()){"back"==A[r].name?(b="Main",B("Main")):A[r].function(o),e=!0;break}if(d)return"yes"===a.toLowerCase()||"y"===a?(d=!1,t=n,c.hI.runEvent(t).then((function(e){e.status?console.log("Event Added to Queue Succesfully"):console.log("Event Run failed")})),c.hI.updateLocalUser(),void Q()):"no"==a.toLowerCase()||"n"==a?(d=!1,void J("Purchase Aborted")):void W();e||(l=!0,i.trim().length>0?J("'"+i+"' is not a valid command."):J("Please enter a command."))}function Z(){l=!0,console.log("Main Menu Starting"),""!=document.getElementById("line0").innerHTML&&G(),m=["-Welcome to the JuiceStream Panel!","-Enter 'events' to boot up the Event Menu.","-Enter 'codex' to open your codex.","-Enter 'leaderboard' to see who currently has the most juice."],R(0)}function j(){1!=g?(g=1,y=[],c.hI.getEvents().then((function(e){for(var t=0;t<e.length;t++)y[t]=e[t],E[t]=y[t].name+" - "+y[t].cost+" Gallons of Juice";U()}))):U()}function U(){var e,t,n;""!=document.getElementById("line0").innerHTML&&G(),console.log("Events Menu Loaded"),e=m=["-Welcome to the Events Menu!","-Here is your list of available events and their prices.","-Enter 'buy (event)' to purchase an event.","-Enter 'back' to return to the main menu."],t=2,n=E,Array.prototype.splice.apply(e,[t,0].concat(n)),m=e,R(0)}function J(e){l=!0,F(e,0,(function(){V()}))}function F(t,n,o){if(n<t.length){if(!l)return;var a=t.substring(0,n),r=t.substring(0,n+1);r=r.replace(a,"")," "==a.substring(a.length-1)&&(c=h,u=document.querySelector("#line"+c).innerHTML,(s=(s=(u=u.replace('<span class="caret" aria-hidden="true"></span>',"")).split(" ")).filter((function(e){return e})))[s.length-1].includes("Confetti")&&(u=u.replace(s[s.length-1],'<span style="color: #5fdaff;">'+s[s.length-1]+"</span>")),s[s.length-1].includes("Fire")&&(u=u.replace(s[s.length-1],'<span style="color: #ff9900;">'+s[s.length-1]+"</span>")),s[s.length-1].includes("'")&&(u=u.replace(s[s.length-1],'<span style="color: #b8ff0b;">'+s[s.length-1]+"</span>")),document.querySelector("#line"+c).innerHTML=u),document.querySelector("#line"+h).innerHTML=document.querySelector("#line"+h).innerHTML.replace('<span class="caret" aria-hidden="true"></span>',""),document.querySelector("#line"+h).innerHTML=document.querySelector("#line"+h).innerHTML+r+"<span class='caret' aria-hidden='true'></span>",l&&(null!=p&&clearTimeout(p),p=setTimeout((function(){F(t,n+1,o)}),8))}else if("function"==typeof o&&e.isOpen){document.querySelector(".caret").remove();var i="<h1 id='line"+(h+=1)+"' class='text-line'> </h1>";document.querySelector("#display-container").innerHTML=document.querySelector("#display-container").innerHTML+i,p=setTimeout(o,40)}var c,u,s}function R(t){if(void 0===m[t])return l=!1,void(document.getElementById("line"+h).innerHTML=document.getElementById("line"+h).innerHTML+"<span class='caret' aria-hidden='true'></span>");if(t<m[t].length){if(!e.isOpen)return G(),void(t=0);"Main"!=x&&""===document.getElementById("line0").innerHTML&&(l=!0)}F(m[t],0,(function(){l&&R(t+1)}))}function Y(e){for(var t=document.querySelector("#line"+e).innerHTML,n=t.split(" "),o=0;o<n.length;o++)n[o].includes("Confetti")&&(t=t.replace(n[o],'<span style="color: #5fdaff;">'+n[o]+"</span>")),n[o].includes("Fire")&&(t=t.replace(n[o],'<span style="color: #ff9900;">'+n[o]+"</span>")),n[o].includes("'")&&(t=t.replace(n[o],'<span style="color: #b8ff0b;">'+n[o]+"</span>"));document.querySelector("#line"+e).innerHTML=t}function G(){for(var e=h;e>=1;e--)document.querySelector("#line"+h).remove(),h-=1;document.getElementById("line0").innerHTML="",h=0}function W(){J("Spill "+t+" Gallons of Juice for "+n+"? Enter 'Yes' Or 'No'."),d=!0}function K(e){c.hI.checkBalance(e).then((function(t){t?W():J("You do not have enough Juice for the "+e+" event")}))}function $(){""!=document.getElementById("line0").innerHTML&&G(),0==v&&(Q(),v=1)}function Q(){L(!M)}function V(){var e=document.querySelector("#display-container");e.scrollTop=e.scrollHeight}return a.createElement(a.Fragment,null,a.createElement("div",{id:"beamChat",className:e.isOpen?"beam-chat":"beam-chat  d-none"},a.createElement("div",{id:"beam-container"},a.createElement("div",{id:"overlay"}," "),a.createElement("div",{id:"display-container"},a.createElement("div",{className:"menu-title"},a.createElement("h2",null,"".concat(x," Menu"))),a.createElement(S,{forceUpdate:function(){return Q},open:"Codex"==x,clear:G}),a.createElement("h1",{id:"line0",className:"text-line"})),a.createElement("div",{id:"input-container"},a.createElement("textarea",{type:"text",onKeyPress:function(e){13==e.charCode&&(N.loggedIn?(e.preventDefault(),D()):(G(),J("Please Login To Use Beam Chat Commands."),document.getElementById("command-box").value=""))},onChange:V,name:"command-box",id:"command-box",placeholder:"Type Your Command"}),a.createElement("div",{className:"input-footer"},a.createElement("div",{className:"juice-amount_chat"},a.createElement(u.G,{className:"juice-icon-small",style:{position:"relative"},icon:"tint"}),N.loggedIn?N.user.points:"0"," Gallons"),a.createElement("button",{className:"button",onClick:D,role:"button",id:"command-button"},"Send"))))))}function S(e){var t=new Audio("https://sounds.pond5.com/single-click-20-sound-effect-000688351_nw_prev.m4a"),n=new Audio("https://sounds.pond5.com/single-click-15-sound-effect-000688356_nw_prev.m4a"),o=new Audio("https://sounds.pond5.com/lock-padlock-sound-effect-008863055_nw_prev.m4a"),r=new Audio("https://sounds.pond5.com/winding-watch-0001-sound-effect-037821417_nw_prev.m4a"),i=0,c=0,l=[0,0,0],u=1,s=0;if(!e.open)return a.createElement("div",null);function f(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}return l[0]=f(5,25),l[2]=f(5,25),l[0]>l[2]?l[1]=f(2,l[2]):l[1]=f(2,l[0]),console.log(l),(0,a.useEffect)((function(){e.open,d._.create("#knob",{type:"rotation",inertia:!1,dragResistance:.1,onDrag:function(){var e=this;document.querySelector(".gear-container")&&(document.querySelector("#back-gear").style.transform="rotate("+.25*this.rotation+"deg)",document.querySelector("#front-gear").style.transform="rotate("+2.5*this.rotation+"deg)",document.addEventListener("visibilitychange",(function(){return e.endDrag(e.pointerEvent)})),(this.rotation>i+30||this.rotation<i-30)&&(this.rotation>c?(t.play(),i+=30,console.log(i/30),1==u&&s>0&&(s-=1),(1==u&&i/30>i/30+s||3==u&&i/30>i/30+s)&&(console.log(i/30),s=0),1==u&&i/30==l[0]?(u=2,console.log("Success! Switching to step "+u)):3==u&&i/30==l[2]?(console.log("Unlock!"),o.play(),u=1,i=0,m.p8.to("#knob",{rotation:0,duration:1}),this.disable(),setTimeout((function(){e.enable()}),[100])):2==u&&(s+=1,console.log("Error: "+s),3==s&&(console.log("Clicks = "+i/3+" Resetting"),u=1,i=0,s=0,r.play(),m.p8.to("#knob",{rotation:0,duration:1,onComplete:function(){setTimeout((function(){r.pause(),r.currentTime=0}),[20])}}),this.disable(),setTimeout((function(){e.enable()}),[100])))):(i-=30,n.play(),2==u&&i/30<l[1]+3&&(s=0),2==u&&i/30==l[1]?(u=3,console.log("Success! Switching to step "+u)):1!=u&&3!=u||(s+=1,console.log("Error: "+s),3==s&&(console.log("Clicks = "+i/3+" Resetting"),u=1,i=0,s=0,r.play(),m.p8.to("#knob",{rotation:0,duration:1,onComplete:function(){setTimeout((function(){r.pause(),r.currentTime=0}),[20])}}),this.disable(),setTimeout((function(){e.enable()}),[100])))),c=this.rotation))}})})),a.createElement("div",{className:"gear-container"},a.createElement("img",{id:"back-gear",src:"https://imgur.com/fvceanT.png",width:"300",height:"300"}),a.createElement("img",{id:"knob",src:"https://imgur.com/j4Ka5cw.png",width:"300",height:"300"}),a.createElement("img",{id:"front-gear",src:"https://imgur.com/JH1HTZE.png",width:"300",height:"300"}))}const T=function(e){var t=a.useState(!1),n=(0,o.Z)(t,2),u=n[0],s=n[1],m=a.useState(!0),d=(0,o.Z)(m,2),f=d[0],b=d[1],S=a.useState(!1),T=(0,o.Z)(S,2),M=T[0],L=T[1],I=a.useState(!1),C=(0,o.Z)(I,2),k=C[0],H=C[1],x=a.useState(!0),B=(0,o.Z)(x,2),N=B[0],q=B[1],A=a.useState(!1),P=(0,o.Z)(A,2),_=(P[0],P[1]),O=a.useState(!1),D=(0,o.Z)(O,2),Z=(D[0],D[1]),j=function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,n)};function U(e){(u&&"BeamChat"!=e||f&&"Twitch"!=e)&&(L(!1),s(!u),b(!f))}function J(){setTimeout((function(){"complete"==document.readyState?(_(!0),setTimeout((function(){q(!1)}),800)):J()}),500)}return(0,a.useEffect)((function(){h=0,p=null,g=0,v=0,y=null,E=[0];var e=c.hI.notifyListener();console.log(e);var t={width:document.getElementById("twitch-player").offsetWidth,height:document.getElementById("twitch-player").offsetHeight,channel:"jerma985",parent:[]};("complete"!=document.readyState||document.querySelector("#SamplePlayerDivID").childNodes.length<=0)&&new Twitch.Player("SamplePlayerDivID",t).setVolume(.5),j(window,"load",J);var n=document.querySelector("#twitch-chat-embed");j(n,"load",J),localStorage.getItem("user")?H(!0):H(!1)}),[N]),a.createElement(a.Fragment,null,N?a.createElement(i.gb,{isLoading:N}):"",a.createElement("div",{id:"sub-body",className:"col-lg noscroll"},a.createElement(i.vx,{popupShow:function(){if(M)return L(!1),setTimeout((function(){L(!0)}),50),k;L(!0)},loggedIn:k,logOut:H,style:N?"position-relative ":"position-relative slideInDown fast first-load "}),a.createElement("div",{className:"row h-100 d-flex flex-nowrap"},a.createElement(l.DI,null),a.createElement(l.O$,null),a.createElement("div",{className:"juicetime-column"}),a.createElement("div",{className:N?"player-container pre-load-bottom":"player-container bounceInUp normal"},a.createElement("div",{id:"twitch-player"},a.createElement("div",{id:"SamplePlayerDivID"})),a.createElement("div",{className:"ticker-outer"},a.createElement("div",{className:"ticker-wrap"},a.createElement(l.UI,{forceReload:function(){return Z}})))),a.createElement("div",{className:N?"chat-column pre-load-right":"chat-column bounceInRight normal"},a.createElement("div",{className:"chat-toggle"},a.createElement("a",{onClick:function(){return U("Twitch")},className:f?"pressed d-flex w-50 h-100":"notPressed d-flex w-50 h-100"},a.createElement("span",{className:"m-auto"},"Twitch")),a.createElement("a",{onClick:function(){return U("BeamChat")},className:u?"pressed d-flex w-50 h-100":"notPressed d-flex w-50 h-100"},a.createElement("span",{className:"m-auto"},"BeamChat"))),a.createElement("div",{className:f?"twitch-chat":"twitch-chat d-none"},a.createElement("iframe",{frameBorder:"0",id:"twitch-chat-embed",src:"https://www.twitch.tv/embed/jerma985/chat?parent=localhost"})),u?a.createElement(w,{isOpen:u}):"")),a.createElement(r.A,{setPopup:L,show:M,logIn:H})))}}}]);