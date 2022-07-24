import React, { useState } from "react"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { FormLabel } from "@mui/material"
import axios from "axios"
import { useHistory } from "react-router-dom";
import { routes } from "../constants";

export default function CeaserCipherAuth() {
    const paperStyle = {
        padding: 20,
        height: "70vh",
        width: 400,
        margin: "20px auto",
    }

    const [encryptedCipher, setEncryptedCipher] = React.useState("")
    const btnstyle = { margin: "8px 0" }
    const [disableButton, setDisableButton] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [decryptedCipher, setDecryptedCipher] = React.useState("")
    const [validDecryptedCipherText, setValidDecryptedCipherText] =
        React.useState("")

    React.useEffect(() => {
        axios
            .get(
                "https://us-central1-b00904831-a4-partb.cloudfunctions.net/ceaser_cipher/generateEncryptedCode"
            )
            .then((res) => {
                setEncryptedCipher(res.data)
            })
    }, [])

    const handleOnChange = (event) => {
        if (event.target.value && event.target.value !== "") {
            setDecryptedCipher(event.target.value)
            setDisableButton(false)
        } else setDisableButton(true)
    }

    const history = useHistory();

    //TODO: cloudFunction
    const handleSubmit = async (e) => {
        await axios
            .post(
                "https://us-central1-b00904831-a4-partb.cloudfunctions.net/ceaser_cipher/decryptCipher",
                {
                    encryptedCode: encryptedCipher,
                    emailID: localStorage.getItem("CurrentUser"),
                }
            )
            .then((res) => {
                if (res.data && decryptedCipher === res.data) {
                    history.push(routes.home);
                    localStorage.setItem("LoggedStatus", true)
                } else setErrorMessage("Incorrect Decrypted Cipher Text Entered")
            })

    }

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align="center">
                    <h2 sx={{ fontWeight: "bold" }}>BB - Login Page 3-3</h2>
                </Grid>
                <br />
                <FormLabel id="encryptedCipher" sx={{ fontWeight: "bold" }}>
                    Decrypt Ceaser Cipher : {encryptedCipher}
                </FormLabel>
                <br />
                <br />
                <TextField
                    label="Enter Decrypted Cipher Text"
                    placeholder="Enter Decrypted Cipher Text"
                    fullWidth
                    required
                    id="decryptedCipherText"
                    onChange={(event) => {
                        handleOnChange(event)
                    }}
                //   value={userDetails.email}
                //   error={errors['decryptedCipherText'] ? true : false}
                //   helperText={errors['decryptedCipherText'] ? '.' : ''}
                />
                <br />
                <br />
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    style={btnstyle}
                    fullWidth
                    disabled={disableButton}
                    onClick={handleSubmit}
                >
                    Login
                </Button>
                {errorMessage != null && <p>{errorMessage}</p>}
            </Paper>
        </Grid>
    )
}