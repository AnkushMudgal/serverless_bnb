import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {routes} from "../constants";


export class Login extends Component {
  state = {
    registeredEmail: "",
    password: "",
    formValid: true
  };

  onModification = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };


  submitForm = async event => {
    event.preventDefault();
    const formvalid = this.validateFormFields()
    if(formvalid){
    try {
      const signin = await Auth.signIn(this.state.registeredEmail, this.state.password);
      // localStorage.setItem("CurrentUser", this.state.registeredEmail)
      axios.post("https://us-central1-serverlessprojects22.cloudfunctions.net/updateStatus", {
        email_id: this.state.registeredEmail,
        logged_in: true
      }).then((res) => {
        document.location.href = routes.questionAndAnswer;
      });
    }catch(form_error) {
      this.validateFormFields(form_error)
    }
  }
  };

  validateFormFields = (cognitoErrors) => {
    this.setState({formValid : true});
    if(cognitoErrors){
      alert(cognitoErrors)
      this.setState({
        formValid: false
      })
      return false;
    }else{
        if( this.state.registeredEmail.length == 0 || this.state.password.length == 0 )
        {
          alert("Please fill in all the form fields!");
          this.setState({
            formValid: false
          })
          return false
        }
    }
    return true
  }

  render() {
    return (
      <section className="section formfield">
         <p className='is-size-3'>Login</p>
        <div className="container">
          <form onSubmit={this.submitForm}>
            <div className="field">
              <p className="control">
                <input className="input" type="text" id="registeredEmail" placeholder="Enter email" value={this.state.registeredEmail} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" type="password" id="password" placeholder="Password" value={this.state.password} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <a href="/forgotpassword">Forgot password?</a>
              </p>
            </div>
            <p>Don't have an account? <a href='/'>Signup</a></p>
            <div className="field">
              <p className="control">
                <button className="button is-light">
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
