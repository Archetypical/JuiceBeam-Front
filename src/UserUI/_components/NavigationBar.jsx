import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { userActions } from "../../_actions";
import logo from "../../images/JuiceBeam-Logo-Large.png";
import {
  CogIcon,
  ChevronIcon,
  ArrowIcon,
  BoltIcon,
  BurgerIcon,
} from "../icons";
import { User, Lock } from "react-feather";
import { BiLogOut } from "react-icons/bi";
import { history } from "../../_helpers";
import { Link } from "react-router-dom";

function NavigationBar(settings) {
  const [open, setOpen] = useState(false);
  const [exitMenu, setExitMenu] = useState(false);
  const [path, setPath] = useState("/");

  const [showNavBar, setNavBar] = useState(false);
  var user;

  useEffect(() => {
    setPath(history.location.pathname);
    if (window.location.href.includes("access_token=")) {
      togglePopup(); //open login window if twitch auth token is in url
    }
  }, [settings.loggedIn, showNavBar, open]);

  function togglePopup() {
    settings.popupShow();
  }

  function Username() {
    user = JSON.parse(localStorage.getItem("user"));
    return user.username;
  }

  // open and close profile menu
  function toggleMenu() {
    if (open) {
      setExitMenu(true);
      setTimeout(() => {
        setOpen(!open);
      }, 400);
    } else {
      setExitMenu(false);
      setOpen(!open);
    }
  }

  return (
    <div id="header" className={settings.style + "d-flex"}>
      <Link to="/" className="logo-container">
        <img
          className="logo"
          src={logo}
        ></img>
        <div className="site-title">
          <div className="title-top"></div>
          <div className="title-bottom"></div>
        </div>
      </Link>
      <nav
        migration_allowed="1"
        migrated="0"
        role="navigation"
        className="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-framed e--animation-corners mobile"
      >
        <ul id="menu-1-36d4b892" className="elementor-nav-menu">
          <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-8 current_page_item menu-item-891">
            <Link
              to="/"
              className={
                path == "/"
                  ? "elementor-item elementor-item-active"
                  : "elementor-item"
              }
            >
              Home
            </Link>
          </li>
          <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-83">
            <Link
              to="/stream"
              className={
                path == "/stream"
                  ? "elementor-item elementor-item-active"
                  : "elementor-item"
              }
            >
              Stream
            </Link>
          </li>
          <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-81">
            <a
              href="/archive"
              className={
                path == "/archive"
                  ? "elementor-item elementor-item-active"
                  : "elementor-item"
              }
            >
              Archive
            </a>
          </li>
          <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-80">
            <a
              href="/about"
              className={
                path == "/about"
                  ? "elementor-item elementor-item-active"
                  : "elementor-item"
              }
            >
              About
            </a>
          </li>
        </ul>
      </nav>
      <div
        onClick={!settings.loggedIn ? togglePopup : toggleMenu}
        className="account-nav-wrap"
      >
        <div className={settings.loggedIn ? "account-icon" : "login-icon"}>
          {settings.loggedIn ? <User /> : <Lock />}
        </div>
        <div className="account-nav-text">
          {settings.loggedIn ? "Profile" : "Login"}
        </div>
      </div>
      {open && settings.loggedIn ? (
        <DropdownMenu
          path={path}
          logOut={settings.logOut}
          exitMenu={exitMenu}
          toggleMenu={toggleMenu}
          toggleBubble={settings.toggleBubble}
          forceReload={settings.forceReload}
        />
      ) : (
        ""
      )}

      <BurgerIcon onClick={toggleNavBar} fuckYou={toggleNavBar} showNavBar={showNavBar} />
      {showNavBar ? <DropdownNavBar path={path} /> : ""}
    </div>
  );
  function toggleNavBar() {
    var dropDown = document.querySelector(".nav-menu-dropdown_container");
    if (showNavBar) {
      dropDown.classList.add("closeDropdown");
      setTimeout(() => {
        setNavBar(!showNavBar);
      }, 500);
    } else {
      setNavBar(!showNavBar);
    }
  }
}

