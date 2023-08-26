import React, {useEffect} from 'react';
import { Route, Redirect } from 'react-router-dom';
import { userActions } from "../../_actions";


//Redirect to home if user not logged in  or token is invalid
function PrivateRoute({ component: Component, roles, ...rest }) {
    const [verified, setVerified] = React.useState(false);
    const [init, setInit] = React.useState(false);

    function verify(){
        userActions.userVerify().then(authorized => {
            setVerified(authorized);
            setInit(true);
        });
    }

    useEffect(() => {
        if(!init && !verified){
          verify(); 
        }
    },[verified])

    return (
        <Route {...rest} render={props => {
            if (!localStorage.getItem('user')) {
                // not logged in so redirect to home page with the return url
                return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            }
            if(!verified && !init){
                return <div>Loading...</div>
            }
            if(init && !verified){
                return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            }
            if(init && verified){
                // user exists so return component
                return <Component {...props} />
            }
        }} />
    );
}

export { PrivateRoute };