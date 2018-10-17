exports.ValidatePhone = (user) => {
    return new Promise((resolve,reject)=>{
        if(user !== "")
        {
            const request = new XMLHttpRequest();
            const url = `user=${encodeURI(user)}&` +
                        `verify=false`;

            request.open('POST',`/validatePhone?${url}`,true);
            request.send();

            request.onreadystatechange = (event) => {
                if(request.readyState === 4 && request.status === 200)
                {
                    let response = JSON.parse(request.response);
                    console.log(response);
                    if(response.state === 'SUCCESS')
                    {
                        resolve({
                            "valid":true,
                            "username":response.username,
                            user
                        });
                    }
                    else
                    {
                        resolve({
                            'valid':false
                        });
                    }
                }
            }
        }
    });
}


exports.ValidateCoupon = function (user) {
    return new Promise((resolve,reject)=>{
        const request = new XMLHttpRequest();
        const url = `user=${encodeURI(user)}`;

        request.open('POST',`/validateCoupon?${url}`,true);
        request.send();

        request.onreadystatechange = (event) => {
            if(request.readyState === 4 && request.status === 200)
            {
                let response = JSON.parse(request.response);
                if(response.state === 'SUCCESS')
                {
                    if(response.CouponValid === true)
                    {
                        resolve({
                            "valid":true,
                            "promoValid":true,
                            "promoCode":response.Coupon,
                            "promoAmount":response.Amount,
                        });
                    }
                }
                else
                {
                    resolve({
                        'valid':false
                    });
                }
            }
        }
    });
}
