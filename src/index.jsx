import React, { lazy, Suspense } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Switch, Router, Route, Redirect } from "react-router-dom";
import { store, history } from "./_helpers";

const UserUI = lazy(() => import("./UserUI/App/App"));
const AdminUI = lazy(() => import("./AdminUI/App/App"));


render(
  <Provider store={store}>
    <Suspense fallback={<div>Loading...</div>}>
      <Router history={history}>
        <Switch>
          <Route path="/admin" component={AdminUI} />
          <Route path="/*" component={UserUI} />
        </Switch>
      </Router>
    </Suspense>
  </Provider>,
  document.getElementById("app")
);
