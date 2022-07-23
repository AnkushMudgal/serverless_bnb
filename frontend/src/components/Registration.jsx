import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import axios from 'axios'
import {routes} from "../constants";

export class Register extends Component {
  state = {
    registeredEmail: "",
    password: "",
    confirmpassword: "",
    securityQuestion1: "",
    securityQuestion2: "",
    securityQuestion3: "",
    securityAnswer1: "",
    securityAnswer2:"",
    securityAnswer3:"",
    cipher:"",
    formValid: true
  }

  onModification = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  submitForm = async event => {
    event.preventDefault();
    if(this.validateForm()){
      const { password, registeredEmail } = this.state;
      let userDetails = {
        username: registeredEmail,
        password : password
      }
      let dynamoObject = {
        "email_id": registeredEmail,
        "security_object":[
        {
        "securityQuestion": "What city were you born in?",
        "securityAnswer": this.state.securityAnswer1
        },
        {
        "securityQuestion": "What is your mother's maiden name?",
        "securityAnswer": this.state.securityAnswer2
        },
        {
        "securityQuestion": "What is your favourite colour?",
        "securityAnswer": this.state.securityAnswer3
      }]
    }
      let firestoreObject = {
        "cipher": this.state.cipher,
        "email_id": registeredEmail,
        "logged_in": false
      }
      try {
        const response = await Auth.signUp(userDetails);
        axios.post("https://pvbe4bzseyw3j7z2zu75tdrhhy0qphrg.lambda-url.us-east-1.on.aws/", dynamoObject).then((resp) => {
          console.log(resp)
        })
        const abc = await axios.post("https://us-central1-serverlessprojects22.cloudfunctions.net/storeCipher", firestoreObject).then((resp) => {
          console.log(resp)
        })
        alert("Please verify your email and then log in!")
        document.location.href = routes.login
      } catch (cloud_error) {
        this.validateForm(cloud_error)
      }
    }

  }

  validateForm = (cloud_errors) => {
    this.setState({formValid : true});
    if(cloud_errors){
      alert(cloud_errors)
      this.setState({
        formValid: false
      })
      return false;
    }else{
        if(this.state.registeredEmail.length == 0 || this.state.password.length == 0 || this.state.confirmpassword.length == 0 
          || this.state.securityAnswer1.length == 0 || this.state.securityAnswer2.length == 0 || this.state.securityAnswer3.length == 0)
        {
          alert("Please fill in all the form fields!");
          this.setState({
            formValid: false
          })
          return false
        }else if(this.state.password != this.state.confirmpassword){
          alert("Password mismatched")
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
      <section className="formfield">
        <p className='is-size-3'>Signup</p>
        <div className="container">
          <form onSubmit={this.submitForm}>
            <div className="field">
              <p className="control">
                <input className="input" name="registeredEmail" placeholder="Enter email" type="text" value={this.state.registeredEmail} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" name="password" placeholder="Password"  type="password" value={this.state.password} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" name="confirmpassword" placeholder="Confirm password"  type="password" value={this.state.confirmpassword} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input"  name="securityQuestion1" value="What city were you born in?" readOnly/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" name="securityAnswer1" placeholder="Enter answer for 1st security question"  type="text" value={this.state.securityAnswer1} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" name="securityQuestion2" value="What is your mother's maiden name?" readOnly/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" name="securityAnswer2" placeholder="Enter answer for 2nd security question"  type="text" value={this.state.securityAnswer2} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" name="securityQuestion3" value="What is your favourite colour?" readOnly/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" name="securityAnswer3" placeholder="Enter answer for 3rd security question"  type="text" value={this.state.securityAnswer3} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" name="cipher" placeholder="Please enter your cipher"  type="number"  min="1" max="25" value={this.state.cipher} onChange={this.onModification}/>
              </p>
            </div>
            <p>Have an account already? <a href='/login'>Login</a></p>
            <div className="field">
              <p className="control">
                <button className="button is-light">
                  <strong>Submit</strong>
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
