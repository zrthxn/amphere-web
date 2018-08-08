import React, { Component } from 'react';
import EmptySessions from './EmptySessions.jsx';
import Session from './Session.jsx';
import './css/SessionsHolder.css'

class SessionsHolder extends Component {
    constructor(){
        super();
        this.state = {
            sessions: [],
            _thisSession: {},
            sorted: false
        };
    }

    addNewSession = (newSession) => {
        let _sessions = this.state.sessions.slice();
        _sessions.push(newSession);
        this.setState({
            sessions: _sessions,
            _thisSession: newSession,
            sorted: false
        });
        this.sortSessions();
    }

    cancelSession = (index) => {
        let _sessions = this.state.sessions.slice();
        delete _sessions[index];
        this.setState({
            sessions: _sessions
        });
    }

    completeSession = (index) => {
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

    sortSessions = () => {
        let unsorted = this.state.sessions.slice();
        let expired = [], active = [], others = [];
        unsorted.forEach((element)=>{
            if(element!==null){
                if(element.expired===true) expired.push(element);
                else if(element.active===true) active.push(element);
                else others.push(element);
            }
        });
        this.setState({
            sessions: expired.concat(active, others),
            sorted: true
        })
    }

    render() {
        let _addNewSession = this.state.sessions.map((sess, index)=>{
            if(this.state.sessions[index]!==null){
                return (
                    <Session 
                        sid={this.state.sessions[index].sid}
                        uid={this.state.sessions[index].uid}
                        username={this.state.sessions[index].username}
                        userphone={this.state.sessions[index].userphone}
                        device={this.state.sessions[index].device}
                        duration={this.state.sessions[index].duration}
                        startTime={this.state.sessions[index].startTime}
                        activated={this.state.sessions[index].activated}
                        expired={this.state.sessions[index].expired}
                        otp={this.state.sessions[index].otp}
                        dead={this.state.sessions[index].dead}
                        table={this.state.sessions[index].table}
                        key={index}
                        complete = {()=>{this.completeSession(index)}}
                        cancel = {() => this.cancelSession(index)}
                        sorts={()=> this.sortSessions()}
                    />
                );
            }
        })

        return (
            <div className="sessions-holder">
            {
                this.state.sessions.length!==0 ? (
                    !this.emptinessChecker() ? (
                        this.state.sorted ? _addNewSession : console.log()
                    ) : <EmptySessions />
                ) : <EmptySessions />
            }
            </div>
        );
    }
}

export default SessionsHolder;