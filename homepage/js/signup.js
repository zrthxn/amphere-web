function generateSignupQueryURL(query) {
    //FORMAT PHONE NUMBER
    let resPhone = query.phone;

    let resName = "";
    let _name = query.name.split(' ');
    for(var i=0 ; i<_name.length ; i++){
        resName = resName + ((i===0)?"":"+") + _name[i];
    }

    let result = {
        "phone" : resPhone,
        "name" : resName,
        "password" : query.password,
    };

    return (
        `phone=${result.phone}&` +
        `name=${result.name}&` +
        `password=${result.password}&` +
        `verify=true`
    );
}

function validateInputs(phone, name, password, confPassword) {    
    
    return ({
        "validity" : true
    })
}

function createLoginToken(params) {
    return new Promise((resolve, reject)=> {
        localStorage.setItem("amphere-login-token", JSON.stringify({
            "uid" : params.uid,
            "phone" : params.phone,
            "name" : params.name,
            "salt" : params.salt
        }));
        resolve();
    });
}

function redirectToApp() {
    const redirectRequest = new XMLHttpRequest();
    redirectRequest.open('GET', `/redirectToApp`, true);
    redirectRequest.send();
}