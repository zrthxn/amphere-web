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
            dead: false,
            _otp: "AMPDEAD",
            startTime: 0,
            timeRemain: 0,
            cancelLightboxOpen: false,
            table: null
        }
    }

    componentWillMount() {
        let tableLST = localStorage.getItem('session-'+ this.props.sid + '-table');
        if(tableLST!==null){
            tableLST = tableLST.split('-')[1];
        }
        this.setState({
            sid: this.props.sid,
            uid: this.props.uid,
            username: this.props.username,
            userphone: this.props.userphone,
            device: this.props.device,
            duration: this.props.duration,
            timeRemain: this.props.duration,
            startTime: this.props.startTime,
            activated: this.props.activated,
            expired: this.props.expired,
            otp: this.props.otp,
            dead: this.props.dead,
            table: tableLST
        });
    }

    componentDidMount() {
        if(this.state.activated===true){
            Timer.ref('time').on('value', (timeNow)=>{
                let timeElapsed = timeNow.val() - this.state.startTime;
                let _timeRemain = this.state.duration - timeElapsed;
                if(_timeRemain>0){
                    this.setState({timeRemain: _timeRemain});
                } else {
                    this.expire();
                }
            });
        }
    }

    activate = () => {
        if(this.state._otp === this.state.otp){
            localStorage.setItem('session-'+ this.state.sid + '-table', 'table-' + this.state.table);
            SessionUtil.ActivateSession({
                "sid": this.state.sid,
                "otp": this.state._otp
            }).then((res)=>{
                if(res.activated===true){
                    this.setState({
                        activated : true,
                        startTime: res.time
                    });
                    Timer.ref('time').on('value', (timeNow)=>{
                        let timeElapsed = timeNow.val() - this.state.startTime;
                        let _timeRemain = this.state.duration - timeElapsed;
                        if(_timeRemain>0){
                            this.setState({timeRemain: _timeRemain});
                        } else {
                            this.expire();
                        }
                    });
                }
            });
        } else {
           alert("Incorrect OTP! Please try again.");
        }
    }

    expire = () => {
        Timer.ref('time').off('value');
        SessionUtil.ExpireSession(this.state.sid).then(()=>{    
            this.setState({
                timeRemain: 0,
                expired: true
            });
        });
    }
    
    cancelSession = (reasons) => {
        this.cancelConfirmationDialog(false);
        if(this.state.activated===true){
            if(this.state.timeRemain <= (this.state.duration/2)){
                alert("Session cannot be cancelled after half the time has elapsed");
            } else {
                this.setState({ activated : false });
                Timer.ref('time').off('value');
                SessionUtil.CancelSession({
                    "sid": this.state.sid,
                    "exp": reasons
                }).then((res)=>{
                    if(res.cancelled===true){
                        this.props.cancel();
                    }
                }).catch((err)=>{
                    alert(err);
                });
            }
        } else {
            Timer.ref('time').off('value');
            SessionUtil.CancelSession({
                "sid": this.state.sid,
                "exp": reasons
            }).then((res)=>{
                if(res.cancelled===true){
                    this.props.cancel();
                }
            }).catch((err)=>{
                alert(err);
            });
        }
    }

    paymentComplete = () => {
        localStorage.removeItem('session-'+ this.props.sid + '-table');
        SessionUtil.CompleteSession({
            "sid": this.state.sid
        }).then((res)=>{
            if(res===true){
                this.props.complete();
            }
        }).catch((err)=>{
            alert(err);
        });
    }

    cancelConfirmationDialog = (state) => {
        this.setState({
            cancelLightboxOpen: state
        })
    }

    render() {
        return (
            <div className="session">
                {
                    this.state.dead ? <h2 className="title">DEAD SESSION</h2> : <h2 className="title">SESSION</h2>
                }

                <div className="user-details">
                    <p className="user-phone">{this.state.userphone}</p>
                    <p className="user-name">{this.state.username}</p>
                    {

                        this.state.dead ? <p>For 0% battery</p> : (
                            this.state.activated ? 
                            <input id="otp" type="text" className="textbox-small otp lock" placeholder={this.state.otp} disabled/> :
                            <input id="otp"
                                type="text"
                                className="textbox-small otp" 
                                placeholder="Enter OTP"
                                onChange={(otp_f)=>{this.setState({_otp: otp_f.target.value.trim()})}}/>
                        )                        
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

                <div className="user-table">
                {
                    this.state.activated ? (
                        <div>
                            <input type="text" className="textbox user-table-lock" placeholder={"Table " + this.state.table} disabled/>
                        </div>
                    ) :
                    <input type="text" className="textbox user-table-field" placeholder="Table No." onChange={(table)=>{this.setState({table: table.target.value.trim()})}}/>
                }
                </div>

                {
                    this.state.activated ?
                    ( 
                        this.state.expired ?
                            <button className="button session-expired-button"
                                    onClick={this.paymentComplete}
                                    onPointerEnter={(btn)=>btn.target.innerHTML="BILL PAID"}
                                    onPointerLeave={(btn)=>btn.target.innerHTML="EXPIRED"}>EXPIRED</button>
                            :         
                            <button className="button session-activated-button"
                                    onClick={() => this.cancelConfirmationDialog(true)}
                                    onPointerEnter={(btn)=>btn.target.innerHTML="CANCEL"}
                                    onPointerLeave={(btn)=>btn.target.innerHTML="ACTIVE"}>ACTIVE</button> 
                                    
                    ) : (
                            <button className="button session-start-button" onClick={() => this.activate()}>START</button>
                    )
                }

                {
                    this.state.cancelLightboxOpen ? 
                    <SessionCancelLightbox confirm={(R)=>this.cancelSession(R)} decline={() => this.cancelConfirmationDialog(false)}/> : console.log()
                }            
            </div>
        );
    }
}

export default Session;