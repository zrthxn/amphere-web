import React, { Component } from 'react';
import './css/BookingLightbox.css';
import '../GlobalStyles.css';
import { ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import validateLocationCode from '../util/LocationValidation';
import validatePromoCode from '../util/PromoValidation';

class BookingLightbox extends Component {

    constructor(){
        super();
        this.state = {
            duration: "30M",
            locCode: null,
            location: null,
            locCodeValid: null,
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
        if(_value===1){
            this.setState({
                duration: "30M"
            })
        } else if(_value===2){
            this.setState({
                duration: "60M"
            })
        }
    }

    locCodeValidator = (_code) => {
        let result = validateLocationCode(_code.target.value);
        if(result){
            this.setState({
                location: "Amphere Solutions",
                locCode: _code.target.value,
                locCodeValid: true
            })
        } else if (result===null) {
            this.setState({
                location: null,
                locCodeValid: null
            })
        }else {
            this.setState({
                location: "Invalid Code",
                locCodeValid: false
            })
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
                    <div className="session-settings-holder">
                        
                        <button className="cross-button" onClick={this.closeLightbox}></button>
                        
                        <div className="session-settings">
                            <h2>NEW SESSION</h2>

                            <input id="location-code" 
                                   required="true"
                                   className="textbox" 
                                   placeholder="Enter Location Code"
                                   onChange={this.locCodeValidator}/>

                            <p className="session-settings-detail">{this.state.location}</p>
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

                            <h3>Select Duration</h3>

                            <ButtonToolbar className="duration-bar">
                             <ToggleButtonGroup onChange={this.setDuration} type="radio" name="options" defaultValue={1} className="duration-group">
                              <ToggleButton className="duration-btn" value={1}>30 Mins</ToggleButton>
                              <ToggleButton className="duration-btn" value={2}>60 Mins</ToggleButton>
                             </ToggleButtonGroup>
                            </ButtonToolbar>

                            <div className="promoHolder">
                                <h3>Promo Code</h3>

                                <input id="promo-code" 
                                    required="true"
                                    className="textbox-small" 
                                    placeholder="Enter Promo Code"
                                    onChange={this.promoValidator}/>

                                <p className="session-settings-detail">{this.state.promoCode}</p>
                                {
                                    (this.state.promoValid) ? <div className="checkmark checkmark-small"></div> : (
                                        (this.state.promoValid===null) ?  console.log() : (
                                            (this.state.promoValid==="CHECKING") ? <div className="spinner"></div> : (
                                                (this.state.promoValid===false) ? <div className="crossmark"></div> : (
                                                    console.log("INTERNAL ERROR")
                                                )
                                            )
                                        )
                                    )
                                }
                            </div>
                                
                        </div>

                        <p className="info">After booking this session, you will recieve a text SMS
                            telling you your OTP for this session. This is supposed to be supplied to
                            the vendor of the restaurant you are at.
                        </p>
                   
                    </div>
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
        );
    }
}

export default BookingLightbox;