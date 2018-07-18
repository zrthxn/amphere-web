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
                    </div>
                </div>              
            </div>
        );
    }
}

export default Banner;