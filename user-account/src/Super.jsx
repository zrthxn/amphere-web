import React, { Component } from 'react';
import App from './App';
import LoginPage from './LoginPage';
import Login from './util/login';

class Super extends Component {
    constructor(){
        super();
        this.state = {
            loginValidated: false
        }
    }

    componentDidMount() {
        let result = false;
        if(!this.state.loginValidated){
            result = this.checkLoginToken();
        }
        this.setState({
            loginValidated: result
        });
    }

    checkLoginToken = () => {
        let token = localStorage.getItem('AMP_TK');
        console.log(token);
        if(token===null){
            return false;
        } else {
            return this.previousLogin(token);
        }
    }

    login = (loginObject) => {
        if(loginObject.validated===true){
            Login.ValidateByPhone({
                "phone" : loginObject.details.phone,
                "password" : loginObject.details.password
            }).then((result) => {
                if(result.validated===true){
                    this.setState({
                        loginValidated: true
                    });
                } else {
    
                }
            });
        }
    }

    previousLogin = (token) => {
        Login.ValidateByToken({
            "uid" : token,
        }).then((result) => {
            if(result.validated===true){
                return true;
            } else {
                return false;
            }
        });
    }

    logout = () => {
        //TEMPORARY ARRANGEMENT ONLY
        this.setState({
            loginValidated: false
        });
    }

    render() {
        return (
            <div>
            {
                this.state.loginValidated ? <App phone="1234" uid="12" name="ali" logoutWorker={this.logout}/> : <LoginPage onValidate={this.login}/>
            }
            </div>
        );
    }
}

export default Super;