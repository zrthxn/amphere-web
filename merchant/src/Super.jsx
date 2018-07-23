import React, { Component } from 'react';
import App from './App';
import LoginPage from './LoginPage';

const Login = require('./util/merchantLogin');

class Super extends Component {
    constructor(){
        super();
        this.state = {
            loginValidated: false
        }
    }

    login = (loginObject) => {
        // this.setState({
        //     mid: "AMP",
        //     phone: "26985186",
        //     name: "Amphere Solutions",
        //     loginValidated: true
        // });
        if(loginObject.validated===true){
            Login.ValidateLogin({
                "code" : loginObject.details.code,
                "password" : loginObject.details.password
            }).then((result) => {
                if(result.validated===true){
                    this.setState({
                        mid: result.mid,
                        phone: result.phone,
                        name: result.name,                        
                        sessions: result.sessions,
                        loginValidated: true
                    });
                }
            });
        }
    }

    logout = () => {
        this.setState({
            loginValidated: false
        });
    }

  render() {
    return (
      <div>
        {
            this.state.loginValidated ? 
            <App mid={this.state.mid}
                 name={this.state.name}
                 phone={this.state.phone}
                 logoutWorker={this.logout} /> :
            <LoginPage onValidate={this.login.bind(this)}/>
        }
      </div>
    );
  }
}

export default Super;
