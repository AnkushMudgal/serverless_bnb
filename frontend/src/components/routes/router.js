import {BrowserRouter, Switch} from "react-router-dom";
import {ProtectedRoute} from "./ProtectedRoute";
import {routes} from "../../constants";
import {HomePage} from "../HomePage";

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <ProtectedRoute exact path={routes.home}>
                    <HomePage/>
                </ProtectedRoute>
            </Switch>
        </BrowserRouter>
    )
}

export {Routing}