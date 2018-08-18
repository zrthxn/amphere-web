import React, { Component } from 'react';
import SessionCancelLightbox from './SessionCancelLightbox';
import SessionUtil from '../util/session';
import $ from 'jquery';
import './css/Session.css';
import SessionFirebase from '../util/Database';

const SessionUpdates = SessionFirebase.firebase.database();
const SessionTime = SessionFirebase.firebase.database();
const Timer = SessionFirebase.firebase.database();

class Session extends Component {
    constructor() {
        super();
        this.state = {
            activated: false,
            expired: false,
            sid: null,
            uid: null,
            username: null,
            userphone: null,
            device: null,
            duration: null,
            otp: null,
            dead: false,
            _otp: "AMPDEAD",
            startTime: null,
            timeRemain: null,
            cancelLightboxOpen: false,
            preCancelLightboxOpen: false,
            table: null,
            collected: false,
            amount: 10
        }
    }

    componentWillMount() {
        let table_set = localStorage.getItem('session-'+ this.props.sid + '-table');
        
        if(this.props.activated===true && table_set!==null) {
            table_set = table_set.split('-')[1];
        } else if(this.props.activated===true && this.props.table!==null) {
            table_set = this.props.table;
        } else { 
            table_set = null 
        }

        let timeNow;
        SessionTime.ref('time').once('value', time => { timeNow = time.val() });
        let timeElapsed = this.props.startTime!==null ? (timeNow - this.props.startTime) : 0;
        let timeRemain;

        if(this.props.activated===true) {
            timeRemain = (this.props.duration - timeElapsed) > 0 ? (this.props.duration - timeElapsed) : 0;
        } else {
            timeRemain = this.props.duration;
        }
        if(this.props.expired===true) {
            timeRemain = 0;
        } 

        this.setState({
            sid: this.props.sid,
            uid: this.props.uid,
            username: this.props.username,
            userphone: this.props.userphone,
            device: this.props.device,
            duration: this.props.duration,
            timeRemain: timeRemain,
            startTime: this.props.startTime,
            activated: this.props.activated,
            expired: this.props.expired,
            otp: this.props.otp,
            dead: this.props.dead,
            table: table_set,
            amount: this.props.amount
        });
    }

