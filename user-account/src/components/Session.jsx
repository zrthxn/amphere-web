import React, { Component } from 'react';
import './css/Session.css';
import SessionCancelLightbox from './SessionCancelLightbox';

import SessionUtil from '../util/session';
import SessionFirebase from '../util/Database';
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
            cancelLightboxOpen: false
        }
    }    

    componentWillMount() {
        this.setState({
            sid: this.props.sid,
            mid: this.props.mid,
            device: this.props.device,
            duration: this.props.duration,            
            timeRemain: this.props.duration,
            startTime: this.props.startTime,
            activated: this.props.activated,
            expired: this.props.expired
        });
    }

    componentDidMount() {
        SessionFirebase.firebase.database().ref().child('sessions').orderByChild('sid').equalTo(this.state.sid)
        .once('child_changed', (session, prevChildKey)=>{
            if(session.val().activated===true){
                this.setState({
                    startTime: session.val().startTime,
                    activated: true
                });
                Timer.ref('time').on('value', (timeNow)=>{
                    let timeElapsed = timeNow.val() - this.state.startTime;
                    let _timeRemain = this.state.duration - timeElapsed;
                    if(_timeRemain>0){
                        this.setState({timeRemain:  _timeRemain});
                    } else {
                        this.expire();
                    }
                });
            } else if(session.val().expired===true){
                this.expire();
            } else if(session.val().isDeleted===true){
                this.props.complete();
            }
        });

        if(this.state.activated===true){
            Timer.ref('time').on('value', (timeNow)=>{
                let timeElapsed = timeNow.val() - this.state.startTime;
                let _timeRemain = this.state.duration - timeElapsed;
                if(_timeRemain>0){
                    this.setState({timeRemain:  _timeRemain});
                } else {
                    this.expire();
                }
            });
        }
    }

    expire = () => {
        Timer.ref('time').off('value');
        this.setState({
            expired: true,
            activated : false,
            timeRemain: 0
        });
    }
    
    cancelSession = () => {
        this.cancelConfirmationDialog(false);
        if(this.state.activated===true){
            if(this.state.timeRemain <= (this.state.duration/2)){
                alert("Session cannot be cancelled after half the time has elapsed");
            } else {
                this.setState({ activated : false });
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

    cancelConfirmationDialog = (state) => {
        this.setState({
            cancelLightboxOpen: state
        })
    }

    render() {
        return (
            <div className="session">

                {
                    this.state.activated ? <div className="active-indicator"><p className="indicator-text">ACTIVE</p></div> : (
                        this.state.expired ? <div className="expired-indicator"><p className="indicator-text">EXPIRED</p></div> : console.log()
                    )
                }

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
                    this.state.cancelLightboxOpen ? (
                        <SessionCancelLightbox confirm={()=>this.cancelSession()} 
                                               decline={() => this.cancelConfirmationDialog(false)}/>
                    ) : console.log()
                }
            </div>
        );
    }
}

export default Session;