import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {ProtectedRoute} from "./ProtectedRoute";
import {routes} from "../../constants";
import {RoomBooking} from "../RoomBooking";
import {KitchenService} from "../KitchenService";
import {Register} from "../Registration"
import {Login} from "../Login"
import {ForgotPassword} from "../ForgotPassword"
import {ChangePassword} from "../ChangePassword"
import QuestionAndAnswer from "../questionAndAnswer";
import CeaserCipherAuth from "../ceaserCipher";
import {Analytics} from "../Analytics"
import {TourService} from "../TourService";
import {Invoice} from "../Invoice";

function Routing() {
    return (
        <BrowserRouter>
            <Switch>
                <ProtectedRoute exact path={routes.home}>
                    <Redirect to={routes.registration}/>
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

                <ProtectedRoute exact path={routes.questionAndAnswer}>
                    <QuestionAndAnswer/>
                </ProtectedRoute>

                <ProtectedRoute exact path={routes.ceaserCipher}>
                    <CeaserCipherAuth/>
                </ProtectedRoute>

                <ProtectedRoute exact path={routes.tourService}>
                    <TourService/>
                </ProtectedRoute>

                <ProtectedRoute exact path={routes.invoice}>
                    <Invoice/>
                </ProtectedRoute>

                <Route exact path="/analysis">
                    <Analytics/>
                </Route>

            </Switch>

        </BrowserRouter>
    )
}

export {Routing}