import React, { Component } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import SessionsHolder from './components/SessionsHolder';
import Footer from './components/Footer';
import BookingLightbox from './components/BookingLightbox';

import './GlobalStyles.css';
import BookSession from './util/session';
import MerchantDatabase from './util/Database';

class App extends Component {
  constructor(){
      super();
      this.state = {
          mid : null,
          phone: null,
          name : null
      };
      this.notif = new Audio("http://soundbible.com/grab.php?id=1599&type=mp3");
  }

  componentWillMount() {
    this.setState({
      mid: this.props.mid,
      phone: this.props.phone,
      name: this.props.name
    });
  }

  componentDidMount(){
    MerchantDatabase.firebase.database().ref().child('sessions').orderByChild('mid').equalTo(this.state.mid)
    .on('child_added', session =>{
      if(session.val().mid===this.state.mid && session.val().isDeleted===false){
        this.notif.play().then().catch((err)=>{console.log(err)});
        this.SessionsHolder.addNewSession({
          sid: session.val().sid,
          uid: session.val().uid,
          username: session.val().name,
          userphone: session.val().phone,
          device: session.val().device,
          duration: session.val().duration,
          startTime: session.val().startTime,
          activated:session.val().activated,
          expired: session.val().expired,
          otp: session.val().otp,
          dead: session.val().dead,
          table: session.val().table,
          amount: session.val().amount
        });
        // payload.push(session.val());
        // payload = this.sortSessions(payload.slice());
      }
    });
  }

  sortSessions = (unsorted) => {
    console.log("Sorting");
    let expired = [], active = [], others = [];
    unsorted.forEach((element)=>{
      if(element!==null){
        if(element.expired===true) expired.push(element);
        else if(element.active===true) active.push(element);
        else others.push(element);
      }
    });
    return expired.concat(active, others);
  }

  lightboxOpener = () => {this.setState({lightboxOpen: true})}
  lightboxAborter = () => {this.setState({lightboxOpen: false})}

  paramsHandler = (params) => {
    this.setState({lightboxOpen: false});
    this.addNewSession(params);
  }

  addNewSession = (params) => {    
    BookSession.addNewSession({
        "uid" : "AMPHERE-DEAD-SESSION",
        "phone" : params.phone,
        "name" : "Unknown",
        "location" : this.state.mid,
        "device" : params.device,
        "duration" : params.duration
    }).then((response)=>{
        // this.SessionsHolder.addNewSession({
        //   sid : response.sid,
        //   mid : this.state.mid,
        //   userphone:  params.phone,
        //   username: "Unknown",
        //   duration : params.duration,
        //   device: params.device,
        //   startTime: params.startTime || 0,
        //   activated: params.activated || false,
        //   expired: params.expired || false,
        //   otp: "AMPDEAD", 
        //   dead: true
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
                code={this.state.mid}
                name={this.state.name}
                logoutWorker={this.props.logoutWorker}
                button={true}/>

        <Banner addNewSession={this.addNewSession.bind(this)}
                lightboxOpener={this.lightboxOpener.bind(this)}/>

        <div className="holder-container">
            <SessionsHolder ref={ SessionsHolder => this.SessionsHolder = SessionsHolder }/>
        </div>

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
