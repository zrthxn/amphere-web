const SMSConfig = require('../config.json').textlocal;
const http = require('http');
const querystring = require('querystring');

exports.SendSMSSessionOTP = (otp, phone) => {
    let sms = `Thank you for booking an Amphere session! Your OTP is ${otp}.`;
    
    var postData = querystring.stringify({
    apikey: SMSConfig.apikey,
    numbers: "00910" + phone,
    sender: SMSConfig.sender,
    message: encodeURI(sms)
    });

    var options = {
        host: 'api.textlocal.in',
        port: 80,
        method: 'POST',
        path: '/send/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
    };

    return new Promise((resolve,reject)=>{
        var result = '';
        var req = http.request(options, function (res) {
            res.on('data', function (chunk) {
              result += chunk;
            });
            res.on('end', function () {
              console.log(result);
            });
            res.on('error', function (err) {
              console.log(err);
            });
        });
        req.write(postData);
        req.end();
        resolve(result);
    });
}