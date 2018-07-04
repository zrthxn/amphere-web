import React, { Component } from 'react';
import './css/Footer.css'

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="container">
                    <div className="footer-grid-container">
                        <p>Home</p>
                        <p>About</p>
                        <p>Contact</p>
                        <p>FAQ</p>

                        <p>Home</p>
                        <p>About</p>
                        <p>Contact</p>
                        <p>FAQ</p>

                        <p className="last">Home</p>
                        <p className="last">About</p>
                        <p className="last">Contact</p>
                        <p className="last">FAQ</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;