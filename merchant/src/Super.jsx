import React, { Component } from 'react';
import App from './App';
import LoginPage from './LoginPage';

const Login = require('./util/merchantLogin');

class Super extends Component {
    constructor(){
        super();
        this.state = {
            mid: null,
            phone: null,
            name: null,
            loginValidated: false
        }
    }

    componentDidMount() {
        this.checkLoginToken();
    }

    checkLoginToken = () => {
        let token = localStorage.getItem('AMP_MTK');
        if(token!==null){
            token = token.split('/');
            Login.ValidateToken({
                "mid" : token[0],
                "hash" : token[1]
            }).then((result)=>{
                if(result.validated===true){
                    this.setState({
                        mid: result.mid,
                        phone: result.phone,
                        name: result.name,
                        sessions: result.sessions,
                        loginValidated: true
                    });
                } else {
                    this.setState({loginValidated: false});
                }
            });
        } else {
            this.setState({loginValidated: false});
        }
    }

    login = (params) => {
        if(params.validated===true){
            Login.ValidateLogin({
                "code" : params.details.code,
                "password" : params.details.password
            }).then((result) => {
                if(result.validated===true){
                    localStorage.setItem('AMP_MTK', result.token);
                    this.setState({
                        mid: result.mid,
                        phone: result.phone,
                        name: result.name,
                        loginValidated: true
                    });
                }
            });
        }
    }

    logout = () => {
        localStorage.removeItem('AMP_MTK');
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
                 logoutWorker={()=>this.logout()} /> :
            <LoginPage onValidate={this.login.bind(this)}/>
        }
      </div>
    );
  }
}

export default Super;
