import React, { Component } from 'react';
import SessionCancelLightbox from './SessionCancelLightbox';
import SessionUtil from '../util/session';

import './css/Session.css';

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
            table: null
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
            startTime: this.props.startTime,
            activated: this.props.activated,
            expired: this.props.expired,
            otp: this.props.otp
        });
        if(this.state.activated===true){
            Timer.ref('time').on('value', TimerFunction(timeNow));
        }
    }

    activate = () => {
        this.setState({
            activated : true
        });
        if(this.state._otp === this.state.otp){
            SessionUtil.ActivateSession({
                "sid": this.state.sid,
                "otp": this.state._otp
            }).then((res)=>{
                if(res.activated===true){
                    Timer.ref('sessions/session-' + this.state.sid).update({
                        "startTime" : res.time
                    });
                    this.setState({
                        activated : true,
                        startTime: res.time
                    });
                    Timer.ref('time').on('value', TimerFunction(timeNow));
                }
            });
        } else {
           alert("Incorrect OTP! Please try again.");
        }
    }

    expire = () => {
        Timer.ref('time').off('value');
        this.setState({
            timeRemain: 0,
            expired: true
        });
        // SessionUtil.ExpireSession({
        //     sid: this.state.sid
        // }).then(()=>{    
        //     this.setState({
        //         timeRemain: 0,
        //         expired: true
        //     });
        // });
    }
    
    cancelSession = (reasons) => {
        if(this.state.timeRemain<=(this.state.duration/2)){
            alert("Session cannot be cancelled after half the time has elapsed");
        } else {
            Timer.ref('time').off('value');
            this.props.cancel();
            // SessionUtil.CancelSession({
            //     "sid": this.state.sid,
            //     "exp": reasons
            // }).then((res)=>{
            //     if(res.success===true){
            //         this.props.cancel();
            //     }
            // }).catch((err)=>{
            //     alert(err);
            // });
        }
    }

    paymentComplete = () => {
        this.props.complete();
        // SessionUtil.CompleteSession({
        //     "sid": this.state.sid
        // }).then((res)=>{
        //     if(res.success===true){
        //         this.props.complete();
        //     }
        // }).catch((err)=>{
        //     alert(err);
        // });
    }

    TimerFunction(timeNow) {
        let timeElapsed = timeNow.val() - this.state.startTime;
        let _timeRemain = this.state.duration - timeElapsed;
        if(_timeRemain>0){
            this.setState({timeRemain: _timeRemain});
        } else {
            this.expire();
        }
    }

    cancelConfirmationDialog = (state) => {
        this.setState({
            cancelLightboxOpen: state
        })
    }

    render() {
        return (
            <div className="session">
                <h2 className="title">SESSION</h2>

                <div className="user-details">
                    <p className="user-phone">{this.state.userphone}</p>
                    <p className="user-name">{this.state.username}</p>

                    {
                        this.state.activated ? 
                        <p className="user-table-lock">Table No. {this.state.table}</p> :
                        <input type="text" className="textbox-small user-table" placeholder="Table No." onChange={(table)=>{this.setState({table: table.target.value.trim()})}}/>
                    }
                </div>

                <div className="user-device-container">
                {
                    this.state.device==="iOS" ? <img src="assets/ios.svg" alt="iOS" className="user-device"/> : (
                        this.state.device==="microUSB" ? <img src="assets/microusb.svg" alt="microUSB" className="user-device"/> : (
                            this.state.device==="USB-C" ? <img src="assets/usbc.svg" alt="USB-C" className="user-device"/> : console.log("DEVICE ERROR : Session.jsx ::149")
                        )
                    )
                }
                </div>

                <div className="timer">
                    <p className="timer-remain">{this.state.timeRemain}</p>
                    <p className="timer-detail">Minutes</p>
                </div>

                <div>
                {
                    this.state.activated ? 
                    <input id="otp" type="text" className="textbox otp lock" placeholder={this.state._otp} disabled/> :
                    <input id="otp"
                           type="text"
                           className="textbox otp" 
                           placeholder="Enter OTP"
                           onChange={(otp_f)=>{this.setState({_otp: otp_f.target.value.trim()})}}/>
                }
                </div>

                {
                    this.state.activated ?
                    ( 
                        this.state.expired ?
                            <button className="button session-expired-button"
                                    onClick={this.paymentComplete}
                                    onPointerEnter={(btn)=>btn.target.innerHTML="BILL PAID"}
                                    onPointerLeave={(btn)=>btn.target.innerHTML="EXPIRED"}>EXPIRED</button> : 
                                    (
                                        this.state.timeRemain<=(this.state.duration/2) ? (
                                            <button className="button session-activated-button">ACTIVE</button>
                                        ) : (
                                            <button className="button session-activated-button"
                                                    onClick={()=>{this.cancelConfirmationDialog(true)}}
                                                    onPointerEnter={(btn)=>btn.target.innerHTML="CANCEL"}
                                                    onPointerLeave={(btn)=>btn.target.innerHTML="ACTIVE"}>ACTIVE</button> 
                                        )
                                    )
                    ) : (
                            <button className="button session-start-button" onClick={this.activate}>START</button>
                    )
                }

                {
                    this.state.cancelLightboxOpen ? 
                    <SessionCancelLightbox confirm={this.cancelSession} decline={() => this.cancelConfirmationDialog(false)}/> : console.log()
                }            
            </div>
        );
    }
}

export default Session;