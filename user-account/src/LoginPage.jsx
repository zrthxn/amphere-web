import React, { Component } from 'react';
import './GlobalStyles.css';
import './LoginPage.css';
import Header from './components/Header';

class LoginPage extends Component {
    constructor(){
        super();
        this.state = {
            inputUserPhone: null,
            inputUserPass: null,
            fieldsValidated:  false,
            token: null
        }
    }

    setUserPhoneInput = (userPhone) => {
        if(userPhone.target.value===""){
            this.setState({
                inputUserPhone: null
            });
        } else {
            this.setState({
                inputUserPhone: userPhone.target.value.trim()
            });
        }
    }

    setUserPasswordInput = (userPass) => {
        if(userPass.target.value===""){
            this.setState({
                inputUserPass: null
            });
        } else {
            this.setState({
                inputUserPass: userPass.target.value
            });
        }
    }

    validateLogin = () => {
        if(this.state.inputUserPhone!==null || this.state.inputUserPass!==null){
            this.setState({
                fieldsValidated: true
            });
            this.props.onValidate({
                "validated" : true,
                "details" : {
                    "phone" : this.state.inputUserPhone,
                    "password" : this.state.inputUserPass
                }
            });
        } else {
            alert("Please enter the registered phone number and correct password");
        }
    }

    render() {
        return (
            <div className="cover">
                <Header button={false}/>
                <div className="login-container">
                    <p className="page-title">Sign In</p>

                    <input id="phoneInput" type="text" className="textbox" placeholder="Phone" onChange={this.setUserPhoneInput}/>
                    <input id="passwordInput" type="password" className="textbox password" placeholder="Password" onChange={this.setUserPasswordInput}/>

                    <button className="button" onClick={this.validateLogin.bind(this)}>SIGN IN</button>

                    <p>Don't have an account? <a href="https://amphere.in/signup">Sign Up</a></p>
                </div>
            </div>
            
        );
    }
}

export default LoginPage;