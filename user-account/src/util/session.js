exports.addNewSession = (params) => {
    return new Promise((resolve, reject)=>{
        const request = new XMLHttpRequest();
        let url = generateSessionQueryURL({
            "uid" : params.uid,
            "phone" : params.phone,
            "name" : params.name,
            "location" : params.location,
            "duration" : params.duration,
            "device" : params.device
        });
        
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

function generateSessionQueryURL(query) {
    return (
        `uid=${query.uid}&` +
        `phone=${query.phone}&` +
        `name=${encodeURI(query.name)}&` +
        `location=${query.location}&` +
        `duration=${query.duration}&` +
        `device=${query.device}&` +
        `verify=true`
    );
}