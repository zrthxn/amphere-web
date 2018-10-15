import React, { Component } from 'react';
import './css/SessionConfirmLightbox.css';

class SessionConfirmLightbox extends Component {
    render(){
        return (
            <div className="lightbox-shadow">
                <div className="confirm-lightbox">
                    <div className="confirm-container">
                        <h1>CONFIRM SESSION</h1>
                        <p><b>Confirm to book this Coupon</b></p>

                        <p><b>Duration :</b>{this.props.duration-2}</p>
                        <p><b>Amount :</b>{this.props.amount}</p>

                        <button className="button btn-thin" onClick={this.props.decline}>CLOSE</button>
                        <button className="button btn-thin confirm" onClick={this.props.confirm}>CONFIRM</button>

                    </div>
                </div>
            </div>
        );
    }
}

export default SessionConfirmLightbox;
