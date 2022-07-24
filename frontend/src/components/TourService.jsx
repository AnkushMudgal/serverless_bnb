import {useEffect, useState} from "react";
import {projectID, pubSubURL, routes, showPopup, tourType} from "../constants";
import axios from "axios";
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {firestoreDB} from "../firebase-config";
import {Loader} from "./Loader";
import {Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";


const storeDataInFirestore = async ({userId, tourId, tourName}) => {
    try {
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + tourId);

        const docRef = await addDoc(collection(firestoreDB, "tourInfo"), {
            currentTime: new Date(),
            endTime: endTime,
            timeStamp: serverTimestamp(),
            userId: userId,
            tourId: tourId,
            tourName: tourName
        });
    } catch (e) {
        console.error("Error adding tour: ", e);
    }
}

function TourService() {

    const randomInt = (max, min) => Math.round(Math.random() * (max - min)) + min;

    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

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

        const newJSON = {
            days: json["duration"],
            people: tourType()[json["RoomType"]],
            rooms: randomInt(4, 1)
        }
        axios.post("https://us-central1-idyllic-depth-343703.cloudfunctions.net/recommendation", newJSON).then((ele) => {
            setTours(ele['data'].response);
            setLoading(false);
        }).catch((err) => {
            showPopup("error", "Error", err.toString());
            setLoading(false);
        });
    }, []);

    const bookTour = (tour) => {
        const json = JSON.parse(localStorage.getItem("booking"));
        storeDataInFirestore(
            {userId: json["UserId"], tourId: tour.tourId, tourName: tour.tourName}
        ).then((ele) => {
            const publishJSON = {
                "type": "PUBLISH_MESSAGES",
                "values": {
                    "project_id": projectID,
                    "topic_id": localStorage.getItem("CurrentUser").split("@")[0],
                    "message": "Tour with id " + tour.tourId + " successfully booked"
                }
            };
            axios.post(pubSubURL, publishJSON).then((ele) => {
                console.log(ele);
            }).catch((err) => {
                console.log(err);
            });
            showPopup("success", "Success", "Tour Successfully Booked", () => {
                history.push(routes.invoice);
            });
        });
    }
    return (
        <div className="p-4">
            <div><b>Available Tours</b></div>
            {loading ? <Loader/> :
                <ol className="p-4">
                    {tours.map((tour) => {
                        return (
                            <li className="mb-2">
                                <div className="mr-4">{tour.tourName}</div>
                                <div className="mr-4">{tour.tourDescription}</div>
                                <Button onClick={() => bookTour(tour)}>Book</Button>
                            </li>
                        )
                    })}
                </ol>
            }
        </div>
    )
}

export {TourService};
