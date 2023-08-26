import React, { useEffect } from "react";
import { UserComponent } from "../UserComponent";
import { NavigationBar } from "../_components";
import { userActions } from "../../_actions";
import { history } from "../../_helpers";
import { Profile } from "./Pages/Profile";
import { Discovery } from "./Pages/Discovery";
import { Settings } from "./Pages/Settings";
import { Router, Route, Switch, Redirect, Link, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AccountPage() {
  const [showPopup, setIsOpen] = React.useState(false);
  const [currentTab, setTab] = React.useState("profile");
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  let { path, url } = useRouteMatch();
  //toggles login menu
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
  
  function changePage(){
    //Update Sidebar State
    switch (location.pathname) {
      case "/account/profile":
        setTab("profile");
        break;
      case "/account/discovery":
        setTab("discovery");
        break;
      case "/account/settings":
        setTab("settings");
        break;
      default:
        setTab("profile");
        break;
    }
  }
  useEffect(() => {
    //Check if user is logged in
    if (localStorage.getItem("user")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      history.push('/');
    }
    changePage()
  }, []);

  return (
    <div id="sub-body" className="col-lg noscroll">
      {
        <NavigationBar
          popupShow={togglePopup}
          loggedIn={isLoggedIn}
          logOut={setLoggedIn}
          style="position-relative slideInDown fast first-load "
        />
      }
      <div id="account-page">
      <div id="menu-box">
        <ul id="menu">
        <Link to={`${url}/profile`}  className={currentTab == "profile" ? "icon activated" : "icon"} id="uno">
            <FontAwesomeIcon className="icon-con" icon="user">
              <div className="tooltip">
                <p>Profile</p>
              </div>
            </FontAwesomeIcon>
            <h2 className="text">Profile</h2>
          </Link>
          <Link to={`${url}/discovery`}  className={currentTab == "discovery" ? "icon activated" : "icon"} id="dos">
            <FontAwesomeIcon className="icon-con" icon="search">
              <div className="tooltip">
                <p>Discovery</p>
              </div>
            </FontAwesomeIcon>
            <h2 className="text">Discovery</h2>
          </Link>
          <Link to={`${url}/settings`} className={currentTab == "settings" ? "icon activated" : "icon"} id="tres">
            <FontAwesomeIcon className="icon-con" icon="cog">
              <div className="tooltip">
                <p>Settings</p>
              </div>
            </FontAwesomeIcon>
            <h2 className="text">Settings</h2>
          </Link>
          <a className="icon" id="cuatro">
            <FontAwesomeIcon className="icon-con cuatro" icon="power-off">
              <div className="tooltip">
                <p>Log Out</p>
              </div>
            </FontAwesomeIcon>
            <h2 className="text">Log Out</h2>
          </a>
        </ul>
      </div>
      <Router history={history}>
        <Switch>
          <Route path={`${path}/profile`} >
            <Profile changePage={changePage} userActions={userActions}/>
          </Route>
          <Route path={`${path}/discovery`}>
            <Discovery changePage={changePage}/>
          </Route>
          <Route path={`${path}/settings`}>
            <Settings changePage={changePage}/>
          </Route>
          <Redirect from="/account" to={`${path}/profile`} />
        </Switch>
      </Router>
      </div>
      {
        <UserComponent
          setPopup={setIsOpen}
          show={showPopup}
          logIn={setLoggedIn}
        />
      }
    </div>
  );
}

export { AccountPage };
