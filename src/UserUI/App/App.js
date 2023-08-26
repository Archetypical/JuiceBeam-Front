import React, { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch, Redirect, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { history, store } from "../../_helpers";
import { alertActions } from "../../_actions";
import { PrivateRoute } from "../_components";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/src/sweetalert2.scss";
const HomePage = lazy(() => import("../HomePage/HomePage"));
const StreamPage = lazy(() => import("../StreamPage/StreamPage"));
import { AccountPage } from "../AccountPage";
import { ArchivePage } from "../ArchivePage";
import { matchPath } from "react-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "../../style/post-1540af.css"
import "../../animations/animations.css"
import "../../style/widget-nav-menu.min.css"


library.add(fas);

function App() {
  const [scroll, setScroll] = React.useState(true);
  const dispatch = useDispatch();

  const MySwal = withReactContent(Swal);

  if (!localStorage.getItem("settings")) {
    var settings = { bubbleState: true, sanity: false };
    settings = JSON.stringify(settings);
    localStorage.setItem("settings", settings);
  }
  function sanityInit() {
    var checkValue = JSON.parse(localStorage.getItem("settings"));
    var r = document.querySelector(":root");
    if (!checkValue.sanity) {
      r.style.setProperty("--color-text-primary", "#2df702");
      r.style.setProperty("--color-overlay", "#fff0");
      r.style.setProperty("--color-main-var-1", "#22c200cc");
      r.style.setProperty("--color-main-var-1-hover", "#02860a9e");
      r.style.setProperty("--color-main-var-2", "#00ff104f");
      r.style.setProperty("--color-main-var-3", "#00570ca8");
      r.style.setProperty("--color-main-var-4", "#05d52194");
    } else {
      r.style.setProperty("--color-text-primary", "#df0000");
      r.style.setProperty(
        "--color-overlay",
        "radial-gradient(#df0000a8, #000500c7)"
      );
      r.style.setProperty("--color-main-var-1", "#ff0000cc");
      r.style.setProperty("--color-main-var-1-hover", "#e711119e");
      r.style.setProperty("--color-main-var-2", "#ff000040");
      r.style.setProperty("--color-main-var-3", "#ff525294");
      r.style.setProperty("--color-main-var-4", "#ff000063");
    }
  }
  //const store = useSelector(state => state.users)

  function select(state) {
    return state.alert;
  }

  let currentAlert;

  function handleChange() {
    let previousAlert = currentAlert;
    currentAlert = select(store.getState());

    if (previousAlert !== currentAlert) {
      openAlert(currentAlert);
    }
  }

  const subscribe = () => store.subscribe(handleChange);
  
  subscribe();

  function openAlert(alert) {
    if (alert.type == "alert-success") {
        MySwal.fire({
          title: "Request Complete!",
          text: alert.message,
          icon: "success",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
          didClose: () => {
            dispatch(alertActions.clear());
          },
        });
    }
    if (alert.type == "alert-danger") {
        MySwal.fire({
          title: "Halt!",
          text: alert.message,
          icon: "error",
          customClass: {
            confirmButton: "btn btn-primary",
          },
          buttonsStyling: false,
          didClose: () => {
            dispatch(alertActions.clear());
          },
        });
    }
  }

  

  useEffect(() => {
    sanityInit();
    //history.listen((location, action) => {
    // clear alert on location change
    //dispatch(alertActions.clear());
    //});
  }, []);

  return (
    <div className={scroll ? "main noscroll" : "main noscroll"}>
      <div className="section">
        <Suspense fallback={<div></div>}>
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/stream" component={StreamPage} />
              <PrivateRoute path="/account" component={AccountPage} />
              <Route path="/archive" component={ArchivePage} />
              <Redirect from="/*" to="/" />
            </Switch>
          </Router>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
