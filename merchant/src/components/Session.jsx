import React, { Component } from 'react';
import './css/Session.css';
import SessionCancelLightbox from './SessionCancelLightbox';
import $ from 'jquery';
import SessionUtil from '../util/session';

import SessionFirebase from '../util/Database';

var Timer = SessionFirebase.firebase.database();

class Session extends Component {
    constructor() {
        super();
        this.state = {
            sid: "UNASSIGNED",
            otp: null,
            startTime: 0,
            activated: false,
            expired: false,
            duration: null,
            timeRemain: 0,
            cancelLightboxOpen: false
        }
    }

    componentDidMount() {
        this.setState({
            sid: this.props.sid,
            duration: this.props.duration,
            timeRemain: this.props.duration,
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
        }).then((res)=>{
            if(res.activated===true){
                this.setState({
                    activated : true,
                    startTime: res.time
                });
                Timer.ref('time').on('value', timeNow => {
                    let timeElapsed = timeNow.val() - this.state.startTime;
                    let _timeRemain = this.state.duration - timeElapsed;
                    if(_timeRemain>0){
                        this.setState({
                            timeRemain: _timeRemain
                        });
                    } else {
                        this.expire();
                    }
                });
            }
        }).catch((err)=>{
            alert(err);
        });
    }

    expire = () => {
        Timer.ref('time').off('value');
        SessionUtil.ExpireSession({
            sid: this.state.sid
        }).then(()=>{    
            this.setState({
                timeRemain: 0,
                expired: true
            });
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
                    <p className="session-detail">Duration: {this.state.duration}</p>
                    <p className="session-detail">TIME: {this.state.timeRemain}</p>

                    {
                        this.state.activated ?
                        ( 
                            this.state.expired ?
                                <button className="button session-expired-button">EXPIRED</button> :
                                <button className="button session-activated-button">ACTIVE</button> 
                        ) : (
                            <div>
                                <input className="textbox" placeholder="Enter OTP" onChange={this.setOTP}/>
                                <button className="button session-start-button" onClick={this.activate}>START</button>
                            </div>
                        )
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