import React, { useState } from "react"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import axios from "axios"
import { Typography } from "@mui/material"
import { useHistory } from "react-router-dom"
import { routes } from "../constants"

export default function QuestionAndAnswer() {
    const paperStyle = {
        padding: 20,
        height: "70vh",
        width: 400,
        margin: "20px auto",
    }
    const history = useHistory();
    const btnstyle = { margin: "8px 0" }
    const [disableLogin, setDisableLogin] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [emailID, setEmailID] = React.useState("")
    const [securityAnswer1, setSecurityAnswer1] = React.useState("")
    const [securityAnswer2, setSecurityAnswer2] = React.useState("")
    const [securityAnswer3, setSecurityAnswer3] = React.useState("")
    //let navigate = useNavigate()
    //const location = useLocation()

    const handleSubmit = async (e) => {
        const securityDetails = {
            email_id: localStorage.getItem("CurrentUser"),
            security_details: [
                {
                    securityAnswer: securityAnswer1,
                    securityQuestion: "What city were you born in?",
                },
                {
                    securityAnswer: securityAnswer2,
                    securityQuestion: "What is your mother's maiden name?",
                },
                {
                    securityAnswer: securityAnswer3,
                    securityQuestion: "What is your favourite colour?",
                },
            ],
        }

        console.log("security details", securityDetails)
        axios
            .post(
                "https://qki325g7l5cutyw24ykbobkvsq0fxghf.lambda-url.us-east-1.on.aws/",
                securityDetails
            )
            .then((res) => {
                if (res.data.valid)
                    history.push(routes.ceaserCipher);
                else setErrorMessage("Authentication Failed - Invalid Security answers")
            })
    }

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align="center">
                    <h2>BB - Login Page 2-3</h2>
                    <br />
                </Grid>
                <Typography variant="subtitle2" gutterBottom component="div">
                    What city were you born in?
                </Typography>
                <TextField
                    label="ans1"
                    placeholder="Enter answer"
                    fullWidth
                    required
                    id="ans1"
                    value={securityAnswer1}
                    onChange={(event) => {
                        setSecurityAnswer1(event.target.value)
                    }}
                />
                <br />
                <br />
                <Typography variant="subtitle2" gutterBottom component="div">
                    What is your mother's maiden name?
                </Typography>
                <TextField
                    label="ans2"
                    placeholder="Enter answer"
                    fullWidth
                    required
                    id="ans2"
                    value={securityAnswer2}
                    onChange={(event) => {
                        setSecurityAnswer2(event.target.value)
                    }}
                />
                <br />
                <br />
                <Typography variant="subtitle2" gutterBottom component="div">
                    What is your favourite colour
                </Typography>
                <TextField
                    label="ans3"
                    placeholder="Enter answer"
                    fullWidth
                    required
                    id="ans3"
                    value={securityAnswer3}
                    onChange={(event) => {
                        setSecurityAnswer3(event.target.value)
                    }}
                />
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    style={btnstyle}
                    fullWidth
                    //disabled={disableLogin}
                    onClick={handleSubmit}
                    sx={{ backgroundColor: "#4a4a4a" }}
                >
                    Verify
                </Button>
                {errorMessage != null && <p>{errorMessage}</p>}
            </Paper>
        </Grid>
    )
}