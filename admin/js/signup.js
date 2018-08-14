function generateSignupQueryURL(query) {
    return (
        `phone=${query.phone}&` +
        `name=${encodeURI(query.name)}&` +
        `password=${encodeURI(query.password)}&` +
        `verify=true`
    );
}

function validateInputs(phone, name, password, confPassword) {
    if(phone!=="" && name!=="" && password!=="" && confPassword!==""){
        if(/^\d+$/.test(phone) && phone.length === 10) {
            if(password===confPassword) {
                return true;
            } else return ("confimpass");
        } else return ("phone");
    } else return ("empty");
}

function createLoginToken(params) {
    return new Promise((resolve, reject)=> {
        document.cookie =  `AMP_TK=${params.uid}; domain=amphere.in`;
        resolve();
    });
}