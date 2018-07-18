import React, { Component } from 'react';
import '../GlobalStyles.css';
import './css/SessionCancelLightbox.css';

class SessionCancelLightbox extends Component {
    render() {
        return (
            <div className="lightbox-shadow">
                <div className="lightbox">
                    <p>Cancellation info here</p>
                    <p>Sure thou wanst cancel sesh?</p>

                    <button className="button btn-thin" onClick={this.props.confirm}>YES</button>
                    <button className="button btn-thin" onClick={this.props.decline}>NO</button>
                </div>
            </div>
        );
    }
}

export default SessionCancelLightbox;