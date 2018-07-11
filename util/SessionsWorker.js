const firebaseSessions = require('./Database');

exports.BookNewSession = function (params) {

    var sessionsData = firebaseSessions.firebase.database();

    let otp = generateOTP(6);
    let sid = generateSessionId();
    let date = getDateTime();

    return new Promise((resolve,reject) => {
        sessionsData.ref('sessions/session-' + sid)
        .set({
            "sid" : sid,
            "phone" : params.phone,
            "uid" : params.uid,
            "location" : params.location,
            "duration" : params.duration,
            "device" : params.device,
            "otp" : otp,
            "addedOn" : date,
            "isDeleted" : false
        }).then( error => {
            // if(error){
            //     reject(error);
            // } else {
            //     resolve({
            //         "success" : true,
            //         "sid" : sid,
            //         "startDate" : date,
            //     });
            // }
            resolve({
                "state" : "SUCCESS",
                "sid" : sid,
                "startDate" : date,
            });
        });
    });    
}

function getDateTime() {
    var date = new Date();

    var hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var year = date.getFullYear();
    var month = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();   

    return ( `${hour}:${min}:${sec} ${day}/${month}/${year}`);
}

//=========================================================

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

//=========================================================

function resolveName(name) {
    _name = name.split('+');
    var result = "";

    for(var i=0 ; i<_name.length ; i++){
        result = result + ((result==="") ? "" : " ") + _name[i];
    }

    result.trim();
    return result;
}

function resolveCountryCode() {

}