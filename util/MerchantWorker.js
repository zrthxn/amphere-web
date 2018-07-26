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

const LocalMerchantsData = require('../merchants.json');

exports.GetMerchantSalt = function (params) {
    let requiredMerchant = getObjects(LocalMerchantsData.merchants, 'mid', params.code)[0];
    return new Promise((resolve, reject)=>{
        if(requiredMerchant.mid!==null){
                resolve({
                    "success": true,
                    "mid" : requiredMerchant.mid,
                    "salt" : requiredMerchant.salt
                });
        } else {
            resolve({
                "success": false
            });
        }
    });
    // return new Promise((resolve, reject)=>{
    //     let MerchantFirebaseSalt = MerchantFirebase.firebase.database();        
    //     MerchantFirebaseSalt.ref('merchants/merchant-' + params.code).child('mid').on('value', function(searchres) {
    //         let mid = searchres.val();
    //         if(mid!==null){
    //             MerchantFirebaseSalt.ref('merchants/merchant-' + mid).child('salt').on('value', function(salt){
    //                 resolve({
    //                     "success": true,
    //                     "mid" : mid,
    //                     "salt" : salt.val()
    //                 });
    //             });
    //         } else {
    //             resolve({
    //                 "success": false
    //             });
    //         }
    //     });
    // });
}

exports.MerchantLogin = function (params) {
    let requiredMerchant = getObjects(LocalMerchantsData.merchants, 'mid', params.mid)[0];
    var hash = Hasher.generateHash(params.password, requiredMerchant.salt);
    return new Promise((resolve, reject)=>{
        if(hash === requiredMerchant.password) {
            resolve({
                "success": true,
                "mid" : requiredMerchant.mid,
                "phone" : requiredMerchant.phone,
                "name" : requiredMerchant.name,
                "token" : hash 
            });
        } else {
            resolve({
                "success": false
            });
        }
    });
    // return new Promise((resolve, reject)=>{
    //     let MerchantFirebaseCreds = MerchantFirebase.firebase.database();
    //     var hash = Hasher.generateHash(credentials.password, credentials.salt);
    //     MerchantFirebaseCreds.ref('merchants/merchant-' + credentials.mid).child('password').on('value', function(pass){
    //         var password = pass.val();
    //         if( hash === password ) {
    //             MerchantFirebaseCreds.ref('merchants/merchant-' + credentials.mid).on('value', function(merchantDetails){
    //                 resolve({
    //                     "success": true,
    //                     "mid" : merchantDetails.val().mid,
    //                     "phone" : merchantDetails.val().phone,
    //                     "name" : merchantDetails.val().name,
    //                     "sessions" : merchantDetails.val().sessions
    //                 });
    //             })
    //         } else {
    //             resolve({
    //                 "success": false
    //             });
    //         }
    //     });
    // });
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else if (i === key && obj[i] === val || i === key && val === '') {
            objects.push(obj);
        } else if (obj[i] === val && key === ''){
            if (objects.lastIndexOf(obj) === -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}