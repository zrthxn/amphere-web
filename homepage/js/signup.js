function generateSignupQueryURL(query) {
    //FORMAT PHONE NUMBER
    let resPhone = query.phone;

    let resName = "";
    let _name = query.name.split(' ');
    for(var i=0 ; i<_name.length ; i++){
        resName = resName + ((i===0)?"":"+") + _name[i];
    }

    let result = {
        "cncode" : query.cncode,
        "phone" : resPhone,
        "name" : resName,
        "password" : query.password,
    };

    return (
        `cncode=${result.cncode}&` +
        `phone=${result.phone}&` +
        `name=${result.name}&` +
        `password=${result.password}&` +
        `verify=true`
    );
}

function getPhoneCountryCode() {
    return "91";
}

function validateInputs(phone, name, password, confPassword) {    
    
    
    return ({
        "validity" : true
    })
}