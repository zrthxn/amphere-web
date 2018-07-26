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
            sid: null,
            uid: null,
            username: null,
            userphone: null,
            device: null,
            duration: null,
            activated: false,
            expired: false,
            otp: null,
            _otp: null,
            startTime: 0,
            timeRemain: 0,
            cancelLightboxOpen: false,
        }
    }

    componentDidMount() {
        this.setState({
            sid: this.props.sid,
            uid: this.props.uid,
            username: this.props.username,
            userphone: this.props.userphone,
            device: this.props.device,
            duration: this.props.duration,
            timeRemain: this.props.duration,
            activated: this.props.activated,
            expired: this.props.expired,
            otp: this.props.otp
        });
    }

    setOTP = (otp_f) => {
        this.setState({
            _otp: otp_f.target.value.trim()
        });
    }

    activate = () => {
        if(true){
            
        }
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
                <h2 className="title">SESSION</h2>

                <div className="user-details">
                    <p className="user-phone">{this.state.userphone}</p>
                    <p className="user-name">{this.state.username}</p>

                    <input type="text" className="textbox-small user-table" placeholder="Table No."/>
                </div>

                <div className="user-device-container">
                {
                    this.state.device==="iOS" ? <img src="assets/ios.svg" alt="" className="user-device"/> : (
                        this.state.device==="microUSB" ? <img src="assets/microusb.svg" alt="" className="user-device"/> : (
                            this.state.device==="USB-C" ? <img src="assets/usbc.svg" alt="" className="user-device"/> : console.log()
                        )
                    )
                }
                </div>

                <div className="timer">
                    <p className="timer-remain">{this.state.timeRemain}</p>
                    <p className="timer-detail">Minutes</p>
                </div>

                <div className="otp">
                    <input type="text" className="textbox otp" placeholder="Enter OTP"/>
                </div>

                {
                    this.state.activated ?
                    ( 
                        this.state.expired ?
                            <button className="button session-expired-button">EXPIRED</button> :
                            <button className="button session-activated-button" onClick={()=>{this.cancelConfirmationDialog(true)}}>ACTIVE</button> 
                    ) : (
                            <button className="button session-start-button" onClick={this.activate}>START</button>
                    )
                }

                {
                    this.state.cancelLightboxOpen ? 
                    <SessionCancelLightbox 
                        confirm={this.cancelSession} 
                        decline={() => this.cancelConfirmationDialog(false)}/> : 
                    console.log()
                }            
            </div>
        );
    }
}

export default Session;