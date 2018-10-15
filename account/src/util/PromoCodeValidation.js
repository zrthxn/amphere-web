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
