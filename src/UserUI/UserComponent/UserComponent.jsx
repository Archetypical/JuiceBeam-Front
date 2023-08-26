import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { userActions, alertActions } from "../../_actions";

Modal.setAppElement("#app");

function UserComponent(settings) {
  const alert = useSelector((state) => state.alert);
  //Window Visibility Handler Start
  const [showPopup, setIsOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState(false);
  const [twitchFill, setTwitchFill] = React.useState({fill: null, value1: null, value2: null});
  const dispatch = useDispatch();

  function openPopup() {
    setIsOpen(true);
  }

  function closePopup() {
    setIsOpen(false);
  }

  async function twitchResponse(){
    dispatch(userActions.twitchHandler());
    setTimeout(() => {
      window.history.replaceState(null, "", location.pathname);
      settings.logIn(true);
      closePopup();
    }, 1000);
  }

  //check if popup should open or close on rerender
  useEffect(() => {
    if (settings.show) {
      if(showPopup){
        if(window.location.href.includes("access_token=")){
          twitchResponse();
        }
      }
      else openPopup();
    }
    if (!settings.show) {
      //dispatch(alertActions.clear());
      closePopup();
    }
  }, [settings]);

  function handleClick(button) {
    if (newUser && button != "signUp") {
      setNewUser(false);
    } else if (!newUser && button != "signIn") {
      setNewUser(true);
    }
  }

  //Window Visibility Handler End

  return (
    <Modal
      isOpen={showPopup}
      onRequestClose={closePopup}
      overlayClassName="popup-lightbox"
      className="login-box"
      closeTimeoutMS={500}
      shouldCloseOnOverlayClick={true}
    >
      <div className="row">
        <h2
          className={!newUser ? "active col-lg" : "inactive col-lg"}
          onClick={() => handleClick("signIn")}
        >
          Sign In
        </h2>
        <h2
          className={newUser ? "active col-lg" : "inactive col-lg"}
          onClick={() => handleClick("signUp")}
        >
          Sign Up
        </h2>
      </div>

      {newUser ? <SignUp /> : <SignIn setPopup={settings.setPopup} logIn={settings.logIn}/>}
    </Modal>
  );
}

function SignIn(settings) {
  const alert = useSelector((state) => state.alert);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  const loggingIn = useSelector((state) => state.authentication.loggingIn);
  const dispatch = useDispatch();
  const location = useLocation();

  // reset login status
  useEffect(() => {
    dispatch(alertActions.clear());
    //    dispatch(userActions.logout());
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);
    if (username && password) {
      // get return url from location state or default to home page
      const { from } = location.pathname || { from: { pathname: "/" } };
      dispatch(userActions.login(username, password, from, settings.logIn, settings.setPopup));
    }
  }

  function twitchLogin(){
    userActions.twitchAuth();
  }


  return (
    <>
    <form name="form" onSubmit={handleSubmit}>
      <div className="form-group overflow-hidden">
        <div className="user-box slideInLeft first">
          <label className="field-title">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            className={
              "form-control mb-0" + (submitted && !username ? " is-invalid" : "")
            }
          />
          {submitted && !username && (
            <div className="invalid-feedback">Username is required</div>
          )}
        </div>
      </div>
      <div className="form-group overflow-hidden">
        <div className="user-box slideInLeft second">
          <label className="field-title">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className={
              "form-control" + (submitted && !password ? " is-invalid" : "")
            }
          />
          {submitted && !password && (
            <div className="invalid-feedback">Password is required</div>
          )}
        </div>
      </div>
      <div className="form-group mb-2">
        <button>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          {loggingIn && (
            <span className="spinner-border spinner-border-sm" style={{bottom: 15 + "px", left: 20 + 'px'}}></span>
          )}
          Sign In
        </button>
        <h1>or</h1>
        <button onClick ={twitchLogin}>Login with Twitch</button>
      </div>
      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}
    </form>
    
    </>
  );
}

function SignUp() {
  //Register Verification Start
  const alert = useSelector((state) => state.alert);
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const registering = useSelector((state) => state.registration.registering);
  const dispatch = useDispatch();

  // clear alerts on rerender
  useEffect(() => {
    dispatch(alertActions.clear());
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);
    if (user.email && user.username && user.password) {
      dispatch(userActions.register(user));
    }
  }
  //Register Verification End

  return (
    <form name="form" onSubmit={handleSubmit}>
      <div className="form-group mb-0 overflow-hidden">
        <div className="user-box slideInLeft first">
          <label className="field-title">Email Address</label>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={
              "form-control" + (submitted && !user.email ? " is-invalid" : "")
            }
          />
          {submitted && !user.email && (
            <div className="invalid-feedback">Email Address is required</div>
          )}
        </div>
      </div>
      <div className="form-group overflow-hidden">
        <div className="user-box slideInLeft first">
          <label className="field-title">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className={
              "form-control" +
              (submitted && !user.username ? " is-invalid" : "")
            }
          />
          {submitted && !user.username && (
            <div className="invalid-feedback">Username is required</div>
          )}
        </div>
      </div>
      <div className="form-group overflow-hidden">
        <div className="user-box slideInLeft second">
          <label className="field-title">Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className={
              "form-control mb-0" + (submitted && !user.password ? " is-invalid" : "")
            }
          />
          {submitted && !user.password && (
            <div className="invalid-feedback">Password is required</div>
          )}
        </div>
      </div>
      <div className="form-group mb-2">
        <button>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          {registering && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          Sign Up
        </button>
      </div>
      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}
    </form>
  );
}

export { UserComponent };
