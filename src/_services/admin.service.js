import config from "config";
import { authHeader, history } from "../_helpers";



export const adminService = {
  getAllUsers,
  getSortedUsers,
  getSortedVideos,
  getSettings,
  updateSettings,
  getUser,
  updateUser,
  addUser,
  deleteUser,
};

function getAllUsers() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/admin/users/list/all-data`, requestOptions)
  .then(handleResponse)
  .then((response) => {
    return {
      allData: response[1]
    }
  });
}

async function getSortedUsers(params) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

    var response = await fetch(`${config.apiUrl}/admin/users/list/data/${new URLSearchParams(params)}`, requestOptions)
    .then(handleResponse)
    .then((response) => {
      return {
        params,
        data: response[1].users,
        totalPages: response[1].total,
      };
    });

    return response;
}


async function getSortedVideos(params) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

    var response = await fetch(`${config.apiUrl}/admin/videos/list/${new URLSearchParams(params)}`, requestOptions)
    .then(handleResponse)
    .then((response) => {
      return {
        data: response[1].videos,
        allData: response[1].allData,
        total: response[1].total,
        params,
      };
    });

    return response;
}

async function getUser(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  return await fetch(`${config.apiUrl}/admin/users/${id}`, requestOptions).then(
    handleResponse
  );
}

async function updateUser(params) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  return await fetch(`${config.apiUrl}/admin/users/update`, requestOptions).then(handleResponse);
}

async function addUser(params) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };

  return fetch(`${config.apiUrl}/admin/users/add-user`, requestOptions).then(
    handleResponse
  );
}

async function updateSettings(params) {
  const requestOptions = {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };

  return fetch(`${config.apiUrl}/admin/settings`, requestOptions).then(handleResponse);
}

async function getSettings(){
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/admin/settings`, requestOptions)
  .then(handleResponse)
  .then(response => {
    return {
      api: response[1].api,
      accounts: response[1].accounts,
      videoParam: response[1].videoParam,
      eventParam: response[1].eventParam,
    }
  });
}


async function deleteUser(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
  };
  return await fetch(`${config.apiUrl}/admin/users/delete/${id}`, requestOptions).then(
    handleResponse
  );
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
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

