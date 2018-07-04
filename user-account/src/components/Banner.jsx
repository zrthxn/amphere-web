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
                            <p>Lorem Ipsum ist dolor vala</p>
                            <p>Lorem Ipsum ist dolor vala ist dolor vala</p>

                            {/* <p>MY ACCOUNT</p>
                            <h2>Hey {this.props.name}!</h2>
                            <div className="spacer-small"></div>

                            <p>LAST SESSION : 12/12/2018</p>
                            <p><strong>CURRENT SUBTOTAL : &#x20b9; 120</strong></p> */}
                            
                            <button id="book-session" className="button btn-white" onClick={this.openLightbox}>BOOK SESSION</button>
                        </div>
                </div>              
            </div>
        );
    }
}

export default Banner;