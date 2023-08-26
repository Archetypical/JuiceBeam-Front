import React, { useEffect } from "react";
import { history } from "../../../../_helpers";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
import {
  Router,
  Route,
  Switch,
  Redirect,
  Link,
  useRouteMatch,
} from "react-router-dom";
import UsersList from "./Users/list/index";
import VideoList from "./Videos/list/index";

function Tables() {
  let { path } = useRouteMatch();

  return (
    <Router history={history}>
      <Switch>
        <Route path={`${path}/users`}>
          <UsersList />
        </Route>
        <Route path={`${path}/events`}>
          <UserTable />
        </Route>
        <Route path={`${path}/videos`}>
          <VideoList />
        </Route>
        <Redirect from="/admin/tables" to={`/admin/tables/users`} />
      </Switch>
    </Router>
  );
}

function UserTable() {
  return (
    <div className="page-wrap">
      <Col md="12">
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Simple Table</CardTitle>
          </CardHeader>
          <CardBody>
            <Table className="tablesorter" responsive>
              <thead className="text-primary">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dakota Rice</td>
                  <td>Niger</td>
                  <td>Oud-Turnhout</td>
                  <td className="text-center">$36,738</td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}

export { Tables };
