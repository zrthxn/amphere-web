import React, { Component } from 'react';
import './GlobalStyles.css';
import Header from './components/Header';
import Banner from './components/Banner';
import SessionsHolder from './components/SessionsHolder';
import Footer from './components/Footer';
import BookingLightbox from './components/BookingLightbox';

import BookSession from './util/session';
import UserData from './util/Database';

class App extends Component {
  constructor(){
      super();
      this.state = {
          uid : null,
          phone: null,
          name : null,
          lightboxOpen: false,
      };
  }

  componentWillMount() {
    this.setState({
      uid: this.props.uid,
      phone: this.props.phone,
      name: this.props.name,
      lightboxOpen: false
    });
  }

  componentDidMount(){
    UserData.firebase.database().ref().child('sessions').orderByChild('uid').equalTo(this.state.uid)
    .on('child_added', session =>{
      if(session.val().uid===this.state.uid && session.val().isDeleted===false){
        this.SessionsHolder.addNewSession({
          sid: session.val().sid,
          mid: session.val().mid,
          device: session.val().device,
          duration: session.val().duration,
          startTime: session.val().startTime,
          activated:session.val().activated,
          expired: session.val().expired,
          amount: session.val().amount
        });
      }
    });
  }

  lightboxOpener = () => {this.setState({lightboxOpen: true})}
  lightboxAborter = () => {this.setState({lightboxOpen: false})}

  paramsHandler = (params) => {
    this.setState({lightboxOpen: false});
    this.addNewSession(params);
  }

  addNewSession = (params) => {    
    BookSession.addNewSession({
        "uid" : this.state.uid,
        "phone" : this.state.phone,
        "name" : this.state.name,
        "location" : params.locCode,
        "device" : params.device,
        "duration" : params.duration
    }).then((response)=>{
        // this.SessionsHolder.addNewSession({
        //   sid : response.sid,
        //   mid : params.locCode,
        //   duration : params.duration,
        //   device: params.device,
        //   startTime: params.startTime || 0,
        //   activated: params.activated || false,
        //   expired: params.expired || false
        // });
    }).catch((err)=>{
        console.log(err);
        alert(err);
    });
  }

  render() {
    return (
      <div className="App">
        <Header phone={this.state.phone}
                name={this.state.name}
                logoutWorker={this.props.logoutWorker}
                button={true}/>
        
        <Banner addNewSession={this.addNewSession.bind(this)} 
                lightboxOpener={this.lightboxOpener.bind(this)}/>
        
        <SessionsHolder ref={SessionsHolder => this.SessionsHolder = SessionsHolder}/>
        {
          this.state.lightboxOpen ? (
            <BookingLightbox paramsHandler={this.paramsHandler.bind(this)} 
                             aborter={this.lightboxAborter.bind(this)} /> 
          ) : console.log()
        }
        <Footer />
      </div>
    );
  }
}

export default App;
