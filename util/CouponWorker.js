//author @adil

//author @adil

const CouponsData = require('./Database').firebase.database();
const voucher_codes = require('voucher-code-generator');

exports.generateCoupons = function(params)
{
    var len = params.len;
    var count = params.count;
    var pattern = params.pattern;

    //pattern = pattern.replace(/1/g,'#');

    return new Promise((resolve,reject)=>{
        var coupons = voucher_codes.generate({
            length:len,
            count:count,
            prefix:"AMP-",
            pattern: '####-####',
            charset:"0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ"
        });

        if(coupons!==null) {
            //for(var i =0;i<count;i++)
            /**
             * @author Alisamar Husain
             * Deprecated traditional for loops
             * Use forEach instead
            */

            coupons.forEach(coupon => {
                CouponsData.ref('coupons/cid-' + coupon).set({
                    "addedOn": getDateTime(),
                    "code" : coupon,
                    "amount" : 20,
                    "expireDate" : null,
                    "isActive" : true,
                    "isDeleted": false
                });
            });
            resolve({
                "success": true,
                "coupons": coupons
            });
        }
        else {
            resolve({ "success":false });
        }

    });
}


exports.validateCoupon = function(params)
{
    let promoCode = params.code;

    return new Promise((resolve,reject)=>{

        CouponsData.ref().child('coupons').orderByChild('code').equalTo(promoCode).limitToFirst(1)
        .once('value').then((coupons)=>{
            if (coupons.val()!==null)
            {
                var coupon = coupons.val();
                var key;
                for(var field in coupon){
                    key = field;
                }
                var code = coupon[key]['code'];
                var amount = coupon[key]['amount'];

                resolve({
                    "success": true,
                    "promoCode":code,
                    "amount":amount
                });
            }
            else
            {
                resolve({
                    "success":false,
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