    componentDidMount() {
        if(this.state.activated===true && this.state.expired===false){
            Timer.ref('time').on('value', (time) => this.TimingFunction(time.val()));
        } else {
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
                        Timer.ref('time').on('value', (time) => this.TimingFunction(time.val()));
                    } else if(event==="EXPIRED"){
                        Timer.ref('time').off('value');
                        this.setState({ timeRemain: 0, expired: true, amount: session.child('amount').val() });
                    } else if(event==="COMPLETED"){
                        SessionUpdates.ref().off();
                        this.props.complete();
                    } else if(event==="CANCELLED"){
                        SessionUpdates.ref().off();
                        this.props.cancel();
                    } else if(event==="COLLECTED"){
                        SessionUpdates.ref().off();
                        this.setState({ timeRemain: 0, expired: true, collected: true });
                    }
                }
            });
        }
    }
    
    //  ========================= STATE CHANGE FUNCTIONS ============================= //

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
                        Timer.ref('time').on('value', (time) => this.TimingFunction(time.val()));
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
        let amt = this.CalculateAmount();

        SessionFirebase.firebase.database().ref('sessions/session-' + this.state.sid).update({ "amount" : amt });
        SessionUtil.ExpireSession(this.state.sid).then(()=>{    
            this.setState({
                timeRemain: 0,
                expired: true,
                amount: amt
            });
        });
    }
    
    cancelSession = (reasons) => {
        this.cancelConfirmationDialog(false);
        if(this.state.activated===true){
            if(this.state.timeRemain <= (this.state.duration-5)){
                alert("Session cannot be cancelled after more than 5 minutes of activation");
            } else {
                this.setState({ activated : false });
                Timer.ref('time').off('value');
                SessionUtil.CancelSession({
                    "sid": this.state.sid,
                    "exp": reasons
                }).then((res)=>{
                    if(res.cancelled===true) this.props.cancel(); 
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
                if(res.cancelled===true) this.props.cancel();
            }).catch((err)=>{
                alert(err);
            });
        }
    }

    paymentComplete = () => {
        let conf = window.confirm("Please confirm if the payment and the equipment have been collected successfully.");
        if(conf) {
            if(this.state.collected===true){
                localStorage.removeItem('session-'+ this.props.sid + '-table');
                SessionUtil.CompleteSession({
                    "sid": this.state.sid
                }).then((res)=>{
                    if(res===true) this.props.complete();
                }).catch((err)=>{
                    alert(err);
                });
            } else {
                alert("Please collect the equipment first!");
            }
        }
    }
    
    //  ========================= VALUE SETTERS AND LIGHTBOX OPENERS ============================= //

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

    setTable = (table) => {
        if(table.target.value!==""){
            this.setState({table: table.target.value.trim()});
        } else this.setState({table: null});
    }

    setCollected = () => {
        let conf = window.confirm("Please confirm if the equipment has been collected fom the user.");
        if(conf) {
            this.CalculateAmount(this.state.duration - this.state.timeRemain);
            SessionFirebase.firebase.database().ref('sessions/session-' + this.state.sid).child('status')
            .once('value', (statuss)=>{
                let stat = statuss.val().split(' : ')[1];
                SessionFirebase.firebase.database().ref('sessions/session-' + this.state.sid).update({ 
                    "status" : "COLLECTED" + " : " + stat,
                    "collected" : true 
                });
            });
            this.setState({ collected: true });
        }
    }

    cancelConfirmationDialog = (state) => {
        this.CalculateAmount();
        this.setState({ cancelLightboxOpen: state });
    }

    preCancelConfirmationDialog = (state) => this.setState({preCancelLightboxOpen: state})

    //  ================================== SESSION TIMING FUNCTION ================================== //
    
    TimingFunction = (time) => {
        let timeElapsed = time - this.state.startTime;
        let _timeRemain = this.state.duration - timeElapsed;
        if(_timeRemain>0){
            this.setState({timeRemain: _timeRemain});
        } else {
            this.expire();
        }
    }

    //  ================================== AMOUNT CALCULATION ================================== //

    CalculateAmount = () => {
        let amt = 10;
        let device = this.state.device;
        let duration = this.state.duration;
        let timeRemain = this.state.timeRemain;

        if( timeRemain <= (duration-5) ) {
            if(device==="iOS") {
                if(duration < 50 ) amt = 30;
                else amt = 40
            } else if (device==="microUSB" || device==="USB-C") {
                if(duration < 50 ) amt = 20;
                else amt = 30
            }
        }

        return amt;
    }

    
    //  ---------------------------------------------------------------------------------------- //
    //  ======================================== B O D Y ======================================= //
    //  ---------------------------------------------------------------------------------------- //

    render() {
        return (
            <div className="session">
                {
                    this.state.expired ? (
                        <div className="expiry-purda">
                            <h1>Table {this.state.table}</h1>
                            <h3><b>Phone:</b> {this.state.userphone}</h3>
                            <p>This session has expired. Please collect the equipment from the user.</p>

                            {
                                !this.state.collected ? 
                                <button className="button" onClick={() => this.setCollected()}>EQUIPMENT COLLECTED</button> 
                                : 
                                <h2><b>Amount :</b> Rs {this.state.amount}</h2>
                            }

                        </div>
                    ) : console.log()
                }

                {
                    this.state.dead ? <h2 className="title">DEAD SESSION</h2> : <h2 className="title">SESSION</h2>
                }

                {
                    this.state.activated ? console.log() : <button className="cross-button" onClick={() => this.preCancelConfirmationDialog(true)}/>
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
                    this.state.cancelLightboxOpen ? (
                        <SessionCancelLightbox confirm={(R)=>this.cancelSession(R)} decline={() => this.cancelConfirmationDialog(false)} type={1}/>
                    ) : console.log()
                }

                {
                    this.state.preCancelLightboxOpen ? (
                        <SessionCancelLightbox confirm={(R)=>this.cancelSession(R)} decline={() => this.preCancelConfirmationDialog(false)} type={2}/>
                    ) : console.log()
                }
            </div>
        );
    }
}

export default Session;