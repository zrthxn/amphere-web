exports.ValidateByPhone = function (credentials) {

    const requestSalt = new XMLHttpRequest();
    const requestLogin = new XMLDocument();

    let urlGetSalt = `phone=${credentials.phone}`;

    return new Promise((resolve,reject) => {
        requestSalt.open('POST', `/getUserSalt?${urlGetSalt}`, false);
        requestSalt.send();
        requestSalt.onreadystatechange = event => {
            if (requestSalt.readyState === 4 && requestSalt.status === 200) {
                let responseSalt = requestSalt.response;
                let url  =  `uid=${responseSalt.uid}&` + `password=${credentials.password}&` + `salt=${responseSalt.salt}`;

                requestLogin.open('POST', `/loginWorker?${url}`, true);
                requestLogin.send();
                requestLogin.onreadystatechange = e => {
                    if (requestLogin.readyState === 4 && requestLogin.status === 200) {
                        let responseUID = requestLogin.response;
                        if(responseUID.state==="SUCCESS"){
                            resolve({
                                "validated" : true,
                                "uid" : responseUID.uid
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

exports.ValidateByToken = function (credentials) {

    const request = new XMLHttpRequest();

    return new Promise((resolve,reject) => {
        request.open('POST', `/tokenLoginWorker?token=${credentials.uid}`, true);
        request.send();

        request.onreadystatechange = event => {
            if (request.readyState === 4 && request.status === 200) {
                let response = request.response;
                if(response.state==="SUCCESS"){
                    resolve({
                        "validated" : true,
                        "salt" : response.salt
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