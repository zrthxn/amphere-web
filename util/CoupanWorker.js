/**
 * @author Alisamar Husain
 * 
 *  == DEPRECATED WORKER ==
 *  Scheduled for deletion
 * ========================
 */

// DO NOT USE THIS FILE

const firebase = require('./Database');
const voucher_codes = require('voucher-code-generator');  //install voucher-code-generator

exports.generateCoupans = function(params)
{
    var len = params.len;
    var count = params.count;
    var pattern = params.pattern;

    //pattern = pattern.replace(/1/g,'#');

    const cpn_db = firebase.firebase.database();
    var coupans;

    return new Promise((resolve,reject)=>{
        coupans = voucher_codes.generate({
            length:len,
            count:count,
            prefix:"AMP-",
            pattern: '####-####',
            charset:"0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ"
        });
        for(var i =0;i<count;i++)
        {
            cpn_db.ref('coupans/cid-'+coupans[i]).set({
                "addedOn": getDateTime(),
                "code" : coupans[i],
                "amount" : 20,
                "expireDate" : null,
                "isActive" : true,
                "isDeleted":false
            });
        }
        resolve({
            "success":true,
            "coupans":coupans
        });
    });
}


exports.validateCoupan = function(params)
{
    let promoCode = params.code;
    const cpn_db = firebase.firebase.database();

    return new Promise((resolve,reject)=>{

        cpn_db.ref().child('coupans').orderByChild('code').equalTo(promoCode).limitToFirst(1).once('value').then((coupans)=>{
            if (coupans.val()!==null)
            {
                var coupan = coupans.val();
                var key;
                for(var field in coupan){
                    key = field;
                }
                var code = coupan[key]['code'];
                var amount = coupan[key]['amount'];

                resolve({
                    "status":true,
                    "promoCode":code,
                    "amount":amount
                });
            }
            else
            {
                resolve({
                    "status":false,
                })
            }
        });
    });
}

//====================================================================================//

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
