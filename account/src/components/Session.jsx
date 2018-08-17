import React, { Component } from 'react';
import './css/Session.css';
import SessionCancelLightbox from './SessionCancelLightbox';
import SessionUtil from '../util/session';
import SessionFirebase from '../util/Database';

var SessionUpdates = SessionFirebase.firebase.database();
var Timer = SessionFirebase.firebase.database();

class Session extends Component {

    constructor() {
        super();
        this.state = {
            sid: null,
            mid: null,
            device: null,
            duration: null,
            activated: false,
            expired: false,
            startTime: 0,
            timeRemain: 0,
            cancelLightboxOpen: false,
            amount: 10
        }
    }    

    componentWillMount() {
        let amt = 0;
        var timeNow;
        Timer.ref('time').once('value', time => { timeNow = time.val() });

        let device = this.props.device;
        let duration = this.props.duration;
        let timeRemain;
        let timeElapsed = timeNow - (this.props.startTime!==null ? this.props.startTime : 0);

        if(this.props.activated) {
            timeRemain = ((this.props.duration - timeElapsed) > 0) ? (this.props.duration - timeElapsed) : 0;
        } else {
            timeRemain = this.props.duration;
        }

        if(this.props.activated) {
            if(timeElapsed<5) {
                amt = 10;
            } else {
                if(device==="iOS") {
                    if(duration < 50 ) amt = 30;
                    else amt = 40
                } else if (device==="microUSB" || device==="USB-C") {
                    if(duration < 50 ) amt = 20;
                    else amt = 30
                }
            }
        } else {
            amt = 0;
        }

        this.setState({
            sid: this.props.sid,
            mid: this.props.mid,
            device: this.props.device,
            duration: this.props.duration,
            timeRemain: timeRemain,
            startTime: this.props.startTime,
            activated: this.props.activated,
            expired: this.props.expired,
            amount: amt
        });
    }

    componentDidMount() {
        if(this.state.activated===true && this.state.expired===false){
            Timer.ref('time').on('value', (time) => this.TimingFunction(time.val()));
        } else {
            SessionUpdates.ref('sessions/session-' + this.state.sid).on('value', (session)=>{
                let event;
                this.CalculateAmount();
                if(session.val()!==null) event = session.child('status').val().split(' : ')[0];
                if(event!==""){
                    if(event==="ACTIVATED"){
                        this.setState({
                            activated : true,
                            startTime: session.child('startTime').val()
                        });
                        Timer.ref('time').on('value', (time) => this.TimingFunction(time.val()));
                    } else if(event==="EXPIRED"){
                        Timer.ref('time').off('value');
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
        }
    }

    expire = () => {
        Timer.ref('time').off('value');
        this.CalculateAmount();
        this.setState({
            expired: true,
            timeRemain: 0
        });
    }
    
    cancelSession = () => {
        this.cancelConfirmationDialog(false);
        if(this.state.activated===true){
            if(this.state.timeRemain <= (this.state.duration - 5)){
                alert("Session cannot be cancelled after more than 5 minutes of activation");
            } else {
                Timer.ref('time').off('value');
                this.CalculateAmount();
                SessionUtil.CancelActiveSession({
                    "sid": this.state.sid
                }).then((res)=>{
                    if(res.cancelled===true){
                        this.setState({
                            expired: true,
                            timeRemain: 0
                        });
                    }
                }).catch((err)=>{
                    alert(err);
                });
            }
        } else if(this.state.expired===true){
            alert("Session has already expired");
        } else {
            Timer.ref('time').off('value');
            SessionUtil.CancelSession({
                "sid": this.state.sid,
                "exp": "USER-CANCELLED"
            }).then((res)=>{
                if(res.cancelled===true){
                    this.props.cancel();
                }
            }).catch((err)=>{
                alert(err);
            });
        }
    }

    cancelConfirmationDialog = (state) =>  this.setState({ cancelLightboxOpen: state });

    //  ================================== SESSION TIMING FUNCTION ================================== //
        
    TimingFunction = (time) => {
        let timeElapsed = time - this.state.startTime;
        let _timeRemain = this.state.duration - timeElapsed;
        this.CalculateAmount();
        if(_timeRemain>0){
            this.setState({timeRemain: _timeRemain});
        } else {
            this.expire();
        }
    }

    //  ================================== AMOUNT CALCULATION ================================== //

    CalculateAmount = () => {
        let amt;
        let activated = this.state.activated;
        let device = this.state.device;
        let duration = this.state.duration;
        let timeRemain = this.state.timeRemain;

        if(activated) {
            if(timeRemain > (duration-5) ) {
                amt = 10;
            } else {
                if(device==="iOS") {
                    if(duration < 50 ) amt = 30;
                    else amt = 40
                } else if (device==="microUSB" || device==="USB-C") {
                    if(duration < 50 ) amt = 20;
                    else amt = 30
                }
            }
        } else {
            amt = 0;
        }

        this.setState({ amount : amt });
    }

    render() {
        return (
            <div className="session">

                <div className="session-details-container">
                    <div className="session-number">
                        <strong>{this.state.device} SESSION</strong>
                    </div>                    
                    
                    <button className="session-cancel-button" onClick={() => this.cancelConfirmationDialog(true)}>Cancel</button>
                    
                    <p className="session-detail-location"><b>Location Code:</b> {this.state.mid}</p>
                    <p className="session-detail-duration"><b>Duration:</b> {this.state.duration} mins</p>

                    <div className="session-detail-time">
                        <p className="session-time-counter"><b>{this.state.timeRemain}</b></p>
                        <p className="session-time">min<br/>left</p>
                    </div>

                </div>

                {
                    this.state.expired ? <div className="expiry purda"><p>Your session has expired. <b>Amount: Rs.{this.state.amount}</b></p></div> : (
                        this.state.activated ? <div className="active purda"><p>Your session is running</p></div> : (
                            <div className="prestart purda"><p>Give your OTP to start session</p></div>
                        )
                    )
                }

                {
                    this.state.cancelLightboxOpen ? (
                        <SessionCancelLightbox 
                            confirm={()=>this.cancelSession()} 
                            decline={() => this.cancelConfirmationDialog(false)}
                            active={this.state.activated}
                            amount={this.state.amount}/>
                    ) : console.log()
                }
            </div>
        );
    }
}

export default Session;