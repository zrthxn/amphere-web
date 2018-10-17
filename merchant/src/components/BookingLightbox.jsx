import React, { Component } from 'react';
import './css/BookingLightbox.css';
import '../GlobalStyles.css';
import { ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import $ from 'jquery';

import SessionConfirmLightbox from './SessionConfirmLightbox';
import PhoneValidation from '../util/PhoneValidation';
import CouponValidation from '../util/PhoneValidation';

class BookingLightbox extends Component {
    constructor(){
        super();
        this.state = {
            duration: 42,
            phone: null,
            phoneValid: false,
            device: "microUSB",
            //------//
            promoValid:false,
            promoCode:null,
            promoAmount:null,
            phoneNoValid:false,
            username:null
            //------//
        };
    }

    //---------//
    confirmSession = (phoneValid) => {
        if(phoneValid)
        {
            this.couponvalidate(this.state.phone).then(()=>{
                this.props.paramsHandler(this.state);
            });
        }
        else
        {
            this.setState({
                confirmBox:true
            });
        }
    }

    confirmSessionBox = () =>{
        this.props.paramsHandler(this.state);
    }
    //--------//

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

    /*
    addPhone = (_phone) => {
        if(_phone.target.value!=="" && /^\d+$/.test(_phone.target.value) && _phone.target.value.length === 10){
            $(_phone.target).removeClass('error');
            this.setState({
                phoneValid: true,
                phone: _phone.target.value
            });
        } else {
            $(_phone.target).addClass('error');
            this.setState({
                phoneValid: false,
                phone: null
            });
        }
    }
    */

    //---------//
    phoneValidator = (_phone) => {
        _phone.persist();
        if(_phone.target.value===""){
            $(_phone.target).removeClass('error');
            this.setState({
                phone:null,
                phoneValid:false
            });
        } else if(_phone.target.value!=="" && /^\d+$/.test(_phone.target.value) && _phone.target.value.length === 10){
            console.log('Phone Validation Starts');
            PhoneValidation.ValidatePhone(_phone.target.value).then((result)=>{
                console.log(result);
                if(result.valid){
                    $(_phone.target).removeClass("error");
                    $(_phone.target).addClass("success");
                    this.setState({
                        phone:result.user,
                        phoneValid:true,
                        username: result.username,
                        phoneNoValid:true
                    });
                }
                else
                {
                    $(_phone.target).removeClass("error");
                    $(_phone.target).addClass("new");
                    this.setState({
                        phone:_phone.target.value,
                        phoneValid:false,
                        username:"Not Registered",
                        phoneNoValid:true
                    });
                }
            });
        } else
        {
            $(_phone.target).removeClass("success");
            $(_phone.target).removeClass("new");
            $(_phone.target).addClass("error");
            this.setState({
                phoneValid:false,
                phone:null
            });
        }
    }

    couponvalidate = (user) => {
        return new Promise((resolve,reject)=>{
            CouponValidation.ValidateCoupon(user).then((result)=>{
                if(result.valid)
                {
                    this.setState({
                        promoValid:true,
                        promoCode:result.promoCode,
                        promoAmount:result.promoAmount
                    });
                    resolve({
                        "success":true
                    });
                }
                else
                {
                    this.setState({
                        promoValid:false,
                        promoCode:null,
                        promoAmount:null
                    });
                    resolve({
                        "success":false
                    });
                }
            });
        });
    }

    cancelConfirmLightbox = (state) =>{
        this.setState({
            confirmBox:state
        });
    }
    //-------//

    render() {
        return (
            <div className="lightbox-shadow">
                <div className="lightbox">

                <button className="cross-button" onClick={this.closeLightbox.bind(this)}></button>
                    <div className="session-settings-holder">

                        <h2 className="lightbox-title">NEW SESSION</h2>

                        <div className="location">

                            <div className="location-code">
                                <input id="phone" required className="textbox" placeholder="Enter Phone" onChange={this.phoneValidator}/>
                            </div>
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

                        <p className="info">This window is for booking a session for customers with 0% battery or those unable of booking online.
                        Please use it only for it's intended pupose.
                        </p>

                        {
                            (this.state.phoneNoValid) ? (
                                <button className="confirm-session-button"
                                        onClick={() => this.confirmSession(this.state.phoneValid)}>CONFIRM SESSION</button>
                            ) : (
                                <button className="confirm-session-button button-disabled"
                                        onClick={() => this.confirmSession(this.state.phoneValid)}
                                        disabled>CONFIRM SESSION</button>
                            )
                        }
                        {
                            (this.state.confirmBox) ? (
                                <SessionConfirmLightbox
                                    confirm={()=>this.confirmSessionBox(this.state.phoneValid)}
                                    decline={() => this.cancelConfirmLightbox(false)}
                                    phone={this.state.phone}
                                    username={this.state.username}/>
                            ) : console.log()
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default BookingLightbox;
