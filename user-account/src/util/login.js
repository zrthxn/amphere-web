exports.ValidateByPhone = function (credentials) {

    const saltRequest = new XMLHttpRequest();
    const loginRequest = new XMLHttpRequest();

    let urlGetSalt = `phone=${credentials.phone}`;

    return new Promise((resolve,reject) => {
        saltRequest.open('POST', `/getUserSalt?${urlGetSalt}`, true);
        saltRequest.send();
        saltRequest.onreadystatechange = event => {
            if (saltRequest.readyState === 4 && saltRequest.status === 200) {
                let saltResponse = JSON.parse(saltRequest.response);
                let url = `uid=${saltResponse.uid}&` + `password=${credentials.password}&` + `salt=${saltResponse.salt}`;

                loginRequest.open('POST', `/loginWorker?${url}`, true);
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

exports.ValidateByToken = function (token) {
    const request = new XMLHttpRequest();
    request.open('POST', `/tokenLoginWorker?token=${token}`, false);
    request.send();
    request.onreadystatechange = event => {
        if (request.readyState === 4 && request.status === 200) {
            let response = JSON.parse(request.response);
            console.log(response);
            console.log(JSON.stringify(response));
            console.log(JSON.stringify(JSON.stringify(response)));
            if(response.state==="SUCCESS"){
                return {
                    "validated" : true,
                    "uid" : response.uid,
                    "phone" : response.phone,
                    "name" : response.name,
                    "sessions" : response.sessions
                };
            } else {
                return {
                    "validated" : false
                };
            }
        }
    };
}