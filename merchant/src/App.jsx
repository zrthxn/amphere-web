import React, { Component } from 'react';
import './GlobalStyles.css';
import Header from './components/Header';
import Banner from './components/Banner';
import SessionsHolder from './components/SessionsHolder';
import Footer from './components/Footer';

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
        uid: this.props.uid,
        phone: this.props.phone,
        name: this.props.name,
        lightboxOpen: false
    })
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
