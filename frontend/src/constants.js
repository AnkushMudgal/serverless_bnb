import Swal from "sweetalert2";

export const routes = {
    home: "/",
    roomBooking: "/room-booking",
    kitchenService: "/kitchen-service"
};


export const showPopup = (type, title, msg, callback = () => {
}) => {
    Swal.fire(title, msg, type).then(() => {
        callback();
    });
};