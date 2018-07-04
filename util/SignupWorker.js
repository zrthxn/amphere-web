const firebase = require('../node_modules/firebase');
const DatabaseConfig = require('../config.json');
const Hasher = require('./PasswordHasher');

firebase.initializeApp(DatabaseConfig.firebase);

exports.CreateNewUser = function (params) {

    var usersData = firebase.database();

    let phone = "+" + params.country_code + " " + params.phone;
    let salt = generateSalt(12);
    let _id = generateUserId();

    usersData.ref('users/user-' + _id)
    .set({
        "_id" : _id,
        "phone" : phone,
        "name" : resolveName(params.name),
        "salt" : salt,
        "password" : Hasher.generateHash(params.password, salt),
        "addedOn" : getDateTime(),
        "isDeleted" : false,
        "login" : true
    }, error => {
        if(error){
            // return new Promise((resolve,reject) => {
            //     reject(true);
            // });
        } else {
            return new Promise((resolve,reject) => {
                resolve(true);
            });
        }
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

function generateUserId() {
    var userId = "";
    var date = new Date();

    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var mon = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();

    var dateOrder = [ mon, day, min, sec ];

        // GEN 6 RANDOM HEX
        for(var i=0 ; i<6 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16); 
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2)].toString(); 
        }
        // GEN 6 RANDOM HEX
        for(var i=0 ; i<6 ; i++){
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