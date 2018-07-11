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
        try { 
            request.send();
        } catch (err) { 
            console.log(err); 
        }

        request.onreadystatechange = event => {
            if (request.readyState === 4  && request.status === 200) {
                let response = request.response;
                resolve(response);
            } else {
                reject("ERROR (session.js:24)");
            }
        };
    });    
}

function generateSessionQueryURL(query) {
    return (
        `phone=${query.phone}&` +
        `uid=${query.uid}&` +
        `location=${query.locatione}&` +
        `duration=${query.duration}&` +
        `device=${query.device}&` +
        `verify=true`
    );
}