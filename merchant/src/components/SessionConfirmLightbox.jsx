import React, { Component } from 'react';
import './css/SessionConfirmLightbox.css';

class SessionConfirmLightbox extends Component {
    render(){
        return (
            <div className="lightbox-shadow">
                <div className="confirm-lightbox">
                    <div className="confirm-container">
                        <h1>CONFIRM SESSION</h1>
                        <p><b>This is not a registered User,confirm to continue? </b></p>

                        <p><b>User Phone No. : </b>{this.props.phone}</p>

                        <button className="button btn-thin" onClick={this.props.decline}>CLOSE</button>
                        <button className="button btn-thin confirm" onClick={this.props.confirm}>CONFIRM</button>

                    </div>
                </div>
            </div>
        );
    }
}

export default SessionConfirmLightbox;
