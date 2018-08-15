const LocationValidation = require('./Database').firebase.database();

exports.validateLocationCode = (code) => {
    return new Promise((resolve, reject)=> {
        LocationValidation.ref().child('merchants').orderByChild('mid').equalTo(code).limitToFirst(1)
        .once('value').then((merch) => {
            if(merch.val()!==null){
                resolve({
                    valid: true,
                    code
                });
            } else {
                resolve({valid:false});
            }
        });
    });
}