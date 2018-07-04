import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import './css/Header.css';
import $ from 'jquery';

class Header extends Component {

    componentDidMount(){
        $(window).on("scroll", function() {
            if($(window).scrollTop() > 50) {
                $("header").addClass("active");
            } else {
               $("header").removeClass("active");
            }
        });
    }

    logoutInitiate = () => {
        this.props.logoutWorker();
    }


    render() {
        return (
            <header>
                <Image className="logo-text" src="assets/amphere-text.svg" />
                
                {/* <button id="logout-init" className="btn-thin btn-logout" onClick={this.logoutInitiate}>Log out</button> */}

                <input id="sidebar-toggle" type="checkbox" className="checkbox" />
                <div className="sidebar-shadow"></div>
                <div className="sidebar">
                    <div className="sidebar-banner">

                        <div className="sidebar-banner-container">
                            <p>MY ACCOUNT</p>
                            <h2>Hey Alisamar!</h2>
                            <p>+91 98230 23812</p>
                        </div>
                        
                    </div>
                    <nav className="sidebar-nav">
                        <ul>
                            <li><a>HOME</a></li>
                            <li><a>CONTACT</a></li>
                            <li><a>ABOUT</a></li>
                        </ul>
                    </nav>
                </div>
                <label htmlFor="sidebar-toggle" className="hamburger"></label>
            </header>
        );
    }
}

export default Header;