import React, { Component } from 'react';
import App from './App';
import LoginPage from './LoginPage';
import Login from './util/login';

class Super extends Component {
    constructor(){
        super();
        this.state = {
            hasToken: false,
            loginValidated: false
        }
    }

    loginValidate = (loginObject) => {
        if(loginObject.validated===true){
            Login.Validate({
                "phone" : loginObject.details.phone,
                "password" : loginObject.details.password
            }).then( (result) => {
                if(result===true){
                    this.setState({
                        loginValidated: true
                    });
                } else {
    
                }
            });
        }
    }

    logoutWorker = () => {
        this.setState({
            loginValidated: false
        });
        //TEMPORARY ARRANGEMENT ONLY
    }

    render() {
        return (
            <div>
            {
                //THIS IS ALSO TEMPORARY
                this.state.loginValidated ? <App logoutWorker={this.logoutWorker}/> : <LoginPage onValidate={this.loginValidate} />
            }
            </div>
        );
    }
}

export default Super;