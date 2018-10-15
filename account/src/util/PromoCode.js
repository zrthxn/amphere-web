//const firebaseLogin = require('./Database');

exports.ValidatePromoCode = (code,user) => {

    return new Promise((resolve,reject)=>{
        if (code!=="")
        {
            const promoReq = new XMLHttpRequest();
            const url = `code=${encodeURI(code)}&` +
                        `user=${encodeURI(user)}`
            promoReq.open('POST',`/validatePromo?${url}`,true);
            promoReq.send();

            promoReq.onreadystatechange = (event) =>{
            if(promoReq.readyState===4 && promoReq.status === 200)
            {
                let promo = JSON.parse(promoReq.response);
                    if(promo.state==="SUCCESS")
                    {
                        resolve({
                            "valid":promo.valid,
                            "promoCode":promo.promoCode,
                            "amount" : promo.amount
                        });
                    }
                    else
                    {
                        resolve({
                            "valid" : promo.valid
                        });
                    }
                }
            }
        }

    });
    /*
    if(code === "AMP"){
        return true;
    } else if(code==="") {
        return null;
    } else {
        return false;
    }
    */
}

/*
THIS FILE WILL USE THE      fetch()     METHOD POST A REQUEST TO GET DATA FROM THE EXPRESS JS ROUTER
ON THE BACKEND WHICH WILL HAVE ROUTES FOR THE URL THAT THIS METHOD POSTS TO. THOSE ROUTES WILL HAVE
FUNCTIONS THAT GET DATA FROM THE        FIREBASE        DB AND RESPOND WITH DATA + 200OK.

*/

exports.RemovePromoCode = (code,user) => {

    return new Promise((resolve,reject)=>{
        if (code!=="")
        {
            const request = new XMLHttpRequest();
            const url = `code=${encodeURI(code)}&` +
                        `user=${encodeURI(user)}`
            request.open('POST',`/removePromo?${url}`,true);
            request.send();

            request.onreadystatechange = (event) =>{
            if(request.readyState===4 && request.status === 200)
            {
                let promo = JSON.parse(request.response);
                    if(promo.state==="SUCCESS")
                    {
                        resolve({
                            "success":true
                        });
                    }
                    else
                    {
                        resolve({
                            "success" : false
                        });
                    }
                }
            }
        }

    });

    /*const CouponsData = firebaseLogin.firebase.database();
    const UserData = firebaseLogin.firebase.database();

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
                        console.log("then body",count)
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
            }
        });
    }
    */
}
