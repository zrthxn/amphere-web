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
            startTime: session.val().startTime,
            activated:session.val().activated,
            expired: session.val().expired,
            otp: session.val().otp,
            dead: session.val().dead
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
    // BookSession.addNewSession({
    //     "uid" : "null",
    //     "phone" : params.phone,
    //     "name" : "Unknown",
    //     "location" : this.state.mid,
    //     "device" : params.device,
    //     "duration" : params.duration
    // }).then((response)=>{
        this.SessionsHolder.addNewSession({
          sid : "response.sid",
          mid : this.state.mid,
          userphone:  params.phone,
          username: "Dead Session",
          duration : params.duration,
          device: params.device,
          startTime: params.startTime || 0,
          activated: params.activated || false,
          expired: params.expired || false,
          otp: "AMPDEAD", 
          dead: true
        });
    // }).catch((err)=>{
    //     console.log(err);
    //     alert(err);
    // });
  }

  render() {
    return (
      <div className="App">
        <Header phone={this.state.phone}
                name={this.state.name}
                logoutWorker={()=>this.props.logoutWorker()}
                button={true}/>
        {/* <Banner>
          <ToggleTabButtons>
            <TabButton key={1}/>
            <TabButton key={2}/>
          </ToggleTabButtons>
        </Banner> */}

        <Banner addNewSession={this.addNewSession.bind(this)} 
                lightboxOpener={this.lightboxOpener.bind(this)}/>

        <div className="holder-container">
          {/* <ToggleTabs> */}
            <SessionsHolder ref={ SessionsHolder => this.SessionsHolder = SessionsHolder }/>
            {/* <PreviousSessionsHolder key={2}/>
          </ToggleTabs>           */}
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
