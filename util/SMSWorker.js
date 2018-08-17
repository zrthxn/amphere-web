const SMSConfig = require('../config.json').smsService;
const http = require('http');
const qs = require('querystring');

exports.SendSMSSessionOTP = (otp, phone, sender) => {
    var options = {
        "method": "GET",
        "hostname": "2factor.in",
        "port": null,
        "path": "/API/V1/" + SMSConfig.apikey + "/SMS/" + phone + "/" + otp + "/" + sender,
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        }
    };
      
    return new Promise((resolve,reject)=>{
        var req = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) { chunks.push(chunk) });
            
            res.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });
        
        req.write(qs.stringify({}));
        req.end();
        resolve();
    });
}