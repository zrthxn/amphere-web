import React, { Component } from 'react';
import './css/BookingLightbox.css';
import '../GlobalStyles.css';
import { ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import $ from 'jquery';

import LocationValidation from '../util/LocationValidation';
import validatePromoCode from '../util/PromoValidation';

class BookingLightbox extends Component {
    constructor(){
        super();
        this.state = {
            duration: 42,
            locCode: null,
            location: null,
            locCodeValid: null,
            device: "microUSB",
            promoCode: null,
            promoValid: null
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
        if(_value===1) set = 42;
        else if(_value===2) set = 62;

        this.setState({ duration: set });
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

    locCodeValidator = (_code) => {
        _code.persist();
        if(_code.target.value===""){
            $(_code.target).removeClass('error');
            this.setState({
                location: null,
                locCodeValid: null
            });
        } else {
            LocationValidation.validateLocationCode(_code.target.value)
            .then((result)=>{
                if(result.valid===true){
                    $(_code.target).removeClass('error');
                    this.setState({
                        locCode: result.code,
                        locCodeValid: true
                    });
                } else if(result.valid===false) {
                    $(_code.target).addClass('error');
                    this.setState({
                        location: null,
                        locCodeValid: false
                    });
                }
            });
        }
    }

    promoValidator = (_code) => {
        let result = validatePromoCode(_code.target.value);
        if(result){
            this.setState({
                promoCode: "Amphere Solutions",
                promoValid: true
            })
        } else if (result===null) {
            this.setState({
                promoCode: null,
                promoValid: null
            })
        }else {
            this.setState({
                promoCode: "Invalid Code",
                promoValid: false
            })
        }
    }

    render() {
        return (
            <div className="lightbox-shadow">
                <div className="lightbox">
                <button className="cross-button" onClick={this.closeLightbox.bind(this)}></button>
                    <div className="session-settings-holder">
                        <h2 className="lightbox-title">NEW SESSION</h2>

                        <div className="location">
                            <div className="location-code">
                                <input id="location-code" required className="textbox" placeholder="Enter Location Code" onChange={(event)=>{this.locCodeValidator(event)}}/>
                            </div>
                            {/* {
                                (this.state.locCodeValid) ? <div className="checkmark"></div> : (
                                    (this.state.locCodeValid===null) ?  console.log() : (
                                        (this.state.locCodeValid==="CHECKING") ? <div className="spinner"></div> : (
                                            (this.state.locCodeValid===false) ? <div className="crossmark"></div> : (
                                                console.log("INTERNAL ERROR")
                                            )
                                        )
                                    )
                                )
                            } */}
                        </div>

                        <div className="toggle-bars">
                            <ButtonToolbar className="duration-bar">
                                <ToggleButtonGroup onChange={this.setDuration} type="radio" name="options" defaultValue={1} className="toggle-group">
                                    <ToggleButton className="toggle-btn" value={1}>40 mins</ToggleButton>
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

                        <div className="promo-holder">
                            <input id="promo-code"
                                required="true"
                                className="textbox-small"
                                placeholder="Promo Code (Optional)"
                                onChange={this.promoValidator}/>
                        </div>

                        <p className="info">After booking the session, you will receive
                        an SMS with your OTP in it. Supply it to the restaurant’s staff.
                        </p>

                        {
                            (this.state.locCodeValid) ? (
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
