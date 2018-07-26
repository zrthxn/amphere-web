import React, { Component } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import SessionsHolder from './components/SessionsHolder';
import Footer from './components/Footer';

import './GlobalStyles.css';

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
      if(session.val().mid===this.state.mid && session.val().isDeleted===false){
          this.SessionsHolder.addNewSession({
            sid: session.val().sid,
            uid: session.val().uid,
            username: session.val().name,
            userphone: session.val().phone,
            device: session.val().device,
            duration: session.val().duration,
            activated:session.val().activated,
            expired: session.val().expired,
            otp: session.val().otp
          });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <Header phone={this.state.phone}
                name={this.state.name}
                logoutWorker={()=>{this.props.logoutWorker()}}
                button={true}/>
        <Banner/>
        <div className="holder-container"><SessionsHolder ref={ SessionsHolder => this.SessionsHolder = SessionsHolder }/></div>
        <Footer />
      </div>
    );
  }
}

export default App;
