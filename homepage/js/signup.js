function generateSignupQueryURL(query) {
    return (
      `email=${query.email}&` +
      `phone=${query.phone}&` +
      `name=${encodeURI(query.name)}&` +
      `password=${encodeURI(query.password)}&` +
      `verify=true`
    );
}

function validateInputs(email,phone, name, password, confPassword) {
    var email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email!=="" && phone!=="" && name!=="" && password!=="" && confPassword!==""){
        if(email_re.test(email)){
            if(/^\d+$/.test(phone) && phone.length === 10) {
                if(password===confPassword) {
                    return true;
                } else return ("confimpass");
            } else return ("phone");
        } else return ("email");
    } else return ("empty");
}

function createLoginToken(params) {
    return new Promise((resolve, reject)=> {
        document.cookie =  `AMP_TK=${params.uid}; domain=amphere.in`;
        resolve();
    });
}
