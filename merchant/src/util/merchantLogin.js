const MerchantFirebase = require('./Database');
const Hasher = require('./PasswordHasher');

const LocalMerchantsData = require('../merchants.json');

exports.ValidateLogin = function (credentials) {

    // 1. VIA BACKEND ============================================================================================================== I D E A L
    // const saltRequest = new XMLHttpRequest();
    // const loginRequest = new XMLHttpRequest();

    // let urlGetSalt = `code=${credentials.code}`;

    // return new Promise((resolve,reject) => {
    //     saltRequest.open('POST', `/getMerchantSalt?${urlGetSalt}`, true);
    //     saltRequest.send();
    //     saltRequest.onreadystatechange = event => {
    //         if (saltRequest.readyState === 4 && saltRequest.status === 200) {
    //             let saltResponse = JSON.parse(saltRequest.response);
    //             let url = `mid=${credentials.code}&` + `password=${credentials.password}&` + `salt=${saltResponse.salt}`;

    //             loginRequest.open('POST', `/merchantLoginWorker?${url}`, true);
    //             loginRequest.send();
    //             loginRequest.onreadystatechange = e => {
    //                 if (loginRequest.readyState === 4 && loginRequest.status === 200) {
    //                     let loginResponse = JSON.parse(loginRequest.response);
    //                     if(loginResponse.state==="SUCCESS"){
    //                         resolve({
    //                             "validated" : true,
    //                             "mid" : loginResponse.mid,
    //                             "phone" : loginResponse.phone,
    //                             "name" : loginResponse.name,
    //                             "sessions" : loginResponse.sessions
    //                         });
    //                     } else {
    //                         resolve({
    //                             "validated" : false
    //                         });
    //                     }
    //                 }
    //             }
    //         }
    //     };
    // });

    // 2. LOCAL FIREBASE =====================================================================================================================
    // var MerchantFirebaseCreds = MerchantFirebase.firebase.database();   
    // console.log('2.1 m-login::45');
    
    // return new Promise((resolve, reject)=>{
    //     // MerchantFirebaseCreds.ref('merchants/merchant-' + credentials.code).child('salt').on('value', function(getSalt){
    //     //     if(getSalt.val()!==null){
    //     //         var hash = Hasher.generateHash(credentials.password, getSalt.val());
    //     //         MerchantFirebaseCreds.ref('merchants/merchant-' + credentials.code).child('password').on('value', function(pass){
    //     //             var password = pass.val();
    //     //             if( hash === password ) {
    //         console.log('2.2 m-login::54');
            
    //                     // MerchantFirebaseCreds.ref().child('merchants').orderByChild('mid').equalTo(credentials.code)
    //                     // .on('child_added', function(merchantDetails){
    //                     MerchantFirebaseCreds.ref('merchants/merchant-' + credentials.code)
    //                     .on('value', function(merchantDetails){
    //                         console.log('2.3 m-login::56');
    //                         console.log(merchantDetails.val().salt);
    //                         setInterval(5000);
    //                         if(merchantDetails.val().mid!==null){
    //                             MerchantFirebaseCreds.ref('merchants').off();
    //                             resolve({
    //                                 "validated": true,
    //                                 "mid" : "merchantDetails.val().mid",
    //                                 "phone" : "merchantDetails.val().phone",
    //                                 "name" : "merchantDetails.val().name",
    //                                 "sessions" : "merchantDetails.val().sessions"
    //                             });
    //                         }
    //                     });
    // //                 } else {
    // //                     resolve({
    // //                         "validated": false
    // //                     });
    // //                 }
    // //             });    
    // //         }
    // //     });        
    // });

    // 3. LOCAL JSON  =====================================================================================================================
    return new Promise((resolve, reject)=>{
        let requiredMerchant = getObjects(LocalMerchantsData.merchants, 'mid', credentials.code)[0];
        var hash = Hasher.generateHash(credentials.password, requiredMerchant.salt);

        if(hash === requiredMerchant.password){
            resolve({
                "validated": true,
                "mid" : requiredMerchant.mid,
                "phone" : requiredMerchant.phone,
                "name" : requiredMerchant.name
            });
        } else {
            resolve({
                "validated": false
            });
        }        
    });

    // 4. BACKEND JSON  =====================================================================================================================
    // const loginRequest = new XMLHttpRequest();

    // return new Promise((resolve,reject) => {
    //     let url = `mid=${credentials.code}&` + `password=${credentials.password}`;

    //     loginRequest.open('POST', `/merchantLoginWorker?${url}`, true);
    //     loginRequest.send();
    //     loginRequest.onreadystatechange = e => {
    //         if (loginRequest.readyState === 4 && loginRequest.status === 200) {
    //             let loginResponse = JSON.parse(loginRequest.response);
    //             if(loginResponse.state==="SUCCESS"){
    //                 resolve({
    //                     "validated" : true,
    //                     "mid" : loginResponse.mid,
    //                     "phone" : loginResponse.phone,
    //                     "name" : loginResponse.name
    //                 });
    //             } else {
    //                 resolve({
    //                     "validated" : false
    //                 });
    //             }
    //         }
    //     }
    // });
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else if (i === key && obj[i] === val || i === key && val === '') {
            objects.push(obj);
        } else if (obj[i] === val && key === ''){
            if (objects.lastIndexOf(obj) === -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}