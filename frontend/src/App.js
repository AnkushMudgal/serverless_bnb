import './App.css';
import {Routing} from "./components/routes/router";
import {CustomNavBar} from "./components/NavBar";
import {useEffect, useState} from "react";
import {Loader} from "./components/Loader";
import axios from "axios";

function App() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            axios.defaults.baseURL = "https://us-central1-serverless-5410-b00885768.cloudfunctions.net/";
        }
        setLoading(false);
    });

    return (
        loading ? <Loader/> : (<div className="h-100">
                <CustomNavBar/>
                <Routing/>
            </div>
        )
    );
}

export default App;
