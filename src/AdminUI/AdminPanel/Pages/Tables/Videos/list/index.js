// ** React Imports
import React, { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

// ** Demo Components
import TableServerSide from "./TableServerSide";

// ** Action Import
import { adminActions } from "../../../../../../_actions/admin.actions";
import { store } from "../../../../../../_helpers/store";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === "object" ? field !== null : field.length > 0
  );
};

const defaultValues = {
  channelName: "",
  maxResults: "",
};

const VideosList = () => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const state = store.getState().admin;
  const [init, setInit] = useState(false);

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (!init) {
      setValue("channelName", state.accounts.youtube.name);
      setValue("maxResults", state.videoParam.maxResults.toString());
      setInit(true);
    }
  });

  const onSubmit = (data) => {
    setData(data);
    if (checkIsValid(data)) {
      dispatch(
        adminActions.updateSettings({
          channelName: data.channelName,
          maxResults: data.maxResults,
        })
      );
    } else {
      for (const key in data) {
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };

  return (
    <Fragment>
      <div className="app-video-list fadeInLeft fast">
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Video Archive Channel</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-wrap-inner">
                  <Col md="4" className="mr-5">
                    <Label className="form-Label" htmlFor="search-invoice">
                      Channel Name:
                    </Label>
                    <Controller
                      name="channelName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="channelName"
                          className="ms-50 w-100"
                          value=""
                          placeholder=""
                          invalid={errors.channelName && true}
                          {...field}
                        />
                      )}
                    />
                  </Col>
                  <Col md="4">
                    <Label className="form-Label" htmlFor="search-invoice">
                      Max Number of Videos:
                    </Label>
                    <Controller
                      name="maxResults"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="maxResults"
                          className="ms-50 w-100"
                          value=""
                          placeholder=""
                          invalid={errors.maxResults && true}
                          {...field}
                        />
                      )}
                    />
                  </Col>
                  <Col>
                    <Button className="add-new-user ml-2 mt-2" color="primary">
                      Update
                    </Button>
                  </Col>
                </div>
              </Form>
            </Row>
          </CardBody>
        </Card>
        <TableServerSide />
      </div>
    </Fragment>
  );
};

export default VideosList;
