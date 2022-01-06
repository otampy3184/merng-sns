import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ components: Components, ...rest }){
    const { user } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(props) => 
            user ? <Redirect to="/" /> : <Components {...props} />
        }
        />
    );
}

export default AuthRoute;