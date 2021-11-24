import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserComponent } from "../UserComponent";
import { NavigationBar } from "../_components";
import { userActions } from "../_actions";
import ReactDOM from "react-dom";

function HomePage() {
  //const users = useSelector(state => state.users);
  //const user = useSelector(state => state.authentication.user);
  //const dispatch = useDispatch();

  //useEffect(() => {
  //    dispatch(userActions.getAll());
  //}, []);

  //function handleDeleteUser(id) {
  //    dispatch(userActions.delete(id));
  //}
  const [showPopup, setIsOpen] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  //user.username will display current user

  function togglePopup() {
    if (showPopup) {
      setIsOpen(false);
      //opens the login menu again after page rerender
      setTimeout(() => {
        setIsOpen(true);
      }, 50);
      return (isLoggedIn);
    }
    setIsOpen(true);
  }
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setLoggedIn(true);
    }
    else {
      setLoggedIn(false);
    }
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
  }, []);
  //{!isLoggedIn ? "" : user.username}
  return (
    <span id="sub-body" className="col-lg">
      {<NavigationBar logOut={setLoggedIn} popupShow={togglePopup} loggedIn={isLoggedIn} style="position-fixed"/>}
      <div className="row">
        <div className="background-overlay"></div>
        <div className="d-flex col-lg-7">
          <span className="header-container">
            <h2 className="heading-title-1 slideInLeft fast third-load">
              Welcome to
            </h2>
            <span className="typing-container">
              <span id="type-text" className="heading-title-2"></span>
              <span className="typed-cursor">|</span>
            </span>
            <h2 className="heading-title-3 tada fast fourth-load">
              "Where real and unreal is only a matter of perspective."
            </h2>
          </span>
        </div>
        <div className="col-lg">
          <div className="tank-box slideInDown fast second-load">
            <img
              className="tank_bottom"
              src="../src/images/Tank_Ends-1.webp"
            ></img>
            <div id="glass"></div>
            <div id="container">
              <canvas id="liquid" width="280" height="340"></canvas>
            </div>
          </div>
        </div>
      </div>
      {<UserComponent setPopup={setIsOpen} show={showPopup} logIn={setLoggedIn} />}
    </span>
  );
}

export { HomePage };
