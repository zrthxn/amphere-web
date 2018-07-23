import React, { Component } from 'react';
import './GlobalStyles.css';
import './LoginPage.css';
import Header from './components/Header.jsx';

class LoginPage extends Component {
    constructor(){
        super();
        this.state = {
            inputCode: null,
            inputPass: null,
            fieldsValidated: false
        }
    }

    setCodeInput = (code) => {
        if(code.target.value===""){
            this.setState({
                inputCode: null
            });
        } else {
            this.setState({
                inputCode: code.target.value.trim()
            });
        }
    }

    setPasswordInput = (pass) => {
        if(pass.target.value===""){
            this.setState({
                inputPass: null
            });
        } else {
            this.setState({
                inputPass: pass.target.value
            });
        }
    }

    validateLogin = () => {
        if(this.state.inputCode!==null || this.state.inputPass!==null){
            this.setState({
                fieldsValidated: true
            });
            this.props.onValidate({
                "validated" : true,
                "details" : {
                    "code" : this.state.inputCode,
                    "password" : this.state.inputPass
                }
            });
        } else {
            alert("Code or Password empty");
        }
    }

    render() {
        return (
            <div className="cover">
                <Header button={false}/>
                <form className="login-container">
                    <p className="page-title">Sign In</p>
                    <input id="codeInput" type="text" className="textbox" placeholder="Merchant Code" onChange={this.setCodeInput}/>
                    <input id="passwordInput" type="password" className="textbox password" placeholder="Password" onChange={this.setPasswordInput}/>

                    <button className="button" onClick={this.validateLogin}>SIGN IN</button>                        
                </form>
                <footer>&copy; Amphere Solutions Inc. 2018</footer>
            </div>
            
        );
    }
}

export default LoginPage;