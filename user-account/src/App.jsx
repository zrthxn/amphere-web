import React, { Component } from 'react';
import './GlobalStyles.css';
import Header from './components/Header';
import Banner from './components/Banner';
import SessionsHolder from './components/SessionsHolder';
import Footer from './components/Footer';
import BookingLightbox from './components/BookingLightbox';

import BookSession from './util/session';

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

  componentDidMount(){
    this.setState({
        lightboxOpen: false
    })
  }

  lightboxOpener = () => {
    this.setState({
      lightboxOpen: true
    })
  }
  
  lightboxAborter = () => {
    this.setState({
      lightboxOpen: false
    })
  }

  paramsHandler = (params) => {
    this.setState({
      lightboxOpen: false
    });
    this.addNewSession(params);
  }

  addNewSession = (params) => {    
    BookSession.addNewSession({
        "phone" : this.state.phone,
        "uid" : this.state.uid,
        "location" : params.locCode,
        "duration" : params.duration
    }).then((response)=>{
        let session = {
            sid : response.sid,
            startDate : response.startDate,
            location : params.locCode,
            duration : params.duration
        }
        this.SessionsHolder.addNewSession(session);
    }).catch((err)=>{
        console.log(err);
        alert(err);
    });
  }

  render() {
    return (
      <div className="App">
      {/* {
        (true)?(
          <LoginPage />
        ):(
          console.log()
        )
      } */}
      
        <Header logoutWorker={this.props.logoutWorker}/>
        <Banner name="Alisamar"
                addNewSession={this.addNewSession.bind(this)} 
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
