import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { userActions, alertActions } from "../../_actions";


function LoginPage(){
    const alert = useSelector((state) => state.alert);
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const { username, password } = inputs;
    const loggingIn = useSelector((state) => state.authentication.loggingIn);
    const dispatch = useDispatch();
    const location = useLocation();

    // reset login status
    useEffect(() => {
        dispatch(alertActions.clear());
        //    dispatch(userActions.logout());
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((inputs) => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (username && password) {
        // get return url from location state or default to home page
        const { from } = location.pathname || { from: { pathname: "/" } };
        dispatch(userActions.login(username, password, from, settings.logIn, settings.setPopup));
        }
    }


    return (
        <>
        <div className="new login-box">
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group overflow-hidden">
                    <div className="user-box slideInLeft first">
                    <label className="field-title">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        className={
                        "form-control mb-0" + (submitted && !username ? " is-invalid" : "")
                        }
                    />
                    {submitted && !username && (
                        <div className="invalid-feedback">Username is required</div>
                    )}
                    </div>
                </div>
                <div className="form-group overflow-hidden">
                    <div className="user-box slideInLeft second">
                    <label className="field-title">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        className={
                        "form-control" + (submitted && !password ? " is-invalid" : "")
                        }
                    />
                    {submitted && !password && (
                        <div className="invalid-feedback">Password is required</div>
                    )}
                    </div>
                </div>
                <div className="form-group mb-2">
                    <button>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    {loggingIn && (
                        <span className="spinner-border spinner-border-sm" style={{bottom: 15 + "px", left: 20 + 'px'}}></span>
                    )}
                    Sign In
                    </button>
                </div>
            {alert.message && (
                <div className={`alert ${alert.type}`}>{alert.message}</div>
            )}
            </form>
        </div>
        </>
    );
}

export { LoginPage };