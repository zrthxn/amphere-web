import React, { Component } from 'react';
import './css/EmptySessions.css';

class EmptySessions extends Component {
    render() {
        return (
            <div className="empty-sessions">
                <p>No active sessions</p>
            </div>
        );
    }
}

export default EmptySessions;