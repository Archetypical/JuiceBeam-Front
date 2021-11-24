import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../_helpers";
import { alertActions } from "../_actions";
import { PrivateRoute } from "../_components";
import { HomePage } from "../HomePage";
import { StreamPage } from "../StreamPage";
import { RegisterPage } from "../RegisterPage";
import { matchPath } from "react-router";



function App() {
  const [scrollOn, setScroll] = React.useState(true);
  const dispatch = useDispatch();
  

  useEffect(() => {
    //history.listen((location, action) => {
      // clear alert on location change
      //dispatch(alertActions.clear());
    //});
    console.log("Who won?")
    if(location.pathname == "/stream"){
      setScroll(false);
    }
  }, []);

  return (
    
    <div className="main">
      <div className="section">
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/stream" component={StreamPage} />
            <Route path="/register" component={RegisterPage} />
            <Redirect from="*" to="/" />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export { App };
