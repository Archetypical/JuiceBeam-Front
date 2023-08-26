import { userConstants } from "../_constants";
import { adminService } from "../_services/";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../_helpers";

export const adminActions = {
  getAllUsers,
  getSortedUsers,
  getSortedVideos,
  getSettings,
  updateSettings,
  updateUser,
  addNewUser,
  deleteUser,
};

function getAllUsers() {
  return (dispatch) => {
    //dispatch(request());

    adminService.getAllUsers().then(
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

function getSortedUsers(params) {
  return (dispatch) => {
    //dispatch(request(params));

    adminService.getSortedUsers(params).then(
      (users) => dispatch(success(users)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request(params) {
    return { type: userConstants.GETSORTED_REQUEST, params };
  }
  function success(users) {
    return { type: userConstants.GETSORTED_SUCCESS, users };
  }
  function failure(error) {
    return { type: userConstants.GETSORTED_FAILURE, error };
  }
}

function getSortedVideos(params) {
  return (dispatch) => {

    adminService.getSortedVideos(params).then(
      (videos) => dispatch(success(videos)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function success(videos) {
    return { type: "GETVIDEOS_SUCCESS", videos };
  }
  function failure(error) {
    return { type: "GETVIDEOS__FAILURE", error };
  }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function deleteUser(id, params) {
    adminService.deleteUser(id)
    .then(() => store.dispatch(getAllUsers))
    .then(() => store.dispatch(getSortedUsers(params)));
}

function addNewUser(params) {
  return (dispatch) => {
    dispatch(request(params));

    adminService.addUser(params).then(
      (user) =>{
         dispatch(success(user));
         dispatch(getAllUsers);
         dispatch(getSortedUsers(params));
        },
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request(params) {
    return { type: userConstants.ADDNEW_REQUEST, params };
  }
  function success(user) {
    return { type: userConstants.ADDNEW_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.ADDNEW_FAILURE, error };
  }
}

function getSettings() {
  
    //dispatch(request(params));

    adminService.getSettings().then(
      (settings) => store.dispatch(success(settings)),
      (error) => store.dispatch(failure(error.toString()))
    );

  function request() {
    return { type: "GETSETTINGS_REQUEST"};
  }
  function success(settings) {
    return { type: "GETSETTINGS_SUCCESS", settings };
  }
  function failure(error) {
    return { type: "GETSETTINGS__FAILURE", error };
  }
}

function updateSettings(params) {
  adminService.updateSettings(params)
  .then(() => store.dispatch(getSettings))
  .then(() => {
    //get video data if channel name was changed
    if(params.channelName){
      store.dispatch(getSortedVideos(store.getState().videos.params));
    }
  });
}

function updateUser(user, params) {
  adminService.updateUser(user)
  .then(() => store.dispatch(getAllUsers))
  .then(() => store.dispatch(getSortedUsers(params)));
}
