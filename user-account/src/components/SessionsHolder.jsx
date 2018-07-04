import React, { Component } from 'react';
import './css/SessionsHolder.css'
import EmptySessions from './EmptySessions.jsx';
import Session from './Session.jsx';

class SessionsHolder extends Component {
    constructor(){
        super();
        this.state = {
            sessions: [],
            _thisSession: {}
        };
    }

    addNewSession = (session) => {
        let _sessions = this.state.sessions.slice();
        _sessions.push(session);
        this.setState({
            sessions: _sessions,
            _thisSession: {}
        });
    }

    cancelSession = (index) => {
        let _sessions = this.state.sessions.slice();
        //_sessions.splice(index, 1);
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
                <Session sessionID={this.state.sessions[index].sessionID}
                         key={index}
                         startDate={this.state.sessions[index].startDate}
                         locCode={this.state.sessions[index].locCode}
                         duration={this.state.sessions[index].duration}
                         cancel = {() => this.cancelSession(index)}/>
            );
        })

        let emptinessValue = this.emptinessChecker() ? <EmptySessions /> : _addNewSession

        return (
            <div className="sessions-holder container">
                {/* <div className="spacer"></div>
                <p><strong>ACTIVE SESSIONS</strong></p> */}
                {
                    this.state.sessions.length!==0 ? emptinessValue : <EmptySessions />
                }
            </div>
        );
    }
}

export default SessionsHolder;