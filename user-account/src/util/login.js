exports.Validate = function (credentials) {

    // const request = new XMLHttpRequest();
    // // let url = generateSignupQueryURL({
    // //     "cncode" : getPhoneCountryCode(),
    // //     "phone" : phone.value,
    // //     "name" : _name.value,
    // //     "password" : password.value
    // // });

    // request.open('POST', `/loginWorker?phone=${credentials.phone}&password=${credentials.password}`, true);
    // try { 
    //     request.send() 
    // } catch (err) {
    //     console.log(err)
    // }

    // request.onreadystatechange = event => {
    //     if (request.readyState === 4 && request.status === 200) {
    //         //TODO
    //         return new Promise((resolve,reject) => {
    //             resolve(true);
    //         });
    //         console.log("SUCCESS");
    //         //CREATE WEB SESSION TOKEN
    //         //LOGIN
    //     } else {
            
    //     }
    // };
    return new Promise((resolve,reject) => {
        resolve(true);
    });
}

/**
 * @author
 * TODO
 * - SEND LOGIN REQUEST & DATA TO SERVER
 * - GET BACK RESPONSE
 * - RETURN RESULT
 */