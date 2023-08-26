import config from "config";
import { authHeader, history } from "../_helpers";

export const userService = {
  login,
  twitchHandler,
  updateLocalUser,
  logout,
  resetPassword,
  register,
  getEvents,
  reqSettings,
  getVideoData,
  runEvent,
  checkBalance,
  updateRank,
  adminVerify,
  userVerify,
};

async function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem("user", JSON.stringify(user));
      //document.cookie = JSON.stringify(user);
      return user;
    });
}

async function updateLocalUser() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  const newUser = await fetch(`${config.apiUrl}/users/update`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      let newData = JSON.stringify(user); //store the new updated user data as a string
      localStorage.setItem("user", newData); //put the new updated data into local storage
      newData = JSON.parse(localStorage.getItem("user")); //store the new completed user data as object to be returned
      //document.cookie = JSON.stringify(user);
      return newData;
    })
    .catch(() => {
      return false;
    });
  return newUser;
}

async function twitchHandler(accessCode) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessCode }),
  };

  return fetch(`${config.apiUrl}/users/twitch`, requestOptions)
    .then(handleResponse)
    .then((response) => {
      localStorage.setItem("user", JSON.stringify(response.user));
      console.log(response);
      response = "Login Successful";
      return response;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
  if (location.pathname.includes("/account")) {
    //history.push("/");
  }
}

async function resetPassword(password, newPassword) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ password, newPassword }),
  };
  return fetch(`${config.apiUrl}/users/password`, requestOptions)
    .then(handleResponse)
    .then((response) => {
      return response;
    });
}

function getEvents() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/events`, requestOptions)
    .then(handleResponse)
    .then((events) => {
      return events;
    });
}

function reqSettings() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/admin/settings/user`, requestOptions)
    .then(handleResponse)
    .then((settings) => {
      return settings;
    });
}

async function getVideoData(page) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/videos/${page}`, requestOptions)
    .then(handleResponse)
    .then((videos) => {
      return videos;
    });
}

function runEvent(eventname) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ eventname }),
  };
  return fetch(`${config.apiUrl}/events/run`, requestOptions)
    .then(handleResponse)
    .then((status) => {
      return status;
    });
}

function checkBalance(event) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/users/balance/${event}`, requestOptions)
    .then(handleResponse)
    .then((isEnough) => {
      return isEnough;
    });
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`${config.apiUrl}/users/register`, requestOptions).then(
    handleResponse
  );
}

async function updateRank() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  const response = await fetch(`${config.apiUrl}/users/rank`, requestOptions)
    .then(handleResponse)
    .then((response) => {
      return response;
    });
  return response;
}

//ask backend if current user is an admin
async function adminVerify(user) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return fetch(`${config.apiUrl}/admin/`, requestOptions)
    .then(handleResponse)
    .then((response) => {
      return response;
    })
    .catch(() => {
      return false;
    });
}

//ask backend if current user is valid
async function userVerify(user) {
    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };
    return fetch(`${config.apiUrl}/users/`, requestOptions)
      .then(handleResponse)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return false;
      });
  }

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 Unauthorized response returned from api
        //logout();
        //location.reload(true);
        console.log("Error 401!");
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
