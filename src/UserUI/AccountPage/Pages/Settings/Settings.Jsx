import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions, alertActions } from "../../../../_actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";

function Settings(settings) {
  //c******@l***.com
  //Admin
  const user = JSON.parse(localStorage.getItem("user"));
  const [popupCase, setPopupCase] = useState("none");
  const [showPopup, setIsOpen] = React.useState(false);

  useEffect(() => {
    settings.changePage();
  }, []);

  function togglePass(){
    setPopupCase("password");
    openPopup();
  }
  function toggleName(){
    setPopupCase("username");
    openPopup();
  }
  
  function openPopup(){
    setIsOpen(true);
  }
  function closePopup(){
    setIsOpen(false);
  }

  return (
    <section id="settings-background" className="slideInRight fast">
      <div id="settings-wrap">
        <h1 className="settings-section-header">Account Settings</h1>
        <div id="profile-settings">
            <div className="settings-section-top">
              <div id="label-container">
                <label className="field-title menu-label">Email</label>
              </div>
              <div id="settings-input-container">
                <div id="settings-input-row">
                  <input className="settings-input" value={user.username} disabled></input>
                  <button className="edit-button"><FontAwesomeIcon id="edit-icon" icon="edit"/></button>
                </div>
                <p id="settings-description"> You will recieve an confirmation email upon updating your address. </p>
              </div>
            </div>
            <div className="settings-section">
              <div id="label-container">
                <label className="field-title menu-label">Username</label>
              </div>
              <div id="settings-input-container">
                <div id="settings-input-row">
                  <input className="settings-input" value={user.username} disabled></input>
                  <button onClick={toggleName} className="edit-button"><FontAwesomeIcon id="edit-icon" icon="edit"/></button>
                </div>
                <p id="settings-description"> Change your account username. </p>
              </div>
            </div>
            <div className="settings-section">
              <div id="label-container">
                <label className="field-title menu-label">Password</label>
              </div>
              <div id="settings-input-container">
                <div id="settings-input-row">
                  <p id="settings-description">
                    <a onClick={togglePass} id="text-link">Click here </a>
                    to reset your Password.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h1 className="settings-section-header">Twitch Account Settings</h1>
        </div>
        <Modal
          isOpen={showPopup}
          onRequestClose={closePopup}
          overlayClassName="popup-lightbox"
          className="login-box"
          closeTimeoutMS={500}
          shouldCloseOnOverlayClick={true}
        >
        {popupCase == "password" ? <ResetPassword/> : ""}
        {popupCase == "username" ? <ResetUsername/> : ""}
        </Modal>
    </section>
  );
}

function ResetPassword(settings){
  //Window Visibility Handler Start
  const [inputs, setInputs] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { currentPassword, newPassword, confirmPassword } = inputs;
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert);
  
  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);
    if (currentPassword && newPassword && confirmPassword) {
     dispatch(userActions.resetPassword(currentPassword, newPassword, confirmPassword));
     setSubmitted(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  useEffect(() => {
    dispatch(alertActions.clear());
  }, [submitted]);
  

return(
 <>
      <form name="form" onSubmit={handleSubmit}>
        <div className="form-group overflow-hidden">
          <div className="user-box slideInLeft first">
            <label className="field-title"> Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handleChange}
              className={ "form-control" + (submitted && !currentPassword ? " is-invalid" : "")}
            />
            {submitted && !currentPassword && (
              <div className="invalid-feedback">Password is required</div>
            )}
          </div>
        </div>
        <div className="form-group overflow-hidden">
          <div className="user-box slideInLeft second">
            <label className="field-title">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              className={ "form-control" + (submitted && !newPassword ? " is-invalid" : "")}
            />
            {submitted && !newPassword && (
              <div className="invalid-feedback">Password is required</div>
            )}
          </div>
        </div>
        <div className="form-group overflow-hidden">
          <div className="user-box slideInLeft third">
            <label className="field-title">Re-Type New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className={ "form-control" + (submitted && !confirmPassword ? " is-invalid" : "")}
            />
            {submitted && !confirmPassword && (
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
            { <span className="spinner-border spinner-border-sm" style={{bottom: 15 + "px", left: 20 + 'px'}}></span>}
            Reset
          </button>
        </div>
      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}
    </form>
    </>

);
}


function ResetUsername(){
  const [inputs, setInputs] = useState({
    username: "",
  });
  const { username } = inputs;
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);
    if (username) {
      // get return url from location state or default to home page
      const { from } = location.pathname || { from: { pathname: "/" } };
      //dispatch(userActions.resetUsername(username, settings.setPopup));
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

return(
      <form name="form" onSubmit={handleSubmit}>
        <div className="form-group overflow-hidden">
          <div className="user-box slideInLeft second">
            <label className="field-title">Username</label>
            <input
              type="username"
              name="username"
              value={username}
              onChange={handleChange}
              className={ "form-control" + (submitted && !username ? " is-invalid" : "")}
            />
            {submitted && !username && (
              <div className="invalid-feedback">Username is required</div>
            )}
          </div>
        </div>
        <div className="form-group mb-2">
          <button>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            { <span className="spinner-border spinner-border-sm" style={{bottom: 15 + "px", left: 20 + 'px'}}></span>}
            Change
          </button>
        </div>
      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}
    </form>
);
}

export { Settings };
