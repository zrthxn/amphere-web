const firebaseSessions = require('./Database');
const SMSWorker = require('./SMSWorker');

var SessionsData = firebaseSessions.firebase.database();

exports.BookSession = function (params) {
    let otp = generateOTP(4);
    let sid = generateSessionId();
    let date = getDateTime();

    return new Promise((resolve,reject) => {
        SessionsData.ref().child('time').on('value', (time)=>{
            if(time.val()>=(1440-60)){
                reject("TIME-RESET");
            } else {
                SessionsData.ref('sessions/session-' + sid).set({
                    "sid" : sid,
                    "uid" : params.uid,
                    "mid" : params.location,
                    "phone" : params.phone,
                    "name" : params.name,
                    "duration" : params.duration,
                    "startTime" : null,
                    "device" : params.device,
                    "otp" : otp,
                    "addedOn" : date,
                    "activated" : false,
                    "expired" : false,
                    "isDeleted" : false,
                    "status" : "BOOKED"
                });
                
                // SMSWorker.SendSMSSessionOTP(otp, params.phone).then(()=>{
                //     resolve({
                //         "success": true,
                //         "sid" : sid,
                //         "startDate" : date,
                //     });
                // });
            }
        });
    });
}

exports.BookDeadSession = function (params) {
    let sid = generateSessionId();
    let date = getDateTime();

    return new Promise((resolve,reject) => {
        SessionsData.ref().child('time').on('value', (time)=>{
            if(time.val()>=(1440-60)){
                reject("TIME-RESET");
            } else {
                SessionsData.ref('sessions/session-' + sid).set({
                    "sid" : sid,
                    "uid" : params.uid,
                    "mid" : params.location,
                    "phone" : params.phone,
                    "name" : params.name,
                    "duration" : params.duration,
                    "startTime" : null,
                    "device" : params.device,
                    "otp" : "AMPDEAD",
                    "dead" : true,
                    "addedOn" : date,
                    "activated" : false,
                    "expired" : false,
                    "isDeleted" : false,
                    "status" : "BOOKED"
                });
                resolve({
                    "success": true,
                    "sid" : sid,
                    "startDate" : date,
                });
            }
        });
    });
}

exports.ActivateSession = function (session) {
    return new Promise((resolve, reject)=> {
        SessionsData.ref().orderByKey().equalTo('time').once('value', (time)=>{
            SessionsData.ref('sessions/session-' + session.sid).orderByKey().equalTo('otp')
            .on('child_added', function(_otp){
                var otp = _otp.val();
                if(session.otp === otp){
                    SessionsData.ref('sessions/session-' + session.sid).update({
                        "activated" : true,
                        "startTime" : time.val().time,
                        "status" : `ACTIVATED : ${getDateTime()}`
                    });
                    resolve({
                        "success" : true,
                        "time" : time.val().time
                    });
                } else {
                    resolve(false);
                }
            });
        });
    });
}

exports.ExpireSession = function (sid) {
    return new Promise((resolve, reject)=> {
        SessionsData.ref('sessions/session-' + sid).update({
            "expired" : true,
            "activated" : false,
            "status" : `EXPIRED : ${getDateTime()}`
        });
        resolve({
            "success":true
        });
    });
}

exports.CancelSession = function (sid, exp) {

    // ADD TO SPREADSHEET HERE

    return new Promise((resolve, reject)=> {
        SessionsData.ref('sessions/session-' + sid).update({
            "activated" : false,
            "expired" : true,
            "isDeleted" : true,
            "status" : `CANCELLED : ${getDateTime()} : ${decodeURI(exp)}`
        });
        resolve({
            "success":true
        });
    });
}

exports.CompleteSession = function (sid) {

    // ADD TO SPREADSHEET HERE

    return new Promise((resolve, reject)=> {
        SessionsData.ref('sessions/session-' + sid).update({
            "activated" : false,
            "isDeleted" : true,
            "status" : `COMPLETED : ${getDateTime()}`
        });
        resolve({
            "success":true
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