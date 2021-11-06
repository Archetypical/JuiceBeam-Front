import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';

function HomePage() {
    //const users = useSelector(state => state.users);
    //const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getAll());
    }, []);

    //function handleDeleteUser(id) {
    //    dispatch(userActions.delete(id));
    //}

    return (
        <div className="col-lg-8 offset-lg-2">
            <h1>Hello!</h1>
            <p>You're logged in with React Hooks!!</p>
            <h3>All registered users:</h3>
            <p>
                <Link to="/login">Logout</Link>
            </p>
        </div>
    );
}

export { HomePage };