const MerchantFirebase = require('./Database');
var MerchantFirebaseCreds = MerchantFirebase.firebase.database();    

exports.ValidateLogin = function (credentials) {
    const loginRequest = new XMLHttpRequest();
    return new Promise((resolve,reject) => {
        loginRequest.open('POST', `/merchantLoginWorker?mid=${credentials.code}&password=${credentials.password}`, true);
        try{
            loginRequest.send();
        } catch(err){
            reject(err);
        }
        loginRequest.onreadystatechange = e => {
            if (loginRequest.readyState === 4 && loginRequest.status === 200) {
                let loginResponse = JSON.parse(loginRequest.response);
                if(loginResponse.state==="SUCCESS"){
                    resolve({
                        validated : true,
                        mid : loginResponse.mid,
                        phone : loginResponse.phone,
                        name : loginResponse.name,
                        token : loginResponse.token
                    });
                } else {
                    resolve({ validated: false, status: loginResponse.state });
                }
            } else if(loginRequest.status!==200) {
                reject();
            }
        }
    });
}

exports.ValidateToken = (token) => {
    return new Promise((resolve, reject)=>{      
        MerchantFirebaseCreds.ref().child('merchants').orderByChild('mid').equalTo(token.mid)
        .on('child_added', (merchant)=>{
            if(merchant.val()!==null){
                if(token.mid===merchant.val().mid && token.hash===merchant.val().password){
                    resolve({
                        "validated": true,
                        "mid" : merchant.val().mid,
                        "phone" : merchant.val().phone,
                        "name" : merchant.val().name
                    });
                } else {
                    resolve({
                        "validated": false
                    });
                }
            } else {
                reject("NO-MERCH");
            }
        });
    });
}