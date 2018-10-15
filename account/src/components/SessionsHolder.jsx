import React, { Component } from 'react';
import EmptySessions from './EmptySessions.jsx';
import Session from './Session.jsx';
import './css/SessionsHolder.css'

class SessionsHolder extends Component {
    constructor(){
        super();
        this.state = {
            sessions: [],
            _thisSession: {}
        };
    }

    addNewSession = (newSession) => {
        let _sessions = this.state.sessions.slice();
        _sessions.push(newSession);
        this.setState({
            sessions: _sessions,
            _thisSession: newSession
        });
    }

    cancelSession = (index) => {
        let _sessions = this.state.sessions.slice();
        delete _sessions[index];
        this.setState({
            sessions: _sessions,
            _thisSession: {}
        });
    }

    completeSession = (index) => {
        let _sessions = this.state.sessions.slice();
        delete _sessions[index];
        this.setState({
            sessions: _sessions,
            _thisSession: {}
        });
    }

    isEmpty = (obj) => {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    emptinessChecker = () => {
        let flag = true;
        this.state.sessions.forEach(element => {
            if(!this.isEmpty(element)){
                flag = false;
            }
        });
        return flag;
    }

    render() {

        let _addNewSession = this.state.sessions.map((sess, index)=>{
            return (
                <Session 
                    sid={this.state.sessions[index].sid}
                    mid={this.state.sessions[index].mid}
                    device={this.state.sessions[index].device}
                    duration={this.state.sessions[index].duration}
                    startTime={this.state.sessions[index].startTime}
                    activated={this.state.sessions[index].activated}
                    expired={this.state.sessions[index].expired}
                    amount={this.state.sessions[index].amount}
                    key={index}
                    complete = {()=>{this.completeSession(index, this.state.sessions[index].sid)}}
                    cancel = {() => this.cancelSession(index)}
                />
            );
        });

        let emptinessValue = this.emptinessChecker() ? <EmptySessions/> : _addNewSession

        return (
            <div className="sessions-holder">
                {
                    this.state.sessions.length!==0 ? emptinessValue : <EmptySessions/>
                }
                {
                    this.state.sessions.length!==0 ? ( 
                        !this.emptinessChecker() ? (
                            <div className="caution">
                            <div className="caution-holder">
                                <input id="collapse-toggle" type="checkbox" className="checkbox"/>

                                <p className="heading">As you satisfy your appetite, we’ll ensure that your phone’s battery gets its own healthy diet!</p>
                                <ul>
                                    <li>Please handle the equipment with care.</li>
                                    <li>We use quality equipment to ensure the safety of your device.</li>
                                    <li>The cables are certified to avoid any harm to your device.</li>
                                </ul>

                                <label htmlFor="collapse-toggle" className="collapse"><span></span></label>
                            </div>                    
                        </div>
                        ) : console.log()
                    ) : console.log()
                }
                
            </div>
        );
    }
}

export default SessionsHolder;