import React, { Component } from 'react';
import './GlobalStyles.css';
import Header from './components/Header';
import Banner from './components/Banner';
import SessionsHolder from './components/SessionsHolder';
import Footer from './components/Footer';
import BookingLightbox from './components/BookingLightbox';

class App extends Component {
  constructor(){
      super();
      this.state = {};
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
  
  lightboxAborter = (_previousParams) => {
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
    let _sessionID = 1000 * Math.random().toPrecision(3);
    let session = {
      sessionID: _sessionID,
      startDate: new Date().toLocaleString(),
      locCode: params.locCode,
      duration: params.duration 
    }
    this.SessionsHolder.addNewSession(session);
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
