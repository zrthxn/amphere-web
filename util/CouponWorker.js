/********************
 --- Adil Faiz ---
********************/

const CouponsData = require('./Database').firebase.database();
const UserData = require('./Database').firebase.database();

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

            coupons.forEach(coupon => {
                let cid = generateCID();
                CouponsData.ref('coupons/cid-' + cid).set({
                    "addedOn": getDateTime(),
                    "code" : coupon,
                    "amount" : 20,
                    "expireDate" : null,
                    "isActive" : true,
                    "isDeleted": false,
                    "cid" : cid,
                    "count":1,
                    "user":"unique"
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

exports.generateSelfCoupon = function(params)
{
    let coupon = params.coupon;
    return new Promise((resolve,reject)=>{
        let cid = generateCID();
        CouponsData.ref().child('coupons').orderByChild('code').equalTo(coupon).limitToFirst(1).once('value',(couponres)=>{
            if(couponres.val() === null)
            {
                CouponsData.ref('coupons/cid-' + cid).set({
                    "addedOn": getDateTime(),
                    "code" : coupon,
                    "amount" : 20,
                    "expireDate" : null,
                    "isActive" : true,
                    "isDeleted": false,
                    "cid" : cid,
                    "count":3,
                    "user":"unique"
                });
                resolve({
                    'success':true
                });
            }
            else
            {
                resolve({
                    'success':false
                });
            }
        });

    });
}

exports.generateGenCoupon = function(params)
{
    let coupon = params.coupon;
    return new Promise((resolve,reject)=>{
        let cid = generateCID();
        CouponsData.ref().child('coupons').orderByChild('code').equalTo(coupon).limitToFirst(1).once('value',(couponres)=>{
            if(couponres.val() === null)
            {
                CouponsData.ref('coupons/cid-' + cid).set({
                    "addedOn": getDateTime(),
                    "code" : coupon,
                    "amount" : 20,
                    "expireDate" : null,
                    "isActive" : true,
                    "isDeleted": false,
                    "cid" : cid,
                    "user":"general"
                });
                UserData.ref().child('users').once('value',(users)=>{
                    let Users = users.val();
                    for (var key in Users) {
                        if (Users.hasOwnProperty(key)) {
                          var coupon_key = coupon;
                          if (key !== 'user-model')
                          {
                              UserData.ref('users/user-' + Users[key]['uid'] + '/coupons').update({
                                  [coupon_key] : 3
                              });
                          }
                        }
                      }
                });
                resolve({
                    'success':true
                });
            }
            else
            {
                resolve({
                    'success':false
                });
            }
        });
    });
}

exports.ValidateCoupon = function(params)
{
    let promoCode = params.code;
    let phone = params.userphone;
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
                var user_type = coupon[key]['user'];

                if(user_type === 'unique')
                {
                    resolve({
                        "success": true,
                        "promoCode":code,
                        "amount":amount
                    });
                }
                else if(user_type === 'general')
                {
                    UserData.ref().child('users').orderByChild('phone').equalTo(phone).limitToFirst(1).once('child_added',(userch)=>{
                        var coupon_count = userch.child('coupons/' + code).val();
                        if (coupon_count > 0 )
                        {
                            resolve({
                                "success": true,
                                "promoCode":code,
                                "amount":amount
                            });
                        }
                        else{
                            resolve({
                                "success":false,
                            });
                        }
                    });
                }
            }
            else
            {
                resolve({
                    "success":false,
                });
            }
        });
    }).catch((err)=>{
        console.log(err);
    });
}

exports.RemovePromoCode = (params) => {
    var code = params.code;
    var phone = params.phone;

    return new Promise((resolve,reject)=>{
        if(code!==null){
            CouponsData.ref().child('coupons').orderByChild('code').equalTo(code).limitToFirst(1).once('child_added',(coupon)=>{
                var user_type = coupon.child('user').val();
                if(user_type === 'unique')
                {
                    var count = coupon.child('count').val();
                    if(count>0)
                    {
                        CouponsData.ref('coupons/cid-' + coupon.child('cid').val()).update({
                            "count":count-1
                        }).then(()=>{
                            count = count - 1;
                            if(count === 0)
                            {
                                CouponsData.ref('coupons/cid-' + coupon.child('cid').val()).update({
                                    "coupon" : coupon.child('code').val(),
                                    "code" : null,
                                    "expireDate" : null,
                                    "isActive" : false,
                                    "isDeleted":true,
                                    "userphone":phone,
                                    "count":0
                                });
                            }
                        });
                        resolve({
                            "success":true
                        });
                    }
                }
                else if(user_type === 'general')
                {
                    UserData.ref().child('users').orderByChild('phone').equalTo(phone).limitToFirst(1).once('child_added',(userch)=>{
                        if(userch.val() !== null)
                        {
                            var coupon_count = userch.child('coupons/' + code).val();
                            var coupon_key =  code;
                            if(coupon_count>0)
                            {
                                UserData.ref('users/user-' + userch.child('uid').val() + '/coupons').update({
                                    [coupon_key]:userch.child('coupons/' + code).val() - 1
                                });
                            }
                        }
                    });
                    resolve({
                        "success":true
                    });
                }
            });
        }
        else
        {
            resolve({
                "success":true
            });
        }
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

function generateCID() {
    var userId = "";
    var date = new Date();

    var min  = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var sec  = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    var mon = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    var day  = (date.getDate() < 10 ? "0" : "") + date.getDate();

    var dateOrder = [ mon, day, min, sec ];

        // GEN 8 RANDOM HEX
        for(var i=0 ; i<8 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16);
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2)].toString();
        }
        // GEN 8 RANDOM HEX
        for(var i=0 ; i<8 ; i++){
            userId = userId + Math.floor(Math.random()*16).toString(16);
        }
        // GEN 2 DEFINED DATE
        for(var i=0 ; i<2 ; i++){
            userId = userId + dateOrder[Math.floor(Math.random()*2 + 2)].toString();
        }

    // if(){

    // } else {
        return userId;
    //}
}
