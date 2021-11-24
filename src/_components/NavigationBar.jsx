import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { userActions } from "../_actions";
import {
  CogIcon,
  ChevronIcon,
  ArrowIcon,
  BoltIcon,
  BurgerIcon,
} from "../icons";
import { BiLogOut } from "react-icons/bi";
import { history } from "../_helpers";
import { Link } from "react-router-dom";

function NavigationBar(settings) {
  const [open, setOpen] = useState(false);
  const [exitMenu, setExitMenu] = useState(false);
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(history.location.pathname);
  }, [settings.loggedIn]);

  function togglePopup() {
    settings.popupShow();
  }

  function toggleMenu() {
    if (open) {
      setExitMenu(true);
      setTimeout(() => {
        setOpen(!open);
      }, 500);
    } 
    else {
      setExitMenu(false);
      setOpen(!open);
    }
  }

  return (
    <div
      id="header"
      className={settings.style + " d-flex slideInDown fast first-load"}
    >
      <a href="/">
        <img className="logo" src="../src/images/JuiceBeam-Logo-text.png"></img>
      </a>
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
      <button
        type="button"
        onClick={!settings.loggedIn ? togglePopup : toggleMenu}
        className={
          !settings.loggedIn
            ? "elementor-button desktop"
            : "account-button mobile"
        }
        id="signin"
      >
        {!settings.loggedIn ? "SIGN IN" : "MY ACCOUNT"}
      </button>
      {open && settings.loggedIn ? (
        <DropdownMenu logOut={settings.logOut} exitMenu={exitMenu} />
      ) : (
        ""
      )}
      <BurgerIcon />
    </div>
  );
}
function DropdownMenu(controller) {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  let user;

  function Username() {
    user = JSON.parse(localStorage.getItem("user"));
    return user.username;
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
      <a
        href="#"
        className="menu-option"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div
      className={
        !controller.exitMenu
          ? "dropdown slideInRight fast"
          : "dropdown slideOutLeft fast"
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
          <DropdownItem>{<Username />}'s Profile</DropdownItem>
          <DropdownItem
            leftIcon={<CogIcon />}
            rightIcon={<ChevronIcon />}
            goToMenu="settings"
          >
            Settings
          </DropdownItem>
          <DropdownItem
            leftIcon="🦧"
            rightIcon={<ChevronIcon />}
            goToMenu="animals"
          >
            Animals
          </DropdownItem>
          <DropdownItem
            leftIcon={<BiLogOut />}
            rightIcon={<ChevronIcon />}
            goToMenu={logout}
          >
            Logout
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
            <h2>My Tutorial</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>HTML</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>CSS</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>JavaScript</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>Awesome!</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "animals"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
            <h2>Animals</h2>
          </DropdownItem>
          <DropdownItem leftIcon="🦘">Kangaroo</DropdownItem>
          <DropdownItem leftIcon="🐸">Frog</DropdownItem>
          <DropdownItem leftIcon="🦋">Horse?</DropdownItem>
          <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

export { NavigationBar };
