import {BrowserRouter, Redirect, Switch} from "react-router-dom";
import {ProtectedRoute} from "./ProtectedRoute";
import {routes} from "../../constants";
import {RoomBooking} from "../RoomBooking";
import {KitchenService} from "../KitchenService";

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <ProtectedRoute exact path={routes.home}>
                    <Redirect to={routes.roomBooking}/>
                </ProtectedRoute>

                <ProtectedRoute exact path={routes.roomBooking}>
                    <RoomBooking/>
                </ProtectedRoute>

                <ProtectedRoute exact path={routes.kitchenService}>
                    <KitchenService/>
                </ProtectedRoute>
            </Switch>
        </BrowserRouter>
    )
}

export {Routing}