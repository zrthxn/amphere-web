exports.ValidateByPhone = function (credentials) {

    const loginRequest = new XMLHttpRequest();
    
    return new Promise((resolve,reject)=>{
        loginRequest.open('POST', `/userLoginWorker?phone=${credentials.phone}&password=${credentials.password}`, true);
        loginRequest.send();
        loginRequest.onreadystatechange = e => {
            if (loginRequest.readyState === 4 && loginRequest.status === 200) {
                let loginResponse = JSON.parse(loginRequest.response);
                if(loginResponse.state==="SUCCESS"){
                    resolve({
                        "validated" : true,
                        "uid" : loginResponse.uid,
                        "phone" : loginResponse.phone,
                        "name" : loginResponse.name,
                        "token" : loginResponse.token
                    });
                } else {
                    resolve({
                        "validated" : false
                    });
                }
            }
        }
    });
}

exports.ValidateByToken = function (token) {

    const tokenRequest = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        tokenRequest.open('POST', `/userTokenLoginWorker?uid=${token.uid}&hash=${token.hash}`, true);
        tokenRequest.send();
        tokenRequest.onreadystatechange = event => {
            if (tokenRequest.readyState === 4 && tokenRequest.status === 200) {
                let tokenResponse = JSON.parse(tokenRequest.response);
                if(tokenResponse.state==="SUCCESS"){
                    resolve({
                        "validated" : true,
                        "uid" : tokenResponse.uid,
                        "phone" : tokenResponse.phone,
                        "name" : tokenResponse.name
                    });
                } else {
                    resolve({
                        "validated" : false
                    });
                }
            }
        };
    });
}