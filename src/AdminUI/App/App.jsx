import React, { useEffect, lazy, Suspense, useState } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch, Redirect, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { history, store } from "../../_helpers";
import { adminActions, userActions } from "../../_actions";

const AdminPanel = lazy(() => import("../AdminPanel/AdminPanel"));

// ** Styles
import "../../style/_react-select.scss";
import "../../style/react-dataTable-component.scss";
import "../../style/bootstrap-extended.scss";
import "../../style/bootstrap.scss";


//<LoginPage/>

function App() {
  const state = store.getState();
  const [verified, setVerified] = useState(false);
  const [init, setInit] = useState(false);
  const dispatch = useDispatch();
  
  
  function verify() {
    // if redux logged in state is true
    if (state.authentication.loggedIn) {
      // ask backend if current user is admin
      userActions.adminVerify().then(authorized => {
        setVerified(authorized);
        if(!authorized){
          //init value turns true if user is not an admin
          setInit(true);
        }
      });
    }
    else{
      //init value turns true if user is not logged in
      setInit(true);
    }
  }

  function redirect(){
    if(!verified){
      window.location.replace("http://localhost:8080")
    }
  }

  useEffect(() => {
    if(!init && !verified){
      verify(); 
    }
    if(verified){
      getSettings();
    }
  }, [verified, init]);


  function getSettings(){
    dispatch(adminActions.getSettings);
  }


  return (
    <div className="admin_main">
      <div className="section_2">
        <Suspense fallback={<div></div>}>
          <Router history={history}>
            <Route path="/admin">{verified ? <AdminPanel /> : () => {
              if(init){
                redirect();
              }
              }}</Route>
          </Router>
        </Suspense>
      </div>
    </div>
  );
}

export default App
