exports.ValidateLogin = function (credentials) {

    const saltRequest = new XMLHttpRequest();
    const loginRequest = new XMLHttpRequest();

    return new Promise((resolve,reject) => {
        saltRequest.open('POST', `/getMerchantSalt?code=${credentials.code}`, true);
        saltRequest.send();
        saltRequest.onreadystatechange = event => {
            if (saltRequest.readyState === 4 && saltRequest.status === 200) {
                let saltResponse = JSON.parse(saltRequest.response);
                let url = `mid=${saltResponse.mid}&password=${credentials.password}&salt=${saltResponse.salt}`;

                loginRequest.open('POST', `/merchantLoginWorker?${url}`, true);
                loginRequest.send();
                loginRequest.onreadystatechange = e => {
                    if (loginRequest.readyState === 4 && loginRequest.status === 200) {
                        let loginResponse = JSON.parse(loginRequest.response);
                        if(loginResponse.state==="SUCCESS"){
                            resolve({
                                "validated" : true,
                                "mid" : loginResponse.mid,
                                "phone" : loginResponse.phone,
                                "name" : loginResponse.name,
                                "sessions" : loginResponse.sessions
                            });
                        } else {
                            resolve({
                                "validated" : false
                            });
                        }
                    }
                }
            }
        };
    });
}