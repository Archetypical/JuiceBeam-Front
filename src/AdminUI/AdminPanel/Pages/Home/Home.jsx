import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  Button,
  CardTitle,
  CardHeader,
  Input,
  Form,
  Label,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { adminActions } from "../../../../_actions/admin.actions";

function Homepage() {
  const user = useSelector((state) => state.authentication.user);
  const api = useSelector((state) => state.admin.api);
  const accounts = useSelector((state) => state.admin.accounts);
  const [twitchClientID, setClientID] = useState(api.twId);
  const [twitchSecret, setTwitchSecret] = useState(api.twSec);
  const [twitchChannel, setTwitchChannel] = useState(accounts.twitch.name);
  const [youtubeKey, setYoutubeKey] = useState(api.ytKey);
  const [youtubeChannel, setYoutubeChannel] = useState(accounts.youtube.name);

  useEffect(() => {
    //api = useSelector((state) => state.admin.api);
    //accounts = useSelector((state) => state.admin.accounts);
    //adminActions.getSettings();
  });

  var defaultValues = {
    twitchClientID: "",
    twitchSecret: "",
    twitchChannel: "",
    youtubeKey: "",
    youtubeChannel: "",
  };

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const checkIsValid = (data) => {
    return Object.values(data).every((field) =>
      typeof field === "object" ? field !== null : field.length > 0
    );
  };

  const onSubmit = () => {
    let newData = {
        twitchClientID: twitchClientID,
        twitchClientSecret: twitchSecret,
        twitchName: twitchChannel,
        youtubeApiKey: youtubeKey,
        channelName: youtubeChannel,
      };
    if (checkIsValid(newData)) {
      adminActions.updateSettings({ ...newData });
    }
  };

  return (
    <div className="admin-home fadeInLeft fast">
      <div className="admin-header">
        <h1>Hello {user.username}!</h1>
        <Card>
          <CardHeader>
            <h4>Twitch API Settings</h4>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="mr-5 col-md-4">
                <Label for="search-invoice" className="form-Label">
                  Twitch Client ID:
                </Label>
                <Input
                  id="twId"
                  className="ms-50 w-100"
                  type="password"
                  defaultValue={twitchClientID}
                  onChange={(e) => setClientID(e.target.value)}
                />
              </div>
              <div className="mr-5 col-md-4">
                <Label for="search-invoice" className="form-Label">
                  Twitch Client Secret:
                </Label>
                <Input
                  id="twSec"
                  className="ms-50 w-100"
                  type="password"
                  defaultValue={twitchSecret}
                  onChange={(e) => setTwitchSecret(e.target.value)}
                />
              </div>
              <div className="mr-5 col-md-4">
                <Label for="search-invoice" className="form-Label">
                  Twitch Channel:
                </Label>
                <Input
                  id="twChannel"
                  className="ms-50 w-100"
                  type="text"
                  defaultValue={twitchChannel}
                  onChange={(e) => setTwitchChannel(e.target.value)}
                />
              </div>
              <Button type="submit" className="b-list" color="primary">
                Submit
              </Button>
            </Form>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h4>Youtube API Settings</h4>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="mr-5 col-md-4">
                <Label for="search-invoice" className="form-Label">
                  Youtube API Key:
                </Label>
                <Input
                  id="ytKey"
                  className="ms-50 w-100"
                  type="password"
                  defaultValue={youtubeKey}
                  onChange={(e) => setYoutubeKey(e.target.value)}
                />
              </div>
              <div className="mr-5 col-md-4">
                <Label for="search-invoice" className="form-Label">
                  Youtube Channel:
                </Label>
                <Input
                  id="ytChannel"
                  className="ms-50 w-100"
                  type="text"
                  defaultValue={youtubeChannel}
                  onChange={(e) => setYoutubeChannel(e.target.value)}
                />
              </div>
              <Button type="submit" className="b-list" color="primary">
                Submit
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export { Homepage };
