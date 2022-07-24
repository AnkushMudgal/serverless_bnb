import {Redirect, Route} from "react-router-dom";
import { routes } from "../../constants";

function ProtectedRoute({component: Component, ...rest}) {

    // add authentication

    const unAuthRoutes = ["register", "login", "forgotpassword", "changepassword", "question-Answer", "ceaser-cipher"];
    const pathName = window.location.pathname.split("/")[1];

    if (localStorage.getItem("CurrentUser")) {
        if (unAuthRoutes.includes(pathName)) {
            return (
                <Redirect to={routes.roomBooking} />
            )
        }
    }

    if (!localStorage.getItem("CurrentUser")) {
        if (!unAuthRoutes.includes(pathName)) {
            return (
                <Redirect to={routes.login} />
            )
        }
    }
    

    return (
        <Route {...rest}
               render={(props) => {
                   return <Component {...props} />
               }}/>
    );
}

export {ProtectedRoute}