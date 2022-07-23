import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import {routes} from "../constants";

export  class ChangePassword extends Component {
  state = {
    registeredEmail: "",
    code: "",
    updatedPassword: "",
    formValid: true
  };

  onModification = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  submitForm = async event => {
    event.preventDefault();
    const formvalid = this.validateForm()
    if(formvalid){
      try {
        await Auth.forgotPasswordSubmit(
          this.state.registeredEmail,
          this.state.code,
          this.state.newPassword
        );
        alert("Password changed Successfully!!")
        document.location.href = routes.login;
      }catch(form_error) {
        this.validateForm(form_error)
      }
  }
  };

  validateForm = (cognitoErrors) => {
    this.setState({formValid : true});
    if(cognitoErrors){
      alert(cognitoErrors)
      this.setState({
        formValid: false
      })
      return false;
    }else{
        if(this.state.registeredEmail.length == 0 || this.state.code.length == 0 || this.state.updatedPassword.length == 0)
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
         <p className='is-size-3'>Enter details below to set a new password</p>
        <div className="container">
          <form onSubmit={this.submitForm}>
            <div className="field">
              <p className="control">
                <input className="input" id="registeredEmail" placeholder="Enter email" value={this.state.registeredEmail} type="email" onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" id="verificationCode" placeholder="Enter verification code" type="text" value={this.state.code} onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input" id="newPassword" placeholder="Updated password" value={this.state.updatedPassword} type="password" onChange={this.onModification}/>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-light">
                  Submit
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
