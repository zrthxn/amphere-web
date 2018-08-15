import React, { Component } from 'react';
import './css/Footer.css'

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="container">
                    <div className="footer-grid-container">

                        <a href="http://amphere.in/">Home</a>
                        <a href="http://amphere.in/about?">About Us</a>
                        <a href="http://amphere.in/contact?">Contact</a>
                        <a href=""></a>

                        <a href="http://amphere.in/support?">Help & Support</a>
                        <a href="http://amphere.in/partner?q=onboard">Partner with Us</a>
                        <a href=""></a>
                        <a href=""></a>
                        
                        <a className="last" href="#">Terms and Conditions</a>
                        <a className="last" href="#">Damage Policy</a>
                        <a className="last" href="#">Cancellation & Refunds</a>
                        <a className="last" href=""></a>
                    </div>

                    <h2>Amphere Solutions</h2>
                </div>
            </div>
        );
    }
}

export default Footer;