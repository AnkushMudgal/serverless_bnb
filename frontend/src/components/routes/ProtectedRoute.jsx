import {Route} from "react-router-dom";

function ProtectedRoute({component: Component, ...rest}) {

    // add authentication

    return (
        <Route {...rest}
               render={(props) => {
                   return <Component {...props} />
               }}/>
    );
}

export {ProtectedRoute}