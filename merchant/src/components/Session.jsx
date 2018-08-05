import React, { Component } from 'react';
import SessionCancelLightbox from './SessionCancelLightbox';
import SessionUtil from '../util/session';
import $ from 'jquery';

import './css/Session.css';

import SessionFirebase from '../util/Database';
var SessionUpdates = SessionFirebase.firebase.database();
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
            startTime: null,
            timeRemain: 0,
            cancelLightboxOpen: false,
            table: null
        }
    }

    componentWillMount() {
        let table_set = localStorage.getItem('session-'+ this.props.sid + '-table');
        if(table_set!==null) table_set = table_set.split('-')[1];
        else table_set = this.props.table;
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
            table: table_set
        });
    }

    componentDidMount() {
        SessionUpdates.ref('sessions/session-' + this.state.sid).on('value', (session)=>{
            let event;
            if(session.val()!==null) event = session.child('status').val().split(' : ')[0];
            if(event!==""){
                if(event==="ACTIVATED"){
                    this.setState({
                        activated : true,
                        startTime: session.child('startTime').val(), 
                        table: session.child('table').val()
                    });
                } else if(event==="EXPIRED"){
                    this.setState({ timeRemain: 0, expired: true });
                } else if(event==="COMPLETED"){
                    SessionUpdates.ref().off();
                    this.props.complete();
                } else if(event==="CANCELLED"){
                    SessionUpdates.ref().off();
                    this.props.cancel();
                }
            }
        });

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

    setOTP = (otp_f) => {
        if(otp_f.target.value!=="" && /^\d+$/.test(otp_f.target.value) && otp_f.target.value.length === 4){
            $(otp_f.target).removeClass('error');
            this.setState({_otp: otp_f.target.value.trim()});
        } else if(otp_f.target.value==="") {
            $(otp_f.target).removeClass('error');
        } else {
            $(otp_f.target).addClass('error');
        }
    }

    activate = () => {
        if(this.state.table!==null){
            if(this.state._otp === this.state.otp){
                localStorage.setItem('session-'+ this.state.sid + '-table', 'table-' + this.state.table);
                SessionUtil.ActivateSession({
                    "sid": this.state.sid,
                    "otp": this.state._otp,
                    "table": this.state.table
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
        } else {
            alert("Please enter a table number");
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

    setTable = (table) => {
        if(table.target.value!==""){
            this.setState({table: table.target.value.trim()});
        } else {
            this.setState({table: null});
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
                {
                    this.state.dead ? <h2 className="title">DEAD SESSION</h2> : <h2 className="title">SESSION</h2>
                }

                <button className="cross-button" onClick={() => this.cancelConfirmationDialog(true)}/>

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
                                onChange={this.setOTP}/>
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
                    <input type="text" className="textbox user-table-field" placeholder="Table No." onChange={this.setTable.bind(this)}/>
                }
                </div>

                {
                    this.state.activated ?
                    ( 
                        this.state.expired ?
                            <button className="session-expired-button"
                                    onClick={this.paymentComplete}
                                    onPointerEnter={(btn)=>btn.target.innerHTML="BILL PAID"}
                                    onPointerLeave={(btn)=>btn.target.innerHTML="EXPIRED"}>EXPIRED</button>
                            :         
                            <button className="session-activated-button"
                                    onClick={() => this.cancelConfirmationDialog(true)}
                                    onPointerEnter={(btn)=>btn.target.innerHTML="CANCEL"}
                                    onPointerLeave={(btn)=>btn.target.innerHTML="ACTIVE"}>ACTIVE</button> 
                                    
                    ) : (
                            <button className="session-start-button" onClick={() => this.activate()}>START</button>
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