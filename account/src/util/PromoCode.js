const firebaseLogin = require('./Database');

exports.RemovePromoCode = (code,phone) =>{
    const CouponData = firebaseLogin.firebase.database();
    const UserData = firebaseLogin.firebase.database();

    if(code!==null){
        CouponData.ref().child('coupons').orderByChild('code').equalTo(code).limitToFirst(1).once('child_added',(coupon)=>{

            var user_type = coupon.child('user').val();
            if(user_type === 'unique')
            {
                var count = coupon.child('count').val();
                if(count>0)
                {
                    CouponData.ref('coupons/cid-' + coupon.child('cid').val()).update({
                        "count":count-1
                    }).then(()=>{
                        count = count - 1;
                        console.log("then body",count)
                        if(count === 0)
                        {
                            CouponData.ref('coupons/cid-' + coupon.child('cid').val()).update({
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
}
