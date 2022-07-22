import {useEffect, useState} from "react";
import axios from "axios";
import {showPopup} from "../constants";
import {Button, Form} from "react-bootstrap";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";

function KitchenService() {

    const [items, setItems] = useState([]);
    const [options, setOptions] = useState([]);


    useEffect(() => {
        axios.get("https://behncx2zg3xztvkq7jqwjq5ou40nuwsy.lambda-url.us-east-1.on.aws/").then((ele) => {
            setItems(ele.data.body);

            const newArray = [];
            ele.data.body.forEach((data) => {
                newArray.push({label: `${data.name} (Price: ${data.price})`, value: data.itemID});
            });
            setOptions(newArray)
        }).catch((err) => {
            showPopup("error", "Error", err.toString());
        });
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
            console.log(selectedFoodItems);
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