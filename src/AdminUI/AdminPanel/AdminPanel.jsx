import React, { useEffect } from "react";
import "../../style/admin-page.scss";
import { history } from "../../_helpers";
import {Home, Mail, Database, List, PieChart, AlertTriangle, Sunset, Users, User, Video, Settings, Power  } from 'react-feather'
import { Router, Route, Switch, Redirect, Link, useRouteMatch } from "react-router-dom";
import { Tables } from "./Pages/Tables/";
import { Homepage } from "./Pages/Home/"

function AdminPanel() {
  const [currentTab, setTab] = React.useState("home");
  const [tableType, setTableType] = React.useState("users");
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [subNav, setSubNav] = React.useState(false);
  //const [stayOpen, setStayOpen] = React.useState(false);
  let { path, url } = useRouteMatch();
  var stayOpen = false;
  var timeout;

  function toggleSubNav(hover) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
        if (!subNav || stayOpen || hover){
            setSubNav(true);   
        }
        if (subNav && !stayOpen && !hover){
            document.querySelector(".subnav").style.animation = "retractRight 0.2s ease-in-out";
            setTimeout(() => {
                setSubNav(false);  
            }, 200);    
        }
    }, 50);
   }
    useEffect(() => {
        var subnav = document.querySelector(".subnav");
        if (subnav){
        subnav.addEventListener("mouseover", function () {
            stayOpen = true;
        });
        subnav.addEventListener("mouseout", function () {
            stayOpen = false;
            toggleSubNav();
        });
   }
   },[subNav])
  
    


  return (
    <div className="sub-body">
      <SideBar subNav={toggleSubNav} />
      {subNav ? <SubNav /> : ""}
      <Router history={history}>
        <Switch>
            <Route exact path='/admin'>
              <Homepage/>
            </Route>
            <Route path={`${path}/home`}>
              <Homepage/>
            </Route>
            <Route path={`${path}/inbox`}>
            
            </Route>
            <Route path={`${path}/tables`}>
                <Tables path={path} tableType={tableType}/>
            </Route>
            <Route path={`${path}/tasks`}>
                
            </Route>
            <Route path={`${path}/stats`}>
                
            </Route>
            <Route path={`${path}/errors`}>
                
            </Route>
            <Redirect from={`/admin/*`} to="/admin/home" />
        </Switch>
      </Router>
      
    </div>
  );
}

function SideBar(settings) {
  const [userNav, setUserNav] = React.useState(false);
  let { path, url } = useRouteMatch();

  function toggleUserNav() {
    setUserNav(!userNav);
  }

  return (
    <>
      <nav className="sidebar">
        <header className="valign-wrapper">
          <label onClick={toggleUserNav} className="valign">
            <span>
              <i>
              <User className="material-icons"/>
              </i>
            </span>
          </label>
          {userNav ? <UserNav /> : ""}
        </header>
        <main>
          <ul className="primary">
            <li className={location.pathname.includes("/home") ? "active" : ""}>
              <Link to={`${url}/home`} className="valign-wrapper ripple">
                <span className="valign">
                  <i>
                  <Home className="material-icons"/>
                  </i>
                  <p>HOME</p>
                </span>
              </Link>
            </li>
            <li className={location.pathname.includes("/inbox") ? "new-badge active" : "new-badge"} data-badge="3">
              <Link to={`${url}/inbox`} className="valign-wrapper">
                <span className="valign">
                  <i>
                  <Mail className="material-icons"/>
                  </i>
                  <p>INBOX</p>
                </span>
              </Link>
            </li>
            <li className={location.pathname.includes("/tables") ? "active" : ""}>
              <Link 
                to={`${url}/tables`}
                onMouseEnter={() => settings.subNav(true)}
                onMouseLeave={() => settings.subNav(false)}
                className="valign-wrapper ripple"
                data-sidenav="true"
              >
                <span className="valign">
                  <i>
                  <Database className="material-icons"/>
                  </i>
                  <p>TABLES</p>
                </span>
              </Link>
            </li>
          </ul>
        </main>
      </nav>
    </>
  );
}

function SubNav(settings) {
    const [tableType, setTableType] = React.useState("users");

    
    let { path, url } = useRouteMatch();

    return (
        <nav className="subnav active">
        <ul>
            <li className={location.pathname.includes("/users") ? "active" : ""}>
            <Link to={`${path}/tables/users`} className="valign-wrapper">
                <i>
                <Users className="material-icons"/>
                </i>
                <span>USERS</span>
            </Link>
            </li>
            <li className={location.pathname.includes("/events") ? "active" : ""}>
            <Link to={`${path}/tables/events`} className="valign-wrapper">
                <i>
                <Sunset className="material-icons"/>
                </i>
                <span>EVENTS</span>
            </Link>
            </li>
            <li className={location.pathname.includes("/videos") ? "active" : ""}>
            <Link to={`${path}/tables/videos`} className="valign-wrapper">
                <i>
                <Video className="material-icons"/>
                </i>
                <span>VIDEO DATA</span>
            </Link>
            </li>
        </ul>
        </nav>
    );
}

function UserNav() {
  return (
    <ul>
      <li>
        <Link className="valign-wrapper">
          <i>
          <Users className="material-icons"/>
          </i>
          <span>Manage Profile</span>
        </Link>
      </li>
      <li>
        <Link className="valign-wrapper">
          <i>
          <Settings className="material-icons"/>
          </i>
          <span>Admin Panel</span>
        </Link>
      </li>
      <li>
        <Link href="javascript:void(0)" className="valign-wrapper">
          <i>
          <Power className="material-icons"/>
          </i>
          <span>Logout</span>
        </Link>
      </li>
    </ul>
  );
}

export default AdminPanel
