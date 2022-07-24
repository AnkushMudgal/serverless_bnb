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

export const projectID = "serverless-5410-b00885768"

export const pubSubURL = "https://us-central1-serverless-5410-b00885768.cloudfunctions.net/message-passing";