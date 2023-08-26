// ** React Imports
import React from "react";
import { Link } from "react-router-dom";

// ** Store & Actions
import { adminActions } from "../../../../../../_actions/admin.actions";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../../../../../_helpers/store"

// ** Icons Imports
import {
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  Trash2,
  Archive,
} from "react-feather";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// ** Renders Client Columns
const renderClient = (row) => {
  const stateNum = Math.floor(Math.random() * 6),
    states = [
      "light-success",
      "light-danger",
      "light-warning",
      "light-info",
      "light-primary",
      "light-secondary",
    ],
    color = states[stateNum];
};

// ** Renders Role Columns
const renderRole = (row) => {
  const roleObj = {
    User: {
      class: "text-primary",
      icon: User,
    },
    Moderator: {
      class: "text-info",
      icon: Edit2,
    },
    Admin: {
      class: "text-danger",
      icon: Slack,
    },
  };

  const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2;

  return (
    <span className="text-truncate text-capitalize align-middle">
      <Icon
        size={18}
        className={`${roleObj[row.role] ? roleObj[row.role].class : ""} me-50`}
      />
      {row.role}
    </span>
  );
};

const statusObj = {
  pending: "light-warning",
  active: "light-success",
  inactive: "light-secondary",
};


export const columns = (updateUser) => {
  //turn columns information into a function
  //this way it can be passed functions
  //this means those functions can use context applicable to the row
  return[
    {
      name: "User",
      sortable: true,
      minWidth: "300px",
      sortField: "username",
      selector: (row) => row.username,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          {renderClient(row)}
          <div className="d-flex flex-column">
            <a
              className="user_name text-truncate text-body"
              onClick={() => {
                var currentUser;
                const users = store.getState().users.data;
                for(const user in users){
                  if (users[user].id == row.id){
                    currentUser = users[user];
                  }
                }
                updateUser(currentUser);
              }}
            >
              <span className="fw-bolder">{row.username}</span>
            </a>
            <small className="text-truncate text-muted mb-0">{row.email}</small>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      sortable: true,
      minWidth: "172px",
      sortField: "role",
      selector: (row) => row.role,
      cell: (row) => renderRole(row),
    },
    {
      name: "Rank",
      minWidth: "138px",
      sortable: true,
      sortField: "rank",
      selector: (row) => row.rank,
      cell: (row) => <span className="text-capitalize">{row.rank}</span>,
    },
    {
      name: "Twitch ID",
      minWidth: "230px",
      sortable: true,
      sortField: "twitchID",
      selector: (row) => row.twitchID,
      cell: (row) => <span className="text-capitalize">{row.twitchID}</span>,
    },
    {
      name: "Points",
      minWidth: "138px",
      sortable: true,
      sortField: "points",
      selector: (row) => row.points,
      cell: (row) => (
        <Badge className="text-capitalize" color={statusObj[row.points]} pill>
          {row.points}
        </Badge>
      ),
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreVertical size={14} className="actions cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu>
              <div className="edit-container">
              <DropdownItem
                tag="a"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  var currentUser;
                  const users = store.getState().users.data;
                  for(const user in users){
                    if (users[user].id == row.id){
                      currentUser = users[user];
                    }
                  }
                  updateUser(currentUser);
                }}
              >
                <Archive size={14} className="me-50" />
                <span className="edit align-middle">Edit</span>
              </DropdownItem>
              </div>
              <DropdownItem
                tag="a"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault();
                  const params = store.getState().users.params;
                  store.dispatch(adminActions.deleteUser(row.id, params));
                }}
              >
                <Trash2 size={14} className="me-50" />
                <span className="delete align-middle">Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ]
}

