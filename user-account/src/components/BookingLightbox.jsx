import React, { Component } from 'react';
import './css/BookingLightbox.css';
import '../GlobalStyles.css';
import { ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import LocationValidation from '../util/LocationValidation';
import validatePromoCode from '../util/PromoValidation';

class BookingLightbox extends Component {
    constructor(){
        super();
        this.state = {
            duration: 30,
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

    locCodeValidator = (_code) => {
        LocationValidation.validateLocationCode(_code.target.value).then((result)=>{
            if(result.valid===true){
                this.setState({
                    locCode: result.code,
                    locCodeValid: true
                });
            } else if(result.valid===null) {
                this.setState({
                    location: null,
                    locCodeValid: null
                });
            } else if(result.valid===false) {
                this.setState({
                    locCodeValid: false
                });
            }
        });
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
                    <div className="session-settings-holder">
                        
                        <button className="cross-button" onClick={this.closeLightbox}></button>
                        <h2 className="lightbox-title">NEW SESSION</h2>

                        <div className="location">

                            <div className="location-code">
                                <input id="location-code" 
                                        required="true"
                                        className="textbox" 
                                        placeholder="Enter Location Code"
                                        onChange={this.locCodeValidator}/>
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

                        <div className="promo-holder">
                            <input id="promo-code" 
                                required="true"
                                className="textbox-small" 
                                placeholder="Promo Code (Optional)"
                                onChange={this.promoValidator}/>
                        </div>

                        <p className="info">After booking this session, you will recieve a text SMS
                        telling you your OTP for this session. This is supposed to be supplied to
                        the vendor of the restaurant.
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