import React, { Component } from 'react';
import App from './App';
import LoginPage from './LoginPage';
import Login from './util/login';

class Super extends Component {
    constructor(){
        super();
        this.state = {
            uid: null,
            phone: null,
            name: null,
            sessions: null,
            loginValidated: false
        }
    }

    componentDidMount() {
        if(!this.state.loginValidated){
            let result = this.checkLoginToken();
            if(result.validated){
                this.setState({
                    uid: result.uid,
                    phone: result.phone,
                    name: result.name,
                    sessions: result.sessions,
                    loginValidated: true
                });
            }
        }
    }

    checkLoginToken = () => {
        let token = localStorage.getItem('AMP_TK');
        if(token!==null){
            let result = Login.ValidateByToken(token);
            try{
                if(result.validated===true){
                    return {
                        "validated": true,
                        "uid": result.uid,
                        "phone": result.phone,
                        "name": result.name,
                        "sessions": result.sessions
                    };
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        } else {
            return {
                "validated" : false
            };
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
                        uid: result.uid,
                        phone: result.phone,
                        name: result.name,
                        sessions: result.sessions,
                        loginValidated: true
                    });
                } else {
    
                }
            });
        }
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
                this.state.loginValidated ? 
                <App phone={this.state.phone}
                     uid={this.state.uid}
                     name={this.state.name}
                     sessions={this.state.sessions}
                     logoutWorker={this.logout}/> : 
                <LoginPage onValidate={this.login}/>
            }
            </div>
        );
    }
}

export default Super;