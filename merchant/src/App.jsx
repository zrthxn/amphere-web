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
          name : null,
          lightboxOpen: false,

      };
  }

  componentDidMount(){
    this.setState({
        mid: this.props.mid,
        phone: this.props.phone,
        name: this.props.name,
        lightboxOpen: false
    });
    let sessionsRef = MerchantDatabase.firebase.database().ref('merchants/merchant-AMP' + /* + this.state.mid + */ '/sessions');
    sessionsRef.on('child_added', session =>{
      if(session.val().expired===false){
        this.SessionsHolder.addNewSession({
          sid: session.val().sid,
          uid: session.val().uid,
          phone: session.val().phone,
          device: session.val().device,
          duration: session.val().duration,
          expired: session.val().expired
        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <Header phone={this.state.phone}
                name={this.state.name}
                logoutWorker={this.props.logoutWorker}
                button={true}/>
        
        <Banner/>
        
        <SessionsHolder ref={SessionsHolder => this.SessionsHolder = SessionsHolder}/>
        <Footer />
      </div>
    );
  }
}

export default App;
