import React, { Component } from 'react';
import './css/Banner.css';
import '../GlobalStyles.css';

class Banner extends Component {
    openLightbox = () => {
        this.props.lightboxOpener();
    }

    render() {
        return (
            <div>
                <div className="banner">
                        <div className="spacer"></div>
                        <div>
                            <h2><strong>MY SESSIONS</strong></h2>
                            <br/>
                            <p>The sessions you have booked will appear here.</p>
                            <p>Give your OTP to start a session.</p>
                            
                            <button id="book-session" className="button btn-white" onClick={this.openLightbox}>BOOK SESSION</button>
                        </div>
                </div>      
            </div>
        );
    }
}

export default Banner;