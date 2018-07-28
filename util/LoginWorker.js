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

var firebaseLoginCreds = firebaseLogin.firebase.database();

exports.Login = function (credentials) {
    return new Promise((resolve, reject)=>{       
        firebaseLoginCreds.ref().child('users').orderByChild('phone').equalTo(credentials.phone)
        .on('child_added', (user) => {
            if(user.val()!==null){
                var hash = Hasher.generateHash(credentials.password, user.val().salt);
                if(hash===user.val().password) {
                    resolve({
                        "success": true,
                        "uid" : user.val().uid,
                        "phone" : user.val().phone,
                        "name" : user.val().name,
                        "token" : user.val().uid + "/" + hash
                    });
                } else {
                    resolve({
                        "success": false
                    });
                }
            } else {
                reject("NO_USER");
            }
        });
    });
}

exports.TokenLogin = function (token) {
    return new Promise((resolve, reject)=>{
        firebaseLoginCreds.ref().child('users').orderByChild('uid').equalTo(token.uid)
        .on('child_added', (user) => {
            if(user.val().uid===token.uid && user.val().password===token.hash){
                resolve({
                    "success": true,
                    "uid" : user.val().uid,
                    "phone" : user.val().phone,
                    "name" : user.val().name
                });
            } else {
                resolve({
                    "success": false
                });
            }
        });
    });
}