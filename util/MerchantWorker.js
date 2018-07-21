/**
 * @author Alisamar Husain
 * 
 * Login Merchant Service API
 * ---------------------------
 * Send Merchant parameters to
 * the server as HTTP request
 * and this function registers
 * the Merchant.
 * 
 * @param mid {string}
 * @param password {string}
 * @param salt {string}
 */

const Hasher = require('./PasswordHasher');
const MerchantFirebase = require('./Database');

exports.GetMerchantSalt = function (code) {
    return new Promise((resolve, reject)=>{
        let MerchantFirebaseSalt = MerchantFirebase.firebase.database();        
        MerchantFirebaseSalt.ref().child('merchants').orderByChild('mid').equalTo(code).on('child_added', function(searchres) {
            let mid = searchres.key.split('-')[1].toString();
            if(mid!==null){
                MerchantFirebaseSalt.ref('merchants/merchant-' + mid).child('salt').on('value', function(salt){
                    resolve({
                        "success": true,
                        "mid" : mid,
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

exports.MerchantLogin = function (credentials) {
    return new Promise((resolve, reject)=>{
        let MerchantFirebaseCreds = MerchantFirebase.firebase.database();
        var hash = Hasher.generateHash(credentials.password, credentials.salt);
        MerchantFirebaseCreds.ref('merchants/merchant-' + credentials.mid).child('password').on('value', function(pass){
            var password = pass.val();
            if( hash === password ) {
                MerchantFirebaseCreds.ref('merchants/merchant-' + credentials.mid).on('value', function(merchantDetails){
                    resolve({
                        "success": true,
                        "mid" : merchantDetails.val().mid,
                        "phone" : merchantDetails.val().phone,
                        "name" : merchantDetails.val().name,
                        "sessions" : merchantDetails.val().sessions
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

exports.ActivateSession = function (session) {
    return new Promise((resolve, reject)=> {
        var otpFirebase = MerchantFirebase.firebase.database();
        var time;
        otpFirebase.ref().orderByKey().equalTo('time').on('child_added', t => {
            time = t.val();
            otpFirebase.ref('sessions/session-' + session.sid).orderByKey().equalTo('otp').on('child_added', function(_otp){
                var otp = _otp.val();
                if(session.otp === otp){
                    otpFirebase.ref('sessions/session-' + session.sid).update({
                        "activated" : true
                    });
                    resolve({
                        "success":true,
                        "time" : time
                    });
                } else {
                    resolve(false);
                }
            });
        });
    });
}

exports.ExpireSession = function (sid) {
    var expireFirebase = MerchantFirebase.firebase.database();
    var time, mid;

    return new Promise((resolve, reject)=> {
        expireFirebase.ref('sessions/session-' + sid).orderByKey().equalTo('mid').on('child_added', m => {
            mid = m.val();
            expireFirebase.ref().orderByKey().equalTo('time').on('child_added', t => {
                time = t.val();
                expireFirebase.ref('sessions/session-' + sid).update({
                    "expired" : true
                });
                expireFirebase.ref('merchants/merchant-' + mid + '/sessions/session-' + sid).update({
                    "expired" : true
                });
                resolve({
                    "success":true,
                    "time" : time
                });
            });
        });
    });
}