import {useEffect, useState} from "react";
import {routes, showPopup, tourType} from "../constants";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {Loader} from "./Loader";
import {Button} from "react-bootstrap";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {firestoreDB} from "../firebase-config";


const sendFeedback = async ({userId, rooms, feedback}) => {
    try {
        const docRef = await addDoc(collection(firestoreDB, "feedback"), {
            userId,
            rooms,
            feedback,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Error adding user: ", e);
    }
}


function Invoice() {

    const history = useHistory();

    const [roomDetails, setRoomDetails] = useState([]);
    const [roomDetailsLoading, setRoomDetailsLoading] = useState(true);

    const [kitchenDetails, setKitchenDetails] = useState([]);
    const [kitchenDetailsLoading, setKitchenDetailsLoading] = useState(true);

    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [invoiceDetailsLoading, setInvoiceDetailsLoading] = useState(true);


    useEffect(() => {
        if (!localStorage.getItem("booking")) {
            showPopup("error", "Error", "You need to book room first", () => {
                history.replace(routes.roomBooking);
            });
            return;
        }

        let json = localStorage.getItem("booking");
        if (json) {
            json = JSON.parse(json);
        }

        const roomJSON = {
            UserId: json["UserId"]
        }

        axios.post("https://6rv4nhyjyddrgmq2rggwwlq5we0bgjxo.lambda-url.us-east-1.on.aws/", roomJSON).then((ele) => {
            setRoomDetailsLoading(false);
            const data = ele.data;
            if (Object.keys(data).length) {
                const key = Object.keys(data)[0];
                const response = data[key];
                setRoomDetails(response);
            }
        }).catch((err) => {
            setRoomDetailsLoading(false);
            showPopup("error", "Error", err.toString());
        })

        const kitchenJSON = {
            bookingID: json["bookingId"]
        }

        axios.post("https://bxsvvituim5jdzzsweu4b2zd3a0uudxl.lambda-url.us-east-1.on.aws/", kitchenJSON).then((ele) => {
            setKitchenDetails(ele.data);
            setKitchenDetailsLoading(false);
        }).catch((err) => {
            setKitchenDetailsLoading(false);
            showPopup("error", "Error", err.toString());
        })

        const tourJSON = {
            userId: json["UserId"]
        }

        axios.post("https://us-central1-idyllic-depth-343703.cloudfunctions.net/tour-info", tourJSON).then((ele) => {
            setInvoiceDetails(ele.data.response);
            setInvoiceDetailsLoading(false);
        }).catch((err) => {
            setInvoiceDetailsLoading(false);
            showPopup("error", "Error", err.toString());
        });
    }, []);


    const submitFeedback = (ele) => {
        const val = document.getElementById("feedback-" + ele.BookingId.S).value;
        if (val) {
            let json = localStorage.getItem("booking");
            if (json) {
                json = JSON.parse(json);
            }

            const feedbackJSON = {
                userId: json["UserId"],
                rooms: tourType()[json["RoomType"]],
                feedback: val
            }
            sendFeedback(feedbackJSON).then((e) => {
                document.getElementById("feedback-" + ele.BookingId.S).value = "";
                showPopup("success", "Success", "Feedback sent successfully");
            });
        } else {
            showPopup("error", "Error", "Please enter feedback and submit")
        }
    };

    return (
        <div className="p-4">
            <h3><b>Invoice Details</b></h3>
            <div className="p-4">
                <div>
                    <div className="mb-4">
                        <b>Rooms Bookings</b>
                    </div>
                    <div className="p-4">
                        {roomDetailsLoading ? <Loader/> : <div>
                            {roomDetails.map((ele) => {
                                return (
                                    <div className="d-flex">
                                        <div className="mb-5">
                                            <div className="d-flex">
                                                <div><b>Booking ID: </b></div>
                                                <div>{ele.BookingId.S}</div>
                                            </div>
                                            <div className="d-flex">
                                                <div><b>Room Type: </b></div>
                                                <div>{ele.RoomType.S}</div>
                                            </div>
                                            <div className="d-flex">
                                                <div><b>Check In Date: </b></div>
                                                <div>{ele.CheckInDate.S}</div>
                                            </div>
                                            <div className="d-flex">
                                                <div><b>Check Out Date: </b></div>
                                                <div>{ele.CheckOutDate.S}</div>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div>
                                                <textarea rows={5} cols={30} id={"feedback-" + ele.BookingId.S}/>
                                                <div>
                                                    <Button onClick={() => submitFeedback(ele)}>Submit Feedback</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <b>Kitchen Services</b>
                    </div>
                    <div className="p-4">
                        {kitchenDetailsLoading ? <Loader/> : <div>
                            {kitchenDetails.map((ele) => {
                                return (
                                    <div className="mb-4">
                                        <div className="d-flex">
                                            <div><b>Item ID: </b></div>
                                            <div>{ele.itemID}</div>
                                        </div>
                                        <div className="d-flex">
                                            <div><b>Item Name: </b></div>
                                            <div>{ele.itemName}</div>
                                        </div>
                                        <div className="d-flex">
                                            <div><b>Item Name: </b></div>
                                            <div>{ele.price}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <b>Tour Service</b>
                    </div>
                    <div className="p-4">
                        {invoiceDetailsLoading ? <Loader/> : <div>
                            {invoiceDetails.map((ele) => {
                                return (
                                    <div className="mb-4">
                                        <div className="d-flex">
                                            <div><b>Tour ID: </b></div>
                                            <div>{ele.tourId}</div>
                                        </div>
                                        <div className="d-flex">
                                            <div><b>Tour Name: </b></div>
                                            <div>{ele.tourName}</div>
                                        </div>
                                        <div className="d-flex">
                                            <div><b>Tour Start Date: </b></div>
                                            <div>{ele.startTime}</div>
                                        </div>
                                        <div className="d-flex">
                                            <div><b>Tour End Date: </b></div>
                                            <div>{ele.endTime}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export {Invoice}