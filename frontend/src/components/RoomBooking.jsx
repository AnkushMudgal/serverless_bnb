import {Button, ButtonGroup, Form} from "react-bootstrap";
import {Controller, useForm} from "react-hook-form";
import DatePicker from "react-datepicker";
import {useEffect, useState} from "react";
import axios from "axios";
import {Loader} from "./Loader";
import {projectID, pubSubURL, routes, showPopup} from "../constants";
import moment from "moment";
import {useHistory} from "react-router-dom";

function RoomBooking() {

    const {control, handleSubmit} = useForm();

    const [rooms, setRooms] = useState(null);

    const history = useHistory();

    const onSubmit = (data) => {
        let error = false;
        Object.values(data).forEach((val) => {
            if (!val) {
                error = true;
            }
        });

        if (error) {
            showPopup("error", "Error", "Please Enter all the fields");
        } else {
            console.log("sending feedback");
            data["checkOutDate"] = new Date();
            data["checkOutDate"].setDate(data["checkInDate"].getDate() + parseInt(data['duration']));

            const dateFormat = 'YYYY-MM-DD'

            data["checkOutDate"] = new Date(data["checkInDate"]);
            data["checkOutDate"].setDate(data["checkOutDate"].getDate() + parseInt(data['duration']));

            const json = {
                RoomType: data['availableRooms'],
                UserId: localStorage.getItem("CurrentUser"),
                CheckInDate: moment(data["checkInDate"]).format(dateFormat),
                CheckOutDate: moment(data["checkOutDate"]).format(dateFormat),
                CheckInTime: moment(data['checkInTime']).format('hh A')
            }

            axios.post("https://52ggkifzash6obohoh7kjxyzpu0jtcvv.lambda-url.us-east-1.on.aws/", json).then((res) => {
                if (res.data.Status === "Booked") {
                    showPopup("success", "Successfully Booked", `Your room has been successfully booked. Your reference number is ${res.data.BookingId}`, () => {
                        json["duration"] = data["duration"];
                        const newJson = {bookingId: res.data.BookingId, ...json};
                        localStorage.setItem("booking", JSON.stringify(newJson));
                        history.push(routes.kitchenService);
                    });

                    const publishJSON = {
                        "type": "PUBLISH_MESSAGES",
                        "values": {
                            "project_id": projectID,
                            "topic_id": localStorage.getItem("CurrentUser").split("@")[0],
                            "message": "Booking with id " + res.data.BookingId + " successfully created"
                        }
                    };

                    axios.post(pubSubURL, publishJSON).then((ele) => {
                        console.log(ele);
                    }).catch((err) => {
                        console.log(err);
                    });

                }
            }).catch((err) => {
                showPopup("error", "Error", err.toString());
            });
        }
    }

    useEffect(() => {
        axios.get("https://xa3pis3cdzgixv2ggikcxv4zzm0fgpuu.lambda-url.us-east-1.on.aws/").then((res) => {
            setRooms(res.data);
        });
    }, []);

    return (
        <div className="p-4">
            <h3 className="mb-4">Book a room</h3>
            <Form className="room-booking" onSubmit={handleSubmit(onSubmit)}>

                <Form.Group className="mb-3" controlId="formBasicAvailableRooms">
                    <Form.Label>Room Type</Form.Label>
                    <Controller
                        name={"availableRooms"}
                        control={control}
                        render={({field}) => {
                            return (
                                <div>
                                    <ButtonGroup aria-label="Room Types" onClick={(e) => {
                                        if (e.target instanceof HTMLButtonElement) {
                                            for (let i = 0; i < e.currentTarget.children.length; i++) {
                                                e.currentTarget.children[i].classList.remove("selected");
                                            }
                                            e.target.classList.add("selected");
                                            field.onChange(e.target.name);
                                        }
                                    }}>
                                        {!rooms ? <Loader/> :
                                            <>
                                                {Object.entries(rooms).map((entry) => {
                                                    return (
                                                        <Button variant="primary" name={entry[0]} key={entry[0]}
                                                                disabled={entry[1] < 1}>
                                                            {entry[0]}
                                                        </Button>
                                                    )
                                                })}
                                            </>
                                        }
                                    </ButtonGroup>
                                </div>
                            )
                        }
                        }
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckInDate">
                    <Form.Label>Check In Date</Form.Label>
                    <Controller
                        name={"checkInDate"}
                        control={control}
                        render={({field}) =>
                            <DatePicker
                                {...field}
                                selected={field.value}
                                minDate={new Date()}
                            />
                        }
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckOutDate">
                    <Form.Label>Duration of Stay</Form.Label>
                    <Controller
                        name={"duration"}
                        control={control}
                        render={({field}) =>
                            <Form.Control
                                {...field}
                                className="fit-content"
                                type="number"
                                placeholder="Enter duration"/>
                        }
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckInTime">
                    <Form.Label>Check In Time</Form.Label>
                    <Controller
                        name={"checkInTime"}
                        control={control}
                        render={({field}) =>
                            <DatePicker
                                {...field}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={60}
                                dateFormat="h:mm aa"
                                selected={field.value}
                                minDate={new Date()}
                            />
                        }
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Book Room
                </Button>
            </Form>
        </div>
    )
}

export {RoomBooking}