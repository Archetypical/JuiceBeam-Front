// ** React Import
import React, { useState, useEffect } from "react";

// ** Custom Components
import Sidebar from "../sidebar";

// ** Third Party Components
import Select from "react-select";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from "reactstrap";

// ** Store & Actions
import { adminActions } from "../../../../../../_actions/admin.actions";
import { useDispatch, useSelector } from "react-redux";

var defaultValues = {
  email: "",
  username: "",
  password: "",
  points: 0,
};

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === "object" ? field !== null : field.length > 0
  );
};

var autoFillCheck = 0;

const UpdateSidebar = ({ open, toggleSidebar, userData }) => {
  // ** States
  const [data, setData] = useState(null);
  const [rank, setRank] = useState("Dreamer");
  const [role, setRole] = useState("User");
  const [place, setPlace] = useState(false);
  const [init, setInit] = useState(false);
  const store = useSelector((state) => state.users);

  // ** Store Vars
  const dispatch = useDispatch();

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  var newData = userData;

  useEffect(() => {
    var interval = window.setInterval(() => {
      if (newData && newData.id && !place) {
        setPlace(newData);
        window.clearInterval(interval);
      } else if (place) {
        window.clearInterval(interval);
      }
    }, 100);

    if (place && !init) {
      for (const user in store.data) {
        if (place.id == store.data[user].id && place != store.data[user]) {
          setPlace(store.data[user]);
          return;
        }
      }
      setValue("username", place.username);
      setValue("email", place.email);
      setValue("points", place.points);
      setRole(place.role);
      setRank(place.rank);
      setInit(true);
    }

    if (!open) {
      setInit(false);
      setPlace(false);
    }
  }, [place, open, userData]);

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setData(data);
    if (checkIsValid(data)) {
      toggleSidebar();
      adminActions.updateUser(
        {
          id: place.id,
          username: data.username,
          email: data.email,
          password: data.password,
          points: data.points,
          rank: rank,
          role,
        },
        store.params
      );
    } else {
      for (const key in data) {
        if (data[key] === null) {
          if (key == "email") {
            data[key] = place.email;
          }
          if (key == "username") {
            data[key] = place.username;
          }
          if (key == "points") {
            data[key] = place.points;
          }
          if (key == "password") {
            data[key] = "";
          }
        }
      }
      toggleSidebar();
      adminActions.updateUser(
        {
          id: place.id,
          username: data.username,
          email: data.email,
          password: data.password,
          points: data.points,
          rank: rank,
          role,
        },
        store.params
      );
    }
  };

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, "");
    }
  };

  function checkRole(value) {
    if (place.role == value) {
      return true;
    } else {
      return false;
    }
  }

  function checkRank(value) {
    if (place.rank == value) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <Sidebar
      size="lg"
      open={open}
      title="Update User"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="userName">
            Username <span className="text-danger">*</span>
          </Label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                type="username"
                id="userName"
                value=""
                placeholder=""
                invalid={errors.username && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="userEmail">
            Email <span className="text-danger">*</span>
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                id="userEmail"
                value=""
                placeholder=""
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          <FormText color="muted">
            You can use letters, numbers & periods
          </FormText>
        </div>
        <div className="mb-1">
          <Label className="form-label" for="password">
            Password <span className="text-danger">*</span>
          </Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                type="password"
                id="password"
                placeholder="Password"
                invalid={errors.password && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="userPoints">
            Points <span className="text-danger">*</span>
          </Label>
          <Controller
            name="points"
            control={control}
            render={({ field }) => (
              <Input
                type="points"
                id="userPoints"
                value=""
                placeholder=""
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          <FormText color="muted">
            You can use letters, numbers & periods
          </FormText>
        </div>
        <div className="mb-1">
          <Label className="form-label" for="user-role">
            User Role
          </Label>
          <Input
            type="select"
            id="user-role"
            name="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User" selected={checkRole("User")}>
              User
            </option>
            <option value="Moderator" selected={checkRole("Moderator")}>
              Moderator
            </option>
            <option value="Admin" selected={checkRole("Admin")}>
              Admin
            </option>
          </Input>
        </div>
        <div
          className="mb-1"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        >
          <Label className="form-label" for="select-rank">
            Select Rank
          </Label>
          <Input type="select" id="select-rank" name="select-rank">
            <option value="Dreamer" selected={checkRank("Dreamer")}>
              Dreamer
            </option>
            <option value="Heartbeat" selected={checkRank("Heartbeat")}>
              Heartbeat
            </option>
            <option value="Insightful" selected={checkRank("Insightful")}>
              Insightful
            </option>
            <option value="Lucid" selected={checkRank("Lucid")}>
              Lucid
            </option>
            <option value="Visionary" selected={checkRank("Visionary")}>
              Visionary
            </option>
            <option value="Enlightened" selected={checkRank("Enlightened")}>
              Enlightened
            </option>
          </Input>
        </div>
        <Button type="submit" className="me-1" color="primary">
          Submit
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};

export default UpdateSidebar;
