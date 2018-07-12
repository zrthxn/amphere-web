const MerchantFirebase = require('./Database');

exports.ValidateSession = function (session) {
    return new Promise((resolve, reject)=> {
        var otp = MerchantFirebase.firebase.database().ref('sessions/session-' + session.sid).child('otp');
        if(session.otp === otp){
            resolve(true);
        } else {
            resolve(false);
        }
    });
}