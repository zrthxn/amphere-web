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
const MerchantFirebaseCreds = require('./Database').firebase.database();

exports.MerchantLogin = function (params) {
    return new Promise((resolve, reject)=>{
        MerchantFirebaseCreds.ref().child('merchants').orderByChild('mid').equalTo(credentials.mid)
        .on('child_added', (merchantDetails)=>{
            if(merchantDetails.val()!==null){
                var hash = Hasher.generateHash(credentials.password, merchantDetails.val().salt);
                if(hash===merchantDetails.val().password){
                    resolve({
                        "validated": true,
                        "mid" : merchantDetails.val().mid,
                        "phone" : merchantDetails.val().phone,
                        "name" : merchantDetails.val().name,
                        "token" : merchantDetails.val().mid + "/" + hash
                    });
                } else {
                    resolve({"validated": false});
                }
            } else {
                resolve({"validated": false});
            }
        });
    });
}