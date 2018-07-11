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
        //TEMPORARY ARRANGEMENT ONLY
        this.setState({
            loginValidated: false
        });
    }

    render() {
        return (
            <div>
            {
                this.state.loginValidated ? <App phone="1234" uid="12" name="ali" logoutWorker={this.logoutWorker}/> : <LoginPage onValidate={this.loginValidate}/>
            }
            </div>
        );
    }
}

export default Super;