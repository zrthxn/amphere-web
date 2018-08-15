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
                console.log(response);
                resolve(response);
            } else if(request.readyState === 4 && request.status===500) {
                let err = request.responseText;
                alert(err);
            }
        };
    });    
}

exports.CancelSession = (params) => {

    var cancellationRequest = new XMLHttpRequest();

    return new Promise((resolve, reject)=>{
        cancellationRequest.open('POST', `/userCancelSession?sid=${params.sid}&exp=${encodeURI(params.exp)}`, true);
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

exports.CancelActiveSession = (params) => {

    var cancellationRequest = new XMLHttpRequest();

    return new Promise((resolve, reject)=>{
        cancellationRequest.open('POST', `/userCancelActiveSession?sid=${params.sid}`, true);
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