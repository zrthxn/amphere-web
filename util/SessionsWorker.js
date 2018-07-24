const SMSConfig = require('../config.json');
const firebaseSessions = require('./Database');

exports.BookNewSession = function (params) {

    var sessionsData = firebaseSessions.firebase.database();
    var merchantsData = sessionsData.ref().child('merchants').child('merchant-' + params.location);

    let otp = generateOTP(4);
    let sid = generateSessionId();
    let date = getDateTime();

    return new Promise((resolve,reject) => {
        let date = new Date();
        if(date.getHours()<=9 || date.getHours()>=17){
            //reject("Sessions can only be booked between 9 AM and 9 PM");
        }

        sessionsData.ref('sessions/session-' + sid)
        .set({
            "sid" : sid,
            "uid" : params.uid,
            "mid" : params.location,
            "phone" : params.phone,
            "duration" : params.duration,
            "device" : params.device,
            "otp" : otp,
            "addedOn" : date,
            "activated" : false,
            "expired" : false
        });

        merchantsData.child('sessions/session-' + sid)
        .set({
            "sid" : sid,
            "uid" : params.uid,
            "phone" : params.phone,
            "duration" : params.duration,
            "device" : params.device,
            "expired" : false
        });

            //  Send SMS to User via textlocal.in   //
            //
            // sms = `Thank you for booking an Amphere session. Your OTP is ${otp}.`;
            // smsURL = `apikey=${SMSConfig.textlocal.apikey}` +
            // `&numbers=91${params.phone}` +
            // `&sender=${SMSConfig.textlocal.sender}&` +
            // `&message=${encodeURIComponent(sms)}`;
            
            // const smsRequest = new XMLHttpRequest();
            // smsRequest.open('POST', `https://api.textlocal.in/send/?${smsURL}` ,true);
            // smsRequest.send();
            // smsRequest.onreadystatechange = e => {
            //     if (smsRequest.readyState===4 && smsRequest.status === 200) {
            //         let smsResponse = JSON.parse(smsRequest.response);
            //         console.log(smsResponse);
            //         console.log(`SMS sent to ${phone}. TextLocal balance is ${smsResponse.balance}.`);
            //         if(smsResponse.balance<=20){
            //             console.log("\n\tWARNING : LOW BALANCE\n")
            //         }
            //     }
            // }
            //  =================================   //
        

        resolve({
            "success": true,
            "sid" : sid,
            "startDate" : date,
        });
    });
}

//==============================================================================================//
//-------------------------------------- UTILITY FUNCTIONS -------------------------------------//
//==============================================================================================//

function getDateTime() {
    var date = new Date();

    var hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var year = date.getFullYear();
    var month = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();   

    return (`${hour}:${min}:${sec} ${day}/${month}/${year}`);
}

function generateSessionId() {
    let sid = "";
    let date = new Date();

    let min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    let sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    let mon = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    let day  = (date.getDate() < 10 ? "0" : "") + date.getDate();

    let dateOrder = [ mon, day, min, sec ];

        // GEN 8 RANDOM HEX
        for(let i=0 ; i<8 ; i++){
            sid = sid + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(let i=0 ; i<2 ; i++){
            sid = sid + dateOrder[Math.floor(Math.random()*2)].toString(); 
        }
        // GEN 8 RANDOM HEX
        for(let i=0 ; i<8 ; i++){
            sid = sid + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(let i=0 ; i<2 ; i++){
            sid = sid + dateOrder[Math.floor(Math.random()*2 + 2)].toString(); 
        }

    // if( DUPLICATE CHECK ){

    // } else {
        return sid;
    //}
}

function generateOTP(length) {
    var otp = "";
    for(var i=0 ; i<length ; i++){
        otp = otp + Math.floor(Math.random()*10).toString();
    }
    return otp;
}

function resolveName(name) {
    _name = name.split('+');
    var result = "";

    for(var i=0 ; i<_name.length ; i++){
        result = result + ((result==="") ? "" : " ") + _name[i];
    }

    result.trim();
    return result;
}