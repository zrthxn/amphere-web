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
        var salt = "";
        let firebaseLoginSalt = firebaseLogin.firebase.database();
        //GET SALT
        //REFINE SEARCH BY PHONE
        resolve({
            "success": true,
            "salt" : salt
        });
    });
}

exports.Login = function (credentials) {
    return new Promise((resolve, reject)=>{
        let firebaseLoginCreds = firebaseLogin.firebase.database();
        var hash = Hasher.generateHash(credentials.password, credentials.salt);
        var password = firebaseLoginCreds.ref('users/user-' + credentials.uid).child('password');
        
        if( hash === password ) {
            resolve({
                "success": true,
                "uid" : credentials.uid
            });
        } else {
            resolve({
                "success": false
            });
        }
    });
}