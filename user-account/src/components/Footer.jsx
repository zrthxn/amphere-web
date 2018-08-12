import React, { Component } from 'react';
import './css/Footer.css'

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="container">
                    <div className="footer-grid-container">

                        <a href="/">Home</a>
                        <a href="/about?">About Us</a>
                        <a href="/contact?">Contact</a>
                        <a href=""></a>

                        <a href="/support?">Help & Support</a>
                        <a href="/partner?q=onboard">Partner with Us</a>
                        <a href=""></a>
                        <a href=""></a>
                        
                        <a className="last" href="/terms?">Terms and Conditions</a>
                        <a className="last" href="/terms?q=damage">Damage Policy</a>
                        <a className="last" href="/terms?q=refunds">Cancellation & Refunds</a>
                        <a className="last" href=""></a>
                    </div>

                    <h2>Amphere Solutions</h2>
                </div>
            </div>
        );
    }
}

export default Footer;