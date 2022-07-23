import Swal from "sweetalert2";

export const routes = {
    home: "/",
    roomBooking: "/room-booking",
    kitchenService: "/kitchen-service",
    registration: "/register",
    login: "/login",
    forgotPassword: "/forgotpassword",
    changePassword: "/changepassword"
};


export const showPopup = (type, title, msg, callback = () => {
}) => {
    Swal.fire(title, msg, type).then(() => {
        callback();
    });
};