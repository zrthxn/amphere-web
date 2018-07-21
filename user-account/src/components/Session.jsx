import React, { Component } from 'react';
import './css/Session.css';
import SessionCancelLightbox from './SessionCancelLightbox';

class Session extends Component {

    constructor() {
        super();
        this.state = {
            sid: "UNASSIGNED",
            startDate: null,
            location: null,
            duration: null,
            cancelLightboxOpen: false
        }
    }

    componentDidMount() {
        this.setState({
            sid: this.props.sid,
            startDate: this.props.startDate,
            location: this.props.location,
            duration: this.props.duration
        });
    }

    componentWillUnmount(){
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
        return (
            <div className="session">
                <div className="session-details-container">
                    <div className="session-number">
                        <strong>SESSION: {this.state.sid}</strong>
                        <button className="session-cancel-button" onClick={() => this.cancelConfirmationDialog(true)}>Cancel</button>
                    </div>
                    <div className="spacer-small"></div>
                    <p className="session-detail">Started On: {this.state.startDate}</p>
                    <p className="session-detail">Location Code: {this.state.location}</p>
                    <p className="session-detail">Duration: {this.state.duration}</p>
                </div>

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