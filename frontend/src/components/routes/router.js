import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { routes } from "../../constants";
import { HomePage } from "../HomePage";
import { Analytics } from "../Analytics";

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <ProtectedRoute exact path={routes.home}>
                    <HomePage />
                </ProtectedRoute>
            </Switch>
            <Route exact path="/analysis">
                <Analytics />
            </Route>
        </BrowserRouter>
    )
}

export { Routing }