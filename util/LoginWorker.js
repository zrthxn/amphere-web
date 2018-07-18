/**
 * @author Alisamar Husain
 * 
 * Login User Service API
 * -----------------------
 * Send user parameters to
 * the server as HTTP request
 * and this function registers
 * the user.
 * 
 * @param phone {string}
 * 
 * @param uid {string}
 * @param password {string}
 * @param salt {string}
 */

const Hasher = require('./PasswordHasher');
const firebaseLogin = require('./Database');

exports.GetUserSalt = function (_phone) {
    let phone = "00910" + _phone;
    return new Promise((resolve, reject)=>{
        let firebaseLoginSalt = firebaseLogin.firebase.database();        
        firebaseLoginSalt.ref().child('users').orderByChild('phone').equalTo(_phone).on('child_added', function(searchres) {
            let uid = searchres.key.split('-')[1].toString();
            if(uid!==null){
                firebaseLoginSalt.ref('users/user-' + uid).child('salt').on('value', function(salt){
                    resolve({
                        "success": true,
                        "uid" : uid,
                        "salt" : salt.val()
                    });
                });
            } else {
                resolve({
                    "success": false
                });
            }
        });
    });
}

exports.Login = function (credentials) {
    return new Promise((resolve, reject)=>{
        let firebaseLoginCreds = firebaseLogin.firebase.database();
        var hash = Hasher.generateHash(credentials.password, credentials.salt);
        firebaseLoginCreds.ref('users/user-' + credentials.uid).child('password').on('value', function(pass){
            var password = pass.val();
            if( hash === password ) {
                firebaseLoginCreds.ref('users/user-' + credentials.uid).on('value', function(userDetails){
                    resolve({
                        "success": true,
                        "uid" : userDetails.val().uid,
                        "phone" : userDetails.val().phone,
                        "name" : userDetails.val().name,
                        "sessions" : userDetails.val().sessions
                    });
                })
            } else {
                resolve({
                    "success": false
                });
            }
        });
    });
}

exports.TokenLogin = function (token) {
    return new Promise((resolve, reject)=>{
        let firebaseTokenLogin = firebaseLogin.firebase.database();
        firebaseTokenLogin.ref('users/user-' + token).on('value', function(userDetails){
            if(userDetails.val()!==null){
                resolve({
                    "success": true,
                    "uid" : userDetails.val().uid,
                    "phone" : userDetails.val().phone,
                    "name" : userDetails.val().name,
                    "sessions" : userDetails.val().sessions
                });
            } else {
                resolve({
                    "success": false
                });
            }
        });
    });
}