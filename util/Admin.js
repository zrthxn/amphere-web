/**
 * @author Alisamar Husain
 * 
 * Signup Merchant Service API
 * ----------------------------
 * Send Merchant parameters to
 * the server as HTTP request
 * and this function registers
 * the Merchant.
 * 
 * @param phone {}
 * @param name {}
 * @param password {}
 * @param mid {}
 * @param verification
 */

const Hasher = require('./PasswordHasher');
const firebaseMerch = require('./Database');

exports.AddMerchant = (params) => {
    var merchData = firebaseMerch.firebase.database();

    let salt = generateSalt(12);
    let hash = Hasher.generateHash(params.password, salt);

    return new Promise((resolve,reject) => {
        merchData.ref().child('merchants').orderByChild('mid').equalTo(params.mid).once('value', (searchres)=>{
            if(searchres.val()===null){
                merchData.ref('merchants/merchant-' + params.mid).set({
                    "mid" : params.mid,
                    "phone" : params.phone,
                    "name" : decodeURI(params.name),
                    "salt" : salt,
                    "password" : hash,
                    "addedOn" : getDateTime(),
                    "isDeleted" : false
                });
                resolve({ "success" : true });
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

function generateSalt(length) {
    var salt = "";
    for(var i=0 ; i<length ; i++){
        salt = salt + Math.floor(Math.random()*16).toString(16);
    }
    return salt;
}