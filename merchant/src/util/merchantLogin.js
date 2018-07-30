const MerchantFirebase = require('./Database');
const Hasher = require('./PasswordHasher');

const LocalMerchantsData = require('../merchants.json');
var MerchantFirebaseCreds = MerchantFirebase.firebase.database();    

exports.ValidateLogin = function (credentials) {

    // 1. VIA BACKEND ============================================================================================================== I D E A L
    const loginRequest = new XMLHttpRequest();

    return new Promise((resolve,reject) => {
        loginRequest.open('POST', `/merchantLoginWorker?mid=${credentials.code}&password=${credentials.password}`, true);
        loginRequest.send();
        loginRequest.onreadystatechange = e => {
            if (loginRequest.readyState === 4 && loginRequest.status === 200) {
                let loginResponse = JSON.parse(loginRequest.response);
                if(loginResponse.state==="SUCCESS"){
                    resolve({
                        "validated" : true,
                        "mid" : loginResponse.mid,
                        "phone" : loginResponse.phone,
                        "name" : loginResponse.name,
                        "token" : loginResponse.token
                    });
                } else {
                    resolve({
                        "validated" : false
                    });
                }
            }
        }
    });

    // 2. LOCAL FIREBASE =====================================================================================================================
    // return new Promise((resolve, reject)=>{
    //     MerchantFirebaseCreds.ref().child('merchants').orderByChild('mid').equalTo(credentials.code)
    //     .on('child_added', (merchantDetails)=>{
    //         if(merchantDetails.val()!==null){
    //             var hash = Hasher.generateHash(credentials.password, merchantDetails.val().salt);
    //             if(hash===merchantDetails.val().password){
    //                 resolve({
    //                     "validated": true,
    //                     "mid" : merchantDetails.val().mid,
    //                     "phone" : merchantDetails.val().phone,
    //                     "name" : merchantDetails.val().name,
    //                     "token" : merchantDetails.val().mid + "/" + hash
    //                 });
    //             } else {
    //                 resolve({"validated": false});
    //             }
    //         } else {
    //             resolve({"validated": false});
    //         }
    //     });
    // });

    // 3. LOCAL JSON  =====================================================================================================================
    // return new Promise((resolve, reject)=>{
    //     let requiredMerchant = getObjects(LocalMerchantsData.merchants, 'mid', credentials.code)[0];
    //     var hash = Hasher.generateHash(credentials.password, requiredMerchant.salt);

    //     if(hash === requiredMerchant.password){
    //         resolve({
    //             "validated": true,
    //             "mid" : requiredMerchant.mid,
    //             "phone" : requiredMerchant.phone,
    //             "name" : requiredMerchant.name,
    //             "token" : hash
    //         });
    //     } else {
    //         resolve({
    //             "validated": false
    //         });
    //     }        
    // });

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

exports.ValidateToken = (token) => {
    return new Promise((resolve, reject)=>{      
        MerchantFirebaseCreds.ref().child('merchants').orderByChild('mid').equalTo(token.mid)
        .on('child_added', (merchantDetails)=>{
            if(merchantDetails.val()!==null){
                if(token.mid===merchantDetails.val().mid && token.hash===merchantDetails.val().password){
                    resolve({
                        "validated": true,
                        "mid" : merchantDetails.val().mid,
                        "phone" : merchantDetails.val().phone,
                        "name" : merchantDetails.val().name
                    });
                } else {
                    resolve({
                        "validated": false
                    });
                }
            } else {
                reject("NO-MERCH");
            }
        });
    });
}

// function getObjects(obj, key, val) {
//     var objects = [];
//     for (var i in obj) {
//         if (!obj.hasOwnProperty(i)) continue;
//         if (typeof obj[i] === 'object') {
//             objects = objects.concat(getObjects(obj[i], key, val));    
//         } else if (i === key && obj[i] === val || i === key && val === '') {
//             objects.push(obj);
//         } else if (obj[i] === val && key === ''){
//             if (objects.lastIndexOf(obj) === -1){
//                 objects.push(obj);
//             }
//         }
//     }
//     return objects;
// }