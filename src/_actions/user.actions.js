import { userConstants } from "../_constants";
import { userService } from "../_services";
import { alertActions } from "./";
import { history } from "../_helpers";
import config from "config";
import { startConfetti, stopConfetti } from "../event_anim";

export const userActions = {
  login,
  logout,
  register,
  getEvents,
  runEvent,
  checkBalance,
  notifyListener,
  getAll,
  delete: _delete,
};

function login(username, password, from, setLogin, setPopup) {
  return (dispatch) => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      (user) => {
        dispatch(success(user));
        history.push(from);
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    setLogin(true);
    setPopup(false);
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function register(user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.register(user).then(
      (user) => {
        dispatch(success());
        history.push("/login");
        dispatch(alertActions.success("Registration successful"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

function getAll() {
  return (dispatch) => {
    dispatch(request());

    userService.getAll().then(
      (users) => dispatch(success(users)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: userConstants.GETALL_REQUEST };
  }
  function success(users) {
    return { type: userConstants.GETALL_SUCCESS, users };
  }
  function failure(error) {
    return { type: userConstants.GETALL_FAILURE, error };
  }
}

function getEvents() {
  let user = JSON.parse(localStorage.getItem("user"));
  return userService.getEvents(user.username);
}

function runEvent(event) {
  let user = JSON.parse(localStorage.getItem("user"));
  return userService.runEvent(user.username, event);
}

function checkBalance(event) {
  let user = JSON.parse(localStorage.getItem("user"));
  return userService.checkBalance(user.username, event);
}

function notifyListener() {
  const socketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const echoSocketUrl = socketProtocol + `${config.apiUrl}/notify`;
  const socket = new WebSocket(echoSocketUrl.replace("http:", ""));

  console.log("Waiting for new notifications from server");
  socket.onopen = function(event) {
    console.log('CONNECTED');
    socket.send("Client Connected")
  };
  
  socket.onmessage = (event) => {
    var eventInfo = event.data.split(" ");
    console.log(eventInfo);
    if (eventInfo[0] == "off") stopConfetti();
    if(eventInfo[1] == "Confetti") startConfetti();
  };

  socket.onclose = function(event) {
    console.log('LOST CONNECTION');
  };
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return (dispatch) => {
    dispatch(request(id));

    userService.delete(id).then(
      (user) => dispatch(success(id)),
      (error) => dispatch(failure(id, error.toString()))
    );
  };

  function request(id) {
    return { type: userConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: userConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: userConstants.DELETE_FAILURE, id, error };
  }
}
