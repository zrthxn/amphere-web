exports.addNewSession = (params) => {
    return new Promise((resolve, reject)=>{
        const request = new XMLHttpRequest();
        let url = generateSessionQueryURL({
            "phone" : params.phone,
            "uid" : params.uid,
            "location" : params.location,
            "duration" : params.duration,
            "device" : params.device
        });
        
        request.open('POST', `/sessionsWorker?${url}`, true);
        request.send();

        request.onreadystatechange = event => {
            if (request.readyState === 4  && request.status === 200) {
                let response = JSON.parse(request.response);
                console.log(response);
                resolve(response);
            }
        };
    });    
}

function generateSessionQueryURL(query) {
    return (
        `phone=${query.phone}&` +
        `uid=${query.uid}&` +
        `location=${query.location}&` +
        `duration=${query.duration}&` +
        `device=${query.device}&` +
        `verify=true`
    );
}