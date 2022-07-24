import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {usePrevious} from "react-use";
import {Loader} from "./Loader";
import axios from "axios";

function Notification() {
    const [isOpen, toggleIcon] = useState(false);
    const url = "https://us-central1-serverless-5410-b00885768.cloudfunctions.net"

    const prevIsOpen = usePrevious(isOpen);

    const [notifications, setNotifications] = useState([]);
    const [isNotificationsLoading, setNotificationsLoading] = useState(true);

    useEffect(() => {
        if (prevIsOpen !== isOpen) {
            if (isOpen) {
                setNotificationsLoading(true);
                axios.post(`${url}/message-passing/`, {
                    "type": "PULL_MESSAGES",
                    "values": {
                        "project_id": "serverless-5410-b00885768",
                        "subscription_id": localStorage.getItem("CurrentUser").split("@")[0],
                        "num_messages": 10
                    }
                }).then((res) => {
                    setNotifications(res.data.success);
                    setNotificationsLoading(false);
                }).catch((err) => {
                    console.error(err);
                });
            } else {
                setNotifications([]);
            }
        }
    }, [isOpen]);


    return (
        <>
            <FontAwesomeIcon icon={faBell} className="cursor-pointer" type="button"
                             id="dropdownMenuButton"
                             data-bs-toggle="dropdown"
                             data-bs-auto-close="false"
                             onClick={() => {
                                 toggleIcon(!isOpen);
                             }}/>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                {isNotificationsLoading ? <Loader/> :
                    notifications.length ? notifications.map((notification) => {
                        return <div className="dropdown-item">{notification}</div>
                    }) : <div className="black">No new notifications</div>
                }
            </div>
        </>
    )
}

export {Notification}