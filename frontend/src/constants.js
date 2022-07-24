import Swal from "sweetalert2";

export const routes = {
    home: "/",
    roomBooking: "/room-booking",
    kitchenService: "/kitchen-service",
    registration: "/register",
    login: "/login",
    forgotPassword: "/forgotpassword",
    changePassword: "/changepassword",
    tourService: "/tour-service",
    questionAndAnswer : "/question-Answer",
    ceaserCipher: "/ceaser-cipher",
    invoice: "/invoice"
};


export const showPopup = (type, title, msg, callback = () => {
}) => {
    Swal.fire(title, msg, type).then(() => {
        callback();
    });
};

export const tourType = () => {
    return {
        Deluxe: 5,
        King: 4,
        Queen: 3
    }
};