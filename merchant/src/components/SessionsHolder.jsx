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

        // let _addNewSession = this.state.sessions.map((sess, index)=>{
        //     return (
        //         <Session sid={this.state.sessions[index].sid}
        //                  key={index}
        //                  startDate={this.state.sessions[index].startDate}
        //                  location={this.state.sessions[index].location}
        //                  duration={this.state.sessions[index].duration}
        //                  cancel = {() => this.cancelSession(index)}/>
        //     );
        // })


        // let emptinessValue = this.emptinessChecker() ? <EmptySessions /> : _addNewSession

        return (
            <div className="sessions-holder container">
                <Session/>
                <Session/>
                <Session/>
                <Session/>
                <Session/>
                <Session/>
                <Session/>
                <Session/>
                <Session/>
                <Session/>
                {/* {
                    this.state.sessions.length!==0 ? emptinessValue : <EmptySessions />
                } */}
            </div>
        );
    }
}

export default SessionsHolder;