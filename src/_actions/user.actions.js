import { userConstants } from "../_constants";
import { userService } from "../_services";
import { alertActions } from "./";
import { history, store } from "../_helpers";
import config from "config";
import socketIOClient from "socket.io-client";
import {
  startConfetti,
  stopConfetti,
  tickerText,
  tickerReset,
  setFire,
} from "../UserUI/event_anim";
import { getConfirmation } from "history/DOMUtils";

export const userActions = {
  login,
  twitchAuth,
  twitchHandler,
  logout,
  resetPassword,
  register,
  getEvents,
  reqSettings,
  getVideos,
  runEvent,
  checkBalance,
  updateRank,
  adminVerify,
  userVerify,
  updateLocalUser,
  notifyListener,
};

function login(username, password, from, setLogin, setPopup) {
  return async (dispatch) => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      async (user) => {
        await dispatch(success(user));
        history.push(from);
      },
      async (error) => {
        await dispatch(failure(error.toString()));
        await dispatch(alertActions.error(error.toString()));
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
        //history.push("/login");
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

function getEvents() {
  return userService.getEvents();
}

function reqSettings() {
  return userService.reqSettings();
}

function adminVerify() {
  return userService.adminVerify();
}

function userVerify() {
  return userService.userVerify();
}

function getVideos(page) {
  return userService.getVideoData(page);
}

function runEvent(event) {
  return userService.runEvent(event);
}

function checkBalance(event) {
  return userService.checkBalance(event);
}

function resetPassword(password, newPassword, confirmPassword) {
  var username = JSON.parse(localStorage.getItem("user")).username;
  return (dispatch) => {
    dispatch(request({ username }));
    if (confirmPassword != newPassword) {
      dispatch(alertActions.error("Passwords do not match"));
    } else {
      userService.resetPassword(password, newPassword).then(
        (response) => {
          dispatch(success(response));
          dispatch(alertActions.success(response.toString()));
        },
        (error) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
    }
  };

  function request(user) {
    return { type: userConstants.RESET_REQUEST, user };
  }
  function success(response) {
    return { type: userConstants.RESET_SUCCESS, response };
  }
  function failure(error) {
    return { type: userConstants.RESET_FAILURE, error };
  }
}

function twitchAuth() {
  const clientID = "2ycvvf2zsvwyvso2b8q9i9mjajs9yd";
  //const user = JSON.parse(localStorage.getItem("user"));
  const redirectLink =
    "https://id.twitch.tv/oauth2/authorize?" +
    "client_id=" +
    clientID +
    "&redirect_uri=" +
    "http://localhost:8080" +
    location.pathname +
    "&response_type=token" +
    "&scope=user:read:email%20user:read:subscriptions";
  window.location.replace(redirectLink);
}

function twitchHandler() {
  const queryString = window.location.hash.substr(1);
  const urlParams = new URLSearchParams(queryString);
  const accessCode = urlParams.get("access_token");
  return (dispatch) => {
    //dispatch(request({ username }));
    userService.twitchHandler(accessCode).then(
      (response) => {
        dispatch(success(response));
        dispatch(alertActions.success(response.toString()));
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
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function updateRank(callback) {
  var username = JSON.parse(localStorage.getItem("user")).username;
  return (dispatch) => {
    dispatch(request({ username }));
    userService.updateRank().then(
      (response) => {
        dispatch(alertActions.success("Your rank was updated successfully!"));
        callback();
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.RANKUPDATE_REQUEST, user };
  }
  function success(response) {
    return { type: userConstants.RANKUPDATE_SUCCESS, response };
  }
  function failure(error) {
    return { type: userConstants.RANKUPDATE_FAILURE, error };
  }
}

function updateLocalUser(callBack) {
  var username = JSON.parse(localStorage.getItem("user")).username;
  return (dispatch) => {
    dispatch(request({ username }));
    if (localStorage.getItem("user")) {
      userService.updateLocalUser().then(
        (user) => {
          dispatch(success(user));
          if (callBack) callBack();
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    } else console.log("No user logged in. Cannot Update.");
  };

  function request(user) {
    return { type: userConstants.UPDATE_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.UPDATE_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.UPDATE_FAILURE, error };
  }
}


function notifyListener() {
  //const socketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const echoSocketUrl = `${config.apiUrl}/notify`;
  const socket = socketIOClient(echoSocketUrl);

  console.log("Waiting for new notifications from server");

  socket.on("connect", () => {
    console.log("CONNECTED");
  });

  socket.on("event", (eventInfo) => {
    console.log(eventInfo);
    if (eventInfo.name != "off") {
      switch (eventInfo.event) {
        case "Confetti":
          startConfetti();
          break;
        case "Fire":
          setFire(true);
          break;
        default:
          break;
      }
      tickerText(eventInfo.name, eventInfo.event); //send event info to ticker box
    }
  });

  socket.on("off", () => {
    stopConfetti();
    setFire(false);
    //update user in case they were the one to buy the event
    //and we need the new juice balance
    store.dispatch(updateLocalUser());
    tickerText(null, null); //set ticker box to default after events end
  });

  socket.on("disconnect", () => {
    console.log("LOST CONNECTION");
  });
}