function DropdownNavBar(settings) {
  return (
    <nav className="nav-menu-dropdown_container">
      <ul className="nav-menu-dropdown">
        <li className="nav-menu-dropdown_item-container">
          <Link
            to="/"
            className={
              settings.path == "/"
                ? "nav-menu-dropdown_item-active"
                : "nav-menu-dropdown_item"
            }
          >
            Home
          </Link>
        </li>
        <li className="nav-menu-dropdown_item-container">
          <Link
            to="/stream"
            className={
              settings.path == "/stream"
                ? "nav-menu-dropdown_item-active"
                : "nav-menu-dropdown_item"
            }
          >
            Stream
          </Link>
        </li>
        <li className="nav-menu-dropdown_item-container">
          <Link
            to="/archive"
            className={
              settings.path == "/archive"
                ? "nav-menu-dropdown_item-active"
                : "nav-menu-dropdown_item"
            }
          >
            Archive
          </Link>
        </li>
        <li className="nav-menu-dropdown_item-container">
          <Link
            to="/about"
            className={
              settings.path == "/about"
                ? "nav-menu-dropdown_item-active"
                : "nav-menu-dropdown_item"
            }
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function DropdownMenu(controller) {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const [forceReload, setForceReload] = useState(false);
  const [sanity, setSanity] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  let user;
  var checkValue;
  var settings;

  function bubbleToggle() {
    checkValue = JSON.parse(localStorage.getItem("settings"));
    settings = JSON.stringify(settings);
    if (checkValue.bubbleState) {
      settings = { bubbleState: false, sanity: checkValue.sanity };
      settings = JSON.stringify(settings);
      localStorage.setItem("settings", settings);
      if (controller.path == "/") {
        controller.toggleBubble();
      }
      controller.toggleMenu();
      setForceReload(!forceReload);
    } else {
      settings = { bubbleState: true, sanity: checkValue.sanity };
      settings = JSON.stringify(settings);
      localStorage.setItem("settings", settings);
      if (controller.path == "/") {
        controller.toggleBubble(); //turn off bubbles on homepage and remount
      }
      controller.toggleMenu();
      setForceReload(!forceReload);
    }
  }

  function sanityToggle() {
    checkValue = JSON.parse(localStorage.getItem("settings"));
    settings = JSON.stringify(settings);
    if (checkValue.sanity) {
      settings = { bubbleState: checkValue.bubbleState, sanity: false };
      settings = JSON.stringify(settings);
      localStorage.setItem("settings", settings);
      setForceReload(!forceReload);
      sanityInit();
      if (controller.path == "/") {
        controller.forceReload();
      }
    } else {
      settings = { bubbleState: checkValue.bubbleState, sanity: true };
      settings = JSON.stringify(settings);
      localStorage.setItem("settings", settings);
      setForceReload(!forceReload);
      sanityInit();
      if (controller.path == "/") {
        controller.forceReload();
      }
    }
  }
  function sanityInit() {
    checkValue = JSON.parse(localStorage.getItem("settings"));
    var r = document.querySelector(":root");
    if (!checkValue.sanity) {
      r.style.setProperty("--color-text-primary", "#2df702");
      r.style.setProperty("--color-overlay", "#fff0");
      r.style.setProperty("--color-main-var-1", "#22c200cc");
      r.style.setProperty("--color-main-var-1-hover", "#02860a9e");
      r.style.setProperty("--color-main-var-2", "#00ff104f");
      r.style.setProperty("--color-main-var-3", "#00570ca8");
      r.style.setProperty("--color-main-var-4", "#05d52194");

      setSanity(true);
    } else {
      r.style.setProperty("--color-text-primary", "#df0000");
      r.style.setProperty(
        "--color-overlay",
        "radial-gradient(#df0000a8, #000500c7)"
      );
      r.style.setProperty("--color-main-var-1", "#ff0000cc");
      r.style.setProperty("--color-main-var-1-hover", "#e711119e");
      r.style.setProperty("--color-main-var-2", "#ff000040");
      r.style.setProperty("--color-main-var-3", "#ff525294");
      r.style.setProperty("--color-main-var-4", "#ff000063");

      setSanity(false);
    }
  }
  function Username() {
    user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return user.username;
    }
    return "";
  }

  function logout() {
    dispatch(userActions.logout());
    controller.logOut(false);
    //window.location.reload(false);
  }

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <div
        href="#"
        className="menu-option"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </div>
    );
  }

  function DropdownMitem(props) {
    return (
      <div href="#" className="menu-option" onClick={sanityToggle}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </div>
    );
  }

  function alignDropdown(){
    if(!controller.exitMenu){
      let profileButton = document.querySelector(".account-nav-wrap");
      document.querySelector(".account-dropdown").style.transition = "none";
      document.querySelector(".account-dropdown").style.left = profileButton.offsetLeft + "px";
    }
  }

  let alignEvent;

  useEffect(() => {
    console.log("menu reloaded");
    sanityInit();
    if(!alignEvent){
      alignDropdown();
      alignEvent = window.addEventListener("resize", () => alignDropdown());
    }
  }, [forceReload]);

  return (
    <div
      className={
        !controller.exitMenu && !forceReload
          ? "account-dropdown slideInRight fast"
          : "account-dropdown slideOutLeft fast"
      }
      ref={dropdownRef}
    >
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem>
            <Link to="/account"> {<Username />}'s Profile </Link>
          </DropdownItem>
          <DropdownItem
            leftIcon={<CogIcon />}
            rightIcon={<ChevronIcon />}
            goToMenu="settings"
          >
            <a>Settings</a>
          </DropdownItem>
          {!sanity ? (
            <DropdownItem
              leftIcon="🥩"
              rightIcon={<ChevronIcon />}
              goToMenu="beasts"
            >
              <a>
                <h1 className="gateway" title="STOP.">
                  STOP.
                </h1>
              </a>
            </DropdownItem>
          ) : (
            ""
          )}
          <DropdownItem
            leftIcon={<BiLogOut />}
            rightIcon={<ChevronIcon />}
            goToMenu={logout}
          >
            <a>Logout</a>
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "settings"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
            <a>
              <h2>Settings</h2>
            </a>
          </DropdownItem>
          <DropdownItem goToMenu={bubbleToggle} leftIcon={<BoltIcon />}>
            <a>Toggle Bubbles</a>
          </DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>
            <a>Toggle Load Screen</a>
          </DropdownItem>
          <DropdownMitem leftIcon={<BoltIcon />}>
            <a>Sanity Filter</a>
          </DropdownMitem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "beasts"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
            <a>
              <h2>Beasts</h2>
            </a>
          </DropdownItem>
          <DropdownItem leftIcon="🩸">
            <a>Hubris.</a>
          </DropdownItem>
          <DropdownItem leftIcon="⛓">
            <a>Scorn.</a>
          </DropdownItem>
          <DropdownItem leftIcon="👁">
            <a>Envy.</a>
          </DropdownItem>
          <DropdownItem leftIcon="🖤">
            <a>Ruin.</a>
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

export { NavigationBar };
