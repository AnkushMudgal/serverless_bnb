import './App.css';
import {Routing} from "./components/routes/router";
import {CustomNavBar} from "./components/NavBar";
import {useEffect, useState} from "react";
import {Loader} from "./components/Loader";

function App() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        loading ? <Loader/> : (<div className="h-100">
                <CustomNavBar/>
                <Routing/>
            </div>
        )
    );
}

export default App;
