import React, { Component } from 'react';
import '../GlobalStyles.css';
import './css/SessionCancelLightbox.css';
import { ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

class SessionCancelLightbox extends Component {
    constructor(){
        super();
        this.state = {
            reasons: null
        }
    }

    componentDidMount() {
        if(this.props.activation===true){
            
        }
    }

    setReasons = (value) => {
        let set = null;
        if(value===1) set = "USER-REFUSED";
        else if(value===2) set = "EQUIP-WAITING";
        this.setState({ reasons: set });
    }

    render() {
        return (
            <div className="lightbox-shadow">
                <div className="lightbox">
                {
                    this.props.type===1 ? (
                        <div className="cancel-container">
                            <h1>CANCEL SESSION</h1>
                            <p><b>Are you sure you want to cancel this session?</b></p>
                            <p>Please tell us why you are cancelling this session.</p>

                            <ButtonToolbar className="reasons-bar">
                                <ToggleButtonGroup onChange={this.setReasons} type="radio" name="options" className="toggle-group">
                                    <ToggleButton className="toggle-btn" value={1}>User Refused</ToggleButton>
                                    <ToggleButton className="toggle-btn" value={2}>Equipment Waiting</ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>

                            <button className="button btn-thin" onClick={() => this.props.decline()}>CLOSE</button>
                            {
                                this.state.reasons===null ? <button className="button confirm" disabled>CONFIRM</button> : (
                                    <button className="button btn-thin confirm" onClick={() => this.props.confirm(this.state.reasons)}>CONFIRM</button>
                                )
                            }
                        </div>
                    ) : (
                        this.props.type===2 ? (
                            <div className="cancel-container">
                                <h1>CANCEL SESSION</h1>
                                <p>Are you sure you want to cancel this session?</p>

                                <button className="button btn-thin" onClick={() => this.props.decline()}>CLOSE</button>
                                <button className="button btn-thin confirm" onClick={() => this.props.confirm(this.state.reasons)}>CONFIRM</button>
                            </div>
                        ) : console.log()
                    ) 
                }
                </div>
            </div>
        );
    }
}

export default SessionCancelLightbox;