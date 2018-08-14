const TokenFirebase = require('./Database').firebase.database();

exports.ValidateByPhone = function (credentials) {
    const loginRequest = new XMLHttpRequest();
    return new Promise((resolve,reject)=>{
        loginRequest.open('POST', `/userLoginWorker?phone=${credentials.phone}&password=${credentials.password}`, true);
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
                        validated: true,
                        uid: loginResponse.uid,
                        phone: loginResponse.phone,
                        name: loginResponse.name,
                        token: loginResponse.token
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

exports.ValidateToken = function (token) {
    return new Promise((resolve,reject)=>{
        TokenFirebase.ref().child('users').orderByChild('uid').equalTo(token.uid)
        .on('child_added', (user)=>{
            if(user.val()!==null){
                if(token.uid===user.val().uid && token.hash===user.val().password){
                    resolve({
                        "validated": true,
                        "uid" : user.val().uid,
                        "phone" : user.val().phone,
                        "name" : user.val().name
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