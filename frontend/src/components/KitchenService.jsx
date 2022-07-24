import {useEffect, useState} from "react";
import axios from "axios";
import {routes, showPopup} from "../constants";
import {Button, Form} from "react-bootstrap";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import {useHistory} from "react-router-dom";

function KitchenService() {

    const [items, setItems] = useState([]);
    const [options, setOptions] = useState([]);

    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem("booking")) {
            axios.get("https://behncx2zg3xztvkq7jqwjq5ou40nuwsy.lambda-url.us-east-1.on.aws/").then((ele) => {
                setItems(ele.data.body);

                const newArray = [];
                ele.data.body.forEach((data) => {
                    newArray.push({label: `${data.name} (Price: ${data.price})`, value: data.itemID});
                });
                setOptions(newArray);
            }).catch((err) => {
                showPopup("error", "Error", err.toString());
            });
        } else {
            showPopup("error", "Error", "You need to book room first", () => {
                history.replace(routes.roomBooking);
            });
        }
    }, []);

    const {control, handleSubmit} = useForm();


    const onSubmit = (data) => {
        let error = false;
        Object.values(data).forEach((val) => {
            if (!val || (Array.isArray(val) && !val.length)) {
                error = true;
            }
        });

        if (error) {
            showPopup("error", "Error", "Please Enter all the fields");
        } else {
            const ids = data.foodItems.map((ele) => ele.value);
            const selectedFoodItems = items.filter((ele) => ids.includes(ele.itemID));
            const json = {};
            json['emailID'] = "abc@gmail.com";
            const booking = JSON.parse(localStorage.getItem("booking"));
            json['bookingID'] = booking['bookingId'];

            const tempJSON = [];
            selectedFoodItems.forEach((ele) => {
                console.log(ele);
                tempJSON.push({itemName: ele.name, price: ele.price, itemID: ele.itemID});
            });

            json['items'] = tempJSON;

            axios.post("https://hwadzlt7fjy6kqinqunbxilm3a0skdda.lambda-url.us-east-1.on.aws/", json).then((ele) => {
                showPopup("success", "Successfully Booked", `Your food order has been successfully placed.}`, () => {
                    history.push(routes.tourService);
                });
            }).catch((err) => {
                showPopup("error", "Error", err.toString());
            });
        }
    }

    return (
        <div className="p-4">
            <h3 className="mb-4">Kitchen Service</h3>
            <Form className="kitchen-service" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formBasicItems">
                    <Form.Label>Food Items</Form.Label>
                    <Controller
                        name={"foodItems"}
                        control={control}
                        render={({field}) => {
                            return (
                                <Select
                                    {...field}
                                    isMulti
                                    options={options}
                                />
                            )
                        }}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Order Food Items
                </Button>
            </Form>
        </div>
    )
}

export {KitchenService}