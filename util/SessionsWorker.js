const firebaseSessions = require('./Database');
const SMSWorker = require('./SMSWorker');
const SpreadsheetWorker = require('./SpreadsheetWorker');
const ssConfig = require('../config.json');
const SMSConfig = require('../config.json').smsService;

var SessionsData = firebaseSessions.firebase.database();

exports.BookSession = function (params) {
    let otp = generateOTP(4);
    let sid = generateSessionId();
    let date = getDateTime();

    return new Promise((resolve,reject) => {
        SessionsData.ref().child('time').once('value', (time)=>{
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
                    "status" : `BOOKED : ${getDateTime()}`,
                    "table" : null,
                    "amount" : 10
                });
                
                SMSWorker.SendSMSSessionOTP(otp, params.phone, SMSConfig.senders.otp).then(()=>{
                    resolve({
                        "success": true,
                        "sid" : sid,
                        "startDate" : date,
                    });
                });
            }
        });
    });
}

exports.BookDeadSession = function (params) {
    let sid = generateSessionId();
    let date = getDateTime();

    return new Promise((resolve,reject) => {
        SessionsData.ref().child('time').once('value', (time)=>{
            if(time.val()>=(1440-65)){
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
                    "status" : "BOOKED",
                    "table" : null
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
            if(time.val()>=(1440-65)){
                reject("TIME-RESET");
            } else {
                SessionsData.ref('sessions/session-' + session.sid).orderByKey().equalTo('otp')
                .on('child_added', function(_otp){
                    var otp = _otp.val();
                    if(session.otp === otp){
                        SessionsData.ref('sessions/session-' + session.sid).update({
                            "activated" : true,
                            "startTime" : time.val().time,
                            "status" : `ACTIVATED : ${getDateTime()}`,
                            "table" : decodeURI(session.table)
                        });
                        resolve({
                            "success" : true,
                            "time" : time.val().time
                        });
                    } else {
                        resolve(false);
                    }
                });
            }
        });
    });
}

exports.ExpireSession = function (sid) {
    return new Promise((resolve, reject)=> {
        SessionsData.ref('sessions/session-' + sid).update({
            "expired" : true,
            "status" : `EXPIRED : ${getDateTime()}`
        });
        resolve({
            "success":true
        });
    });
}

exports.CancelSession = function (sid, exp) {
    return new Promise((resolve, reject)=> {
        SessionsData.ref('sessions/session-' + sid).update({
            "activated" : false,
            "expired" : true,
            "isDeleted" : true,
            "status" : `CANCELLED : ${getDateTime()} : ${decodeURI(exp)}`
        });
        SessionsData.ref().child('sessions').orderByChild('sid').equalTo(sid).once('child_added', (snapshot)=>{
            SpreadsheetWorker.WriteToSpreadsheet({
                "ssId" : ssConfig.spreadsheets.records,
                "sheet" : "Sessions",
                "values" : [
                    `${getDateTime()}`,
                    `${snapshot.val().uid}`,
                    `CANCELLED`,
                    `${snapshot.val().mid}`,
                    `${snapshot.val().name}`,
                    `${snapshot.val().phone}`,
                    `${snapshot.val().addedOn}`,
                    `${snapshot.val().duration}`,
                    `${snapshot.val().device}`,
                    `${snapshot.val().otp}`,
                    `${decodeURI(exp)}`,
                    `TTC :: N/A`
                ]
            });
        });
        resolve({
            "success":true
        });
    });
}

exports.CompleteSession = function (sid) {
    return new Promise((resolve, reject)=> {
        SessionsData.ref('sessions/session-' + sid).update({
            "activated" : false,
            "isDeleted" : true,
            "status" : `COMPLETED : ${getDateTime()}`
        });
        SessionsData.ref().child('sessions').orderByChild('sid').equalTo(sid).once('child_added', (snapshot)=>{
            let time = [], ttc = [];
            let date = new Date();

            for(let i=0; i<2; i++) time.push(parseInt(((snapshot.val().status.split(' : ')[1]).split(' ')[0]).split(':')[i], 10));

            ttc.push(date.getHours()>time[0] ? (date.getHours() - time[0]) : (time[0] - date.getHours()) );
            ttc.push(date.getMinutes()>time[1] ? (date.getMinutes() - time[1]) : (time[1] - date.getMinutes()) );

            SpreadsheetWorker.WriteToSpreadsheet({
                "ssId" : ssConfig.spreadsheets.records,
                "sheet" : "Sessions",
                "values" : [
                    `${getDateTime()}`,
                    `${snapshot.val().uid}`,
                    `COMPLETED`,
                    `${snapshot.val().mid}`,
                    `${snapshot.val().name}`,
                    `${snapshot.val().phone}`,
                    `${snapshot.val().addedOn}`,
                    `${snapshot.val().duration}`,
                    `${snapshot.val().device}`,
                    `${snapshot.val().otp}`,
                    `PAID`,
                    `TTC :: ${ttc[0]} Hours, ${ttc[1]} Minutes`
                ]
            });
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

        // GEN 6 RANDOM HEX
        for(let i=0 ; i<6 ; i++){
            sid = sid + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(let i=0 ; i<2 ; i++){
            sid = sid + dateOrder[Math.floor(Math.random()*2)].toString(); 
        }
        // GEN 6 RANDOM HEX
        for(let i=0 ; i<6 ; i++){
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