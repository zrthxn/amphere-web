import React, { Component } from 'react';
import './css/Session.css';
import SessionCancelLightbox from './SessionCancelLightbox';
import $ from 'jquery';
import SessionUtil from '../util/session';

class Session extends Component {

    constructor() {
        super();
        this.state = {
            sid: "UNASSIGNED",
            otp: "NULL",
            startDate: "NULL",
            location: "NULL",
            duration: "NULL",
            status: "NO-CODE",
            timeRemain: 0,
            cancelLightboxOpen: false,
            activated: false,
            expired: false
        }
    }

    componentDidMount() {
    // FIREBASE TIMER LISTENER HERE
        this.setState({
            sid: this.props.sid,
            startDate: this.props.startDate,
            location: this.props.location,
            duration: this.props.duration,
            timeRemain: this.props.duration,
            status: "BOOKED"
        });
    }

    setOTP = (otp) => {
        this.setState({
            otp: otp.target.value.trim()
        });        
    }

    activate = () => {
        SessionUtil.ActivateSession({
            sid: this.state.sid,
            otp: this.state.otp
        }).then(()=>{
            this.setState({
                activated : true
            });
        }).catch(()=>{

        });
    }

    expire = () => {
        this.setState({
            expired : true
        });
    }

    cancelConfirmationDialog = (state) => {
        this.setState({
            cancelLightboxOpen: state
        })
    }

    cancelSession = () => {
        this.props.cancel();
    }

    render() {
        return (
            <div className="session">
                <div className="session-details-container">
                    <div className="session-number">
                        <strong>SESSION: {this.state.sid}</strong>
                        <button className="session-cancel-button" onClick={() => this.cancelConfirmationDialog(true)}>Cancel</button>
                    </div>
                    <div className="spacer-small"></div>
                    <p className="session-detail">Started On: {this.state.startDate}</p>
                    <p className="session-detail">Location Code: {this.state.location}</p>
                    <p className="session-detail">Duration: {this.state.duration}</p>

                    <input className="textbox" placeholder="Enter OTP" onChange={this.setOTP}/>

                    {
                        this.state.activated ?
                        ( 
                            this.state.expired ?
                                <button className="button session-expired-button">EXPIRED</button> :
                                <button className="button session-activated-button" onClick={this.expire}>ACTIVE</button> 
                        ) : 
                        <button className="button session-start-button" onClick={this.activate}>START</button>

                    }
                </div>

                {
                    this.state.cancelLightboxOpen ? (
                        <SessionCancelLightbox confirm={this.cancelSession} 
                                               decline={() => this.cancelConfirmationDialog(false)}/>
                    ) : console.log()
                }            
            </div>
        );
    }
}

export default Session;