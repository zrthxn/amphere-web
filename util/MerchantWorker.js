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
const SpreadsheetWorker = require('./SpreadsheetWorker');
const ssConfig = require('../config.json');

exports.MerchantLogin = function (params) {
    return new Promise((resolve, reject)=>{

        MerchantFirebaseCreds.ref().child('merchants').orderByChild('mid').equalTo(params.mid).limitToFirst(1)
        .once('value', (merch)=>{
            if(merch.val()===null) {
                reject("NO-MERCH");
            }
        });

        MerchantFirebaseCreds.ref().child('merchants').orderByChild('mid').equalTo(params.mid).limitToFirst(1)
        .once('child_added', (merchantDetails)=>{
            if(merchantDetails.val()!==null){
                var hash = Hasher.generateHash(params.password, merchantDetails.val().salt);
                if(hash===merchantDetails.val().password){
                    resolve({
                        success: true,
                        mid : merchantDetails.val().mid,
                        phone : merchantDetails.val().phone,
                        name : merchantDetails.val().name,
                        token : merchantDetails.val().mid + "/" + hash
                    });
                } else {
                    resolve({success: false});
                }
            }
        });
    });
}

exports.MerchantOnboard = function (params) {
    return new Promise((resolve, reject)=>{
        SpreadsheetWorker.WriteToSpreadsheet({
            "ssId" : ssConfig.spreadsheets.onboarding,
            "sheet" : "Merchants",
            "values" : [
                `${getDateTime()}`,
                `${decodeURI(params.rname)}`,
                `${decodeURI(params.name)}`,
                `${decodeURI(params.phone)}`,
                `${decodeURI(params.email)}`,
                `${decodeURI(params.address)}`,
                `${decodeURI(params.comments)}`
            ]
        });
        resolve(true);
    });
}

//------------------------------------------------------------------------------------------------------------//
//@adil//
exports.ValidatePhone = function (params) {
    let user = params.user;
    return new Promise((resolve,reject)=>{
        UserData.ref().child('users').orderByChild('phone').equalTo(user).limitToFirst(1).once('value').then((userch)=>{
            if(userch.val() !== null){
                var user = userch.val();
                var key;
                for(var field in user){
                    key = field;
                }
                var username = user[key]['name'];
                resolve({
                    "success":true,
                    "username":username,
                    "CouponValid":false
                });
            }
            else
            {
                resolve({
                    "success":false
                });
            }
        });
    });
}

exports.ValidateCoupon = function(params) {
    let user = params.user;
    return new Promise((resolve,reject)=>{
        UserData.ref().child('users').orderByChild('phone').equalTo(user).limitToFirst(1).once('value').then((userch)=>{
            if(userch.val() !== null){
                var user = userch.val();
                var key;
                for(var field in user){
                    key = field;
                }
                var uid = user[key]['uid'];
                var DeadSessionCoupon;
                UserData.ref().child('users/user-' + uid + '/coupons').once('value',(coupons)=>{
                    var Coupons = coupons.val();
                    for(var coupon in Coupons){
                       var count = Coupons[coupon];

                       if (count > 0)
                       {
                        DeadSessionCoupon = coupon;
                        UserData.ref('users/user-' +uid+ '/coupons/').update({
                            [coupon] : coupons.child(coupon).val() - 1
                        });
                        resolve({
                            "success":true,
                            "CouponValid":true,
                            "Coupon":DeadSessionCoupon,
                            "Amount":20
                        });
                        break
                       }
                    }
                    resolve({
                        "success":false
                    });
                });
            }
            else
            {
                resolve({
                    "success":false
                });
            }
        });
    });
}
//-------------------------------------------------------------------------------------------------------------//
//=============================================================================================================//

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
