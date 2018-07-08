exports.addNewSession = (params) => {
    return new Promise((resolve, reject)=>{
        const request = new XMLHttpRequest();
        let url = generateSignupQueryURL({
            "phone" : params.phone,
            "uid" : params.uid,
            "location" : params.location,
            "duration" : params.duration
        });
        
        request.open('POST', `/sessionsWorker?${url}`, true);
        try { 
            request.send() 
        } catch (err) { 
            console.log(err) 
        }

        request.onreadystatechange = event => {
            if (request.readyState === 4 && request.status === 200) {
                let response = request.response;
                console.log("SUCCESS");
                resolve({
                    "sid" : response.sid,
                    "startDate" : response.startDate
                });
            } else {
                let response = request.response;
                reject(response.state);
            }
        };
    });    
}

function generateSignupQueryURL(query) {
    return (
        `phone=${query.phone}&` +
        `uid=${query.uid}&` +
        `location=${query.locatione}&` +
        `duration=${query.duration}&` +
        `verify=true`
    );
}