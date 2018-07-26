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
            sessions: _sessions
        });
    }

    completeSession = (index, sid) => {
        let _sessions = this.state.sessions.slice();
        delete _sessions[index];
        this.setState({
            sessions: _sessions
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
                <Session sid={this.state.sessions[index].sid}
                         uid={this.state.sessions[index].uid}
                         username={this.state.sessions[index].username}
                         userphone={this.state.sessions[index].userphone}
                         device={this.state.sessions[index].device}
                         duration={this.state.sessions[index].duration}
                         expired={this.state.sessions[index].expired}
                         key={index}
                         complete = {()=>{this.completeSession(index, this.state.sessions[index].sid)}}
                         cancel = {() => this.cancelSession(index)}/>
            );
        })

        return (
            <div className="sessions-holder">
            {
                this.state.sessions.length!==0 ? (
                    !this.emptinessChecker() ? (
                        _addNewSession 
                    ) : <EmptySessions />
                ) : <EmptySessions />
            }
            </div>
        );
    }
}

export default SessionsHolder;