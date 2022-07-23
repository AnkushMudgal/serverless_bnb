import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import {routes} from "../constants";

export class ForgotPassword extends Component {
  state = {
    registeredEmail: "",
    formValid: true
  }

  onModification = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  submitForm = async event => {
    event.preventDefault();
    const formvalid = this.validateForm()
    if(formvalid){
    try {
      await Auth.forgotPassword(this.state.registeredEmail);
      document.location.href = routes.changePassword;
    }catch(form_error) {
      this.validateForm(form_error)
    }
  }
  }

  validateForm = (cognitoErrors) => {
    this.setState({formValid : true});
    if(cognitoErrors){
      alert(cognitoErrors)
      this.setState({
        formValid: false
      })
      return false;
    }else{
        if(this.state.registeredEmail.length == 0)
        {
          alert("Please enter email id");
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
        <p className='is-size-3'>Enter email id linked to your account!</p>
        <div className="container">
          <form onSubmit={this.submitForm}>
            <div className="field">
              <p className="control">
                <input className="input" id="registeredEmail" placeholder="Enter email id" value={this.state.registeredEmail} type="email" onChange={this.onModification}/>
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
