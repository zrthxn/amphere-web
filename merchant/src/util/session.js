exports.addNewSession = (params) => {
    return new Promise((resolve, reject)=>{
        const request = new XMLHttpRequest();

        let url = `uid=${params.uid}&` +
        `phone=${params.phone}&` +
        `name=${encodeURI(params.name)}&` +
        `location=${params.location}&` +
        `duration=${params.duration}&` +
        `device=${params.device}&` +
        `verify=true`
        
        request.open('POST', `/sessionsWorker?${url}`, true);
        request.send();

        request.onreadystatechange = event => {
            if (request.readyState === 4 && request.status === 200) {
                let response = JSON.parse(request.response);
                resolve(response);
            } else if(request.readyState === 4 && request.status===500) {
                let err = request.responseText;
                alert(err);
            }
        };
    });    
}

exports.ActivateSession = (params) => {

    var activationRequest = new XMLHttpRequest();

    return new Promise((resolve, reject)=>{
        activationRequest.open('POST', `/merchantActivateSession?sid=${params.sid}&otp=${params.otp}&table=${encodeURI(params.table)}`, true);
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

exports.ExpireSession = (sid) => {

    var expirationRequest = new XMLHttpRequest();

    return new Promise((resolve, reject)=>{
        expirationRequest.open('POST', `/merchantExpireSession?sid=${sid}`, true);
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

exports.CancelSession = (params) => {

    var cancellationRequest = new XMLHttpRequest();

    return new Promise((resolve, reject)=>{
        cancellationRequest.open('POST', `/merchantCancelSession?sid=${params.sid}&exp=${encodeURI(params.exp)}`, true);
        cancellationRequest.send();
        cancellationRequest.onreadystatechange = event => {
            if (cancellationRequest.readyState === 4 && cancellationRequest.status === 200) {
                let cancellationResponse = JSON.parse(cancellationRequest.response);
                if(cancellationResponse.state==="SUCCESS"){
                    resolve({
                        "cancelled" : true,
                        "time" : cancellationResponse.time
                    });
                } else {
                    resolve({
                        "cancelled" : false
                    });
                }
            }
        }
    });
}

exports.CompleteSession = (params) => {

    var completionRequest = new XMLHttpRequest();

    return new Promise((resolve, reject)=>{
        completionRequest.open('POST', `/merchantCompleteSession?sid=${params.sid}`, true);
        completionRequest.send();
        completionRequest.onreadystatechange = event => {
            if (completionRequest.readyState === 4 && completionRequest.status === 200) {
                let completionResponse = JSON.parse(completionRequest.response);
                if(completionResponse.state==="SUCCESS"){
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        }
    });
}
