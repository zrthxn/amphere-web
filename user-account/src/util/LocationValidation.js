const LocationValidation = require('./Database').firebase.database();

exports.validateLocationCode = (code) => {
    let getcode;
    return new Promise((resolve, reject)=> {
        LocationValidation.ref().child('merchants').orderByChild('mid').equalTo(code)
        .on('child_added', merch => {
            if(merch.val()!==null){
                getcode = merch.val().mid;
                if(code===getcode){
                    resolve({
                        valid: true,
                        code: getcode
                    });
                } else if(code==="") {
                    resolve({valid: null});
                } else {
                    resolve({valid: false});
                }
            }
        });
    });
}