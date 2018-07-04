import React, { Component } from 'react';
import './css/Session.css';
import SessionCancelLightbox from './SessionCancelLightbox';

class Session extends Component {

    constructor() {
        super();
        this.state = {
            sessionID: "UNASSIGNED",
            startDate: "NULL",
            locCode: "NULL",
            duration: "NULL",
            status: "NO-CODE",
            cancelLightboxOpen: false
        }
    }

    componentDidMount() {
        this.setState({
            sessionID: this.props.sessionID,
            startDate: this.props.startDate,
            locCode: this.props.locCode,
            duration: this.props.duration,
            status: "ACTIVATED"
        });
    }

    componentWillUnmount(){
    }

    setTimeoutFunc = () => {
        if(this.state.duration === "30M"){
            return (
                <div className="timeout timeout-30"></div>
            );
        } else if(this.state.duration === "60M"){
            return (
                <div className="timeout timeout-60"></div>
            );
        } else {
            return (
                <div className="timeout"></div>
            );
        }
    }

    cancelConfirmationDialog = (state) => {
        this.setState({
            cancelLightboxOpen: state
        })
    }

    cancelSession = () => {
        this.props.cancel();
    }

    render() {
        let timeout = this.setTimeoutFunc();
        return (
            <div className="session">
                <div className="session-details-container">
                    <div className="session-number">
                        <strong>SESSION: {this.state.sessionID}</strong>
                        <button className="session-cancel-button" onClick={() => this.cancelConfirmationDialog(true)}>Cancel</button>
                    </div>
                    <div className="spacer-small"></div>
                    
                    <p className="session-detail">Started On: {this.state.startDate}</p>
                    <p className="session-detail">Location Code: {this.state.locCode}</p>
                    <p className="session-detail">Duration: {this.state.duration}</p>
                </div>
                
                {timeout}    

                {
                    this.state.cancelLightboxOpen ? (
                        <SessionCancelLightbox confirm={this.cancelSession} 
                                               decline={() => this.cancelConfirmationDialog(false)}/>
                    ) : console.log()
                }              
            </div>
        );
    }
}

export default Session;