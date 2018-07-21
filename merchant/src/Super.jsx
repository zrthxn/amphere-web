import React, { Component } from 'react';
import logo from './logo.svg';
import App from './App';
import LoginPage from './LoginPage';
import Login from './util/merchantLogin';

class Super extends Component {
    constructor(){
        super();
        this.state = {
            loginValidated: false
        }
    }

    login = (loginObject) => {
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
                        loginValidated: true
                    });
                } else {

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
                 logoutWorker={this.logout}/> :
            <LoginPage onValidate={this.login}/>
        }
      </div>
    );
  }
}

export default Super;
