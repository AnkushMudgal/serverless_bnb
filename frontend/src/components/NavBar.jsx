import {Notification} from "./Notification";
import { Auth } from 'aws-amplify';
import axios from "axios";

function CustomNavBar() {
    const logout = async (event) => {
        event.preventDefault();
        try {
          Auth.signOut();
          axios.post("https://us-central1-serverlessprojects22.cloudfunctions.net/updateStatus", {
            email_id: localStorage.getItem('CurrentUser'),
            logged_in: true
          })
            localStorage.setItem("LoggedStatus", false)
          document.location.href = "/";
        }catch(error) {
          console.log(error);
        }
      }
    return (
        <nav className="navbar navbar-dark bg-dark p-2 d-flex justify-content-between">
            <div>Bed & Breakfast</div>
            <div className="buttons">
                {localStorage.getItem("LoggedStatus") == "true" ?
               (
                  <div onClick={logout} className="button is-dark">
                    Log out
                  </div>
                ): (
                        <div>
                            <a href="/register"className="button is-dark">
                                <strong>Register</strong>
                            </a>
                            <a href="/login" className="button is-dark">
                                <strong>Log in</strong>
                            </a>
                        </div>
                    )}
            </div>
            <Notification/>
        </nav>
    )
}

export {CustomNavBar}