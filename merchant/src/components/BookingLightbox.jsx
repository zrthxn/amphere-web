import React, { Component } from 'react';
import './css/BookingLightbox.css';
import '../GlobalStyles.css';
import { ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

class BookingLightbox extends Component {
    constructor(){
        super();
        this.state = {
            duration: 30,
            phone: null,
            phoneValid: false,
            device: "microUSB",
        };
    }

    confirmSession = () => {
        this.props.paramsHandler(this.state);
    }

    closeLightbox = () => {
        this.props.aborter();
    }

    setDuration = (_value) => {
        let set = 0;
        if(_value===1){
            set = 30;
        } else if(_value===2){
            set = 60;
        }
        this.setState({
            duration: set
        })
    }

    setDevice = (_value) => {
        let set = "";
        if(_value===1){
            set = "iOS"
        } else if(_value===2){
            set = "microUSB"
        } else if(_value===3){
            set = "USB-C"
        }
        this.setState({
            device: set
        });
    }

    addPhone = (_phone) => {
        if(_phone.target.value!==""){
            this.setState({
                phoneValid: true,
                phone: _phone.target.value
            });
        } else {
            this.setState({
                phoneValid: false,
                phone: null
            });
        }
    }

    render() {
        return (
            <div className="lightbox-shadow">
                <div className="lightbox">
                    <div className="session-settings-holder">
                        
                        <button className="cross-button" onClick={this.closeLightbox}></button>
                        <h2 className="lightbox-title">NEW SESSION</h2>

                        <div className="location">

                            <div className="location-code">
                                <input id="location-code" 
                                        required="true"
                                        className="textbox" 
                                        placeholder="Enter Phone"
                                        onChange={this.addPhone}/>
                            </div>
                            {
                                (this.state.locCodeValid) ? <div className="checkmark"></div> : (
                                    (this.state.locCodeValid===null) ?  console.log() : (
                                        (this.state.locCodeValid==="CHECKING") ? <div className="spinner"></div> : (
                                            (this.state.locCodeValid===false) ? <div className="crossmark"></div> : (
                                                console.log("INTERNAL ERROR")
                                            )
                                        )
                                    )
                                )
                            }
                        </div>

                        <div className="toggle-bars">
                            <ButtonToolbar className="duration-bar">
                                <ToggleButtonGroup onChange={this.setDuration} type="radio" name="options" defaultValue={1} className="toggle-group">
                                    <ToggleButton className="toggle-btn" value={1}>30 mins</ToggleButton>
                                    <ToggleButton className="toggle-btn" value={2}>60 mins</ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>

                            <ButtonToolbar className="device-bar">
                                <ToggleButtonGroup onChange={this.setDevice} type="radio" name="options" defaultValue={2} className="toggle-group">
                                    <ToggleButton className="toggle-btn" value={1}>iOS</ToggleButton>
                                    <ToggleButton className="toggle-btn" value={2}>microUSB</ToggleButton>
                                    <ToggleButton className="toggle-btn" value={3}>USB-C</ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonToolbar>
                        </div>

                        <p className="info">This window is for booking a session for customers with 0% battery or those unable of booking online.
                        Please use it only for it's intended pupose.
                        </p>

                        {
                            (this.state.phoneValid) ? (
                                <button className="confirm-session-button" 
                                        onClick={this.confirmSession}>CONFIRM SESSION</button>
                            ) : (
                                <button className="confirm-session-button button-disabled" 
                                        onClick={this.confirmSession} 
                                        disabled>CONFIRM SESSION</button>
                            )
                        }
                    </div>                        
                </div>
            </div>
        );
    }
}

export default BookingLightbox;