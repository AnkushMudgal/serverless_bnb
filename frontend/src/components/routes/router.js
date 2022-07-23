import {BrowserRouter, Redirect, Switch} from "react-router-dom";
import {ProtectedRoute} from "./ProtectedRoute";
import {routes} from "../../constants";
import {RoomBooking} from "../RoomBooking";
import {KitchenService} from "../KitchenService";
import {Register} from "../Registration"
import {Login} from "../Login"
import {ForgotPassword} from "../ForgotPassword"
import {ChangePassword} from "../ChangePassword"

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

                <ProtectedRoute exact path={routes.registration}>
                    <Register/>
                </ProtectedRoute>

                <ProtectedRoute exact path={routes.login}>
                    <Login/>
                </ProtectedRoute>

                <ProtectedRoute exact path={routes.forgotPassword}>
                    <ForgotPassword/>
                </ProtectedRoute>

                <ProtectedRoute exact path={routes.changePassword}>
                    <ChangePassword/>
                </ProtectedRoute>
            </Switch>
        </BrowserRouter>
    )
}

export {Routing}