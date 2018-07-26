import React, { Component } from 'react';
import '../GlobalStyles.css';
import './css/SessionCancelLightbox.css';

class SessionCancelLightbox extends Component {
    constructor(){
        super();
        this.state = {
            reasons: null
        }
    }

    setReasons = (field) => {
        let set = null;
        if(field.target.value!==""){
            set = field.target.value;
        }
        this.setState({
            reasons: set
        });
    }

    render() {
        return (
            <div className="lightbox-shadow">
                <div className="lightbox">
                    <div className="cancel-container">
                        <h1>CANCEL SESSION</h1>
                        <p>Are you sure you want to cancel this session?</p>

                        <input type="text" className="textbox" placeholder="Explaination" onChange={this.setReasons}/>

                        <button className="button btn-thin" onClick={this.props.decline}>CLOSE</button>
                        <button className="button btn-thin confirm" onClick={this.props.confirm(this.state.reasons)}>CONFIRM</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SessionCancelLightbox;