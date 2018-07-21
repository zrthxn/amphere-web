exports.ActivateSession = (params) => {

    var activationRequest = new XMLHttpRequest();

    return new Promise((resolve, reject)=>{
        activationRequest.open('POST', `/merchantActivateSession?sid=${params.sid}&otp=${params.otp}`, true);
        activationRequest.send();
        activationRequest.onreadystatechange = event => {
            if (activationRequest.readyState === 4 && activationRequest.status === 200) {
                let activationResponse = JSON.parse(activationRequest.response);
                if(activationResponse.state==="SUCCESS"){
                    resolve({
                        "activated" : true,
                        "time" : activationResponse.time
                    });
                } else {
                    resolve({
                        "activated" : false
                    });
                }
            }
        }
    });
}

exports.ExpireSession = (params) => {

    var expirationRequest = new XMLHttpRequest();

    return new Promise((resolve, reject)=>{
        expirationRequest.open('POST', `/merchantExpireSession?sid=${params.sid}`, true);
        expirationRequest.send();
        expirationRequest.onreadystatechange = event => {
            if (expirationRequest.readyState === 4 && expirationRequest.status === 200) {
                let expirationResponse = JSON.parse(expirationRequest.response);
                if(expirationResponse.state==="SUCCESS"){
                    resolve({
                        "expired" : true,
                        "time" : expirationResponse.time
                    });
                } else {
                    resolve({
                        "expired" : false
                    });
                }
            }
        }
    });
}
