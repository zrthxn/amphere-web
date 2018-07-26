import React, { Component } from 'react';
import './GlobalStyles.css';
import Header from './components/Header';
import Banner from './components/Banner';
import SessionsHolder from './components/SessionsHolder';
import Footer from './components/Footer';

import MerchantDatabase from './util/Database';

class App extends Component {
  constructor(){
      super();
      this.state = {
          mid : null,
          phone: null,
          name : null
      };
  }

  componentWillMount() {
    this.setState({
      mid: this.props.mid,
      phone: this.props.phone,
      name: this.props.name
    });
  }

  componentDidMount(){
    MerchantDatabase.firebase.database().ref().child('sessions')
    .on('child_added', session =>{
      if(session.val().mid===this.state.mid){
        if(session.val().isDeleted===false || true){
          MerchantDatabase.firebase.database().ref('users/user-' + session.val().uid)
          .on('child_added', user =>{
            this.SessionsHolder.addNewSession({
              sid: session.val().sid,
              uid: session.val().uid,
              username: user.val().name,
              userphone: user.val().phone,
              device: session.val().device,
              duration: session.val().duration,
              activated:session.val().activated,
              expired: session.val().expired,
              otp: session.val().otp
            });
          });
        }
      }
    });
  }

  render() {
    return (
      <div>
        <Header phone={this.state.phone}
                name={this.state.name}
                logoutWorker={()=>{
                  this.props.logoutWorker(); 
                }}
                button={true}/>
        
        <Banner/>
        
        <SessionsHolder ref={ SessionsHolder => this.SessionsHolder = SessionsHolder }/>
        <Footer />
      </div>
    );
  }
}

export default App;
