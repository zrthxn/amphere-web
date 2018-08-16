/**
 * @author Alisamar Husain
 * 
 * Signup User Service API
 * -----------------------
 * Send user parameters to
 * the server as HTTP request
 * and this function registers
 * the user.
 * 
 * @param phone {}
 * @param name {}
 * @param password {}
 * @param verification
 */

const Hasher = require('./PasswordHasher');
const firebaseSignup = require('./Database');
const SpreadsheetWorker = require('./SpreadsheetWorker');
const ssConfig = require('../config.json');

exports.CreateNewUser = function (params) {

    var usersData = firebaseSignup.firebase.database();

    let salt = generateSalt(12);
    let uid = generateUserId();
    let hash = Hasher.generateHash(params.password, salt);

    return new Promise((resolve,reject) => {
        usersData.ref().child('users').orderByChild('phone').equalTo(params.phone).once('value', (searchres)=>{
            if(searchres.val()===null){
                usersData.ref('users/user-' + uid).set({
                    "uid" : uid,
                    "phone" : params.phone,
                    "name" : decodeURI(params.name),
                    "salt" : salt,
                    "password" : hash,
                    "addedOn" : getDateTime(),
                    "isDeleted" : false,
                    "login" : true
                }).then(()=>{
                    SpreadsheetWorker.WriteToSpreadsheet({
                        "ssId" : ssConfig.spreadsheets.records,
                        "sheet" : "Users",
                        "values" : [
                            `${getDateTime()}`,
                            `${uid}`,
                            `${decodeURI(params.name)}`,
                            `${params.phone}`
                        ]
                    });
                    resolve({
                        "success" : true,
                        "uid" : uid,
                        "hash" : hash
                    });
                });
            } else {
                resolve({
                    "success" : false,
                    "error" : "PHONE-EXISTS"
                });
            }
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

    return ( `${hour}:${min}:${sec} ${day}/${month}/${year}`);
}

function generateUserId() {
    var userId = "";
    var date = new Date();

    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var mon = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();

    var dateOrder = [ mon, day, min, sec ];

        // GEN 8 RANDOM HEX
        for(var i=0 ; i<8 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2)].toString(); 
        }
        // GEN 8 RANDOM HEX
        for(var i=0 ; i<8 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2 + 2)].toString(); 
        }

    // if(){

    // } else {
        return userId;
    //}
}

function generateSalt(length) {
    var salt = "";
    for(var i=0 ; i<length ; i++){
        salt = salt + Math.floor(Math.random()*16).toString(16);
    }
    return salt;
}