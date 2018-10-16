const http = require('http');
const fs = require('fs');
const path = require('path');
const handle = require('express-handlebars');
const express = require('express');
const vhost = require('vhost');

const ServerConfig = require('./config.json');
const ServerState = ServerConfig.ServerState;
const PORT = process.env.PORT || ServerConfig.PORT
const SpreadsheetWorker = require('./util/SpreadsheetWorker');
const ssConfig = require('./config.json');
const AdminPassword = require('./config.json').AdminPassword;

const amphere = express();
const homepage = express();         // EXPRESS FOR MULTIPLE SUBDOMAINS
const account = express();          // EXPRESS FOR MULTIPLE SUBDOMAINS
const merchant = express();         // EXPRESS FOR MULTIPLE SUBDOMAINS
const admin = express();            // EXPRESS FOR MULTIPLE SUBDOMAINS

const SignupWorker = require('./util/SignupWorker');
const SessionsWorker = require('./util/SessionsWorker');
const LoginWorker = require('./util/LoginWorker');
const MerchantWorker = require('./util/MerchantWorker');
const ConsoleScreen = require('./util/ConsoleScreen');
const Hasher = require('./util/PasswordHasher');
const Admin = require('./util/Admin');
const CouponWorker = require('./util/CouponWorker');

//------------------------------------------------------------------------------------------------------//
// S E R V E R ============================== E X P R E S S =============================== S E R V E R //
//------------------------------------------------------------------------------------------------------//

amphere.listen(PORT, () => {
    ConsoleScreen.StartupScreen({
        "PORT" : PORT,
        "ServerState" : ServerState
    });
});

homepage.set('views', path.join(__dirname, 'homepage'));
homepage.set('view engine', 'hbs');
homepage.engine('hbs', handle({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/homepage/layouts',
    partialsDir  : [
        __dirname + '/homepage/partials',
    ]
}));

homepage.use(express.static(path.join(__dirname, 'homepage')));
account.use(express.static(path.join(__dirname, 'account/build')));
merchant.use(express.static(path.join(__dirname, 'merchant/build')));
admin.use(express.static(path.join(__dirname, 'admin')));

//--------------------------------------------------------------------------//
// R O U T E R ================ E X P R E S S ================= R O U T E R //
//--------------------------------------------------------------------------//



//===================================================================//
//---------------------------- HOMEPAGE -----------------------------//

homepage.get('/', (req,res)=> {
    res.render('index', { title: 'Home | Amphere Solutions' });
});
homepage.get('/signup', (req,res)=> {
    res.render('signup', { title: 'Sign Up | Amphere Solutions' });
});
homepage.get('/about', (req,res)=> {
    res.render('about', { title: 'About Us | Amphere Solutions' });
});
homepage.get('/contact', (req,res)=> {
    let params = getParameters(req);
    switch(params.q) {
        case 'completion':
            res.render('contact', {
                title: 'About Us | Amphere Solutions',
                completion: true
            });
            break;
        default:
            res.render('contact', { title: 'About Us | Amphere Solutions' });
            break;
    }
});
homepage.post('/contact', (req,res)=> {
    let params = getParameters(req);
    switch(params.q) {
        case 'form':
            SpreadsheetWorker.WriteToSpreadsheet({
                "ssId" : ssConfig.spreadsheets.contact,
                "sheet" : "Contact",
                "values" : [
                    `${decodeURI(params.name)}`,
                    `${decodeURI(params.email)}`,
                    `${decodeURI(params.message)}`
                ]
            });
            res.status(200);
        default:
            res.render('contact', { title: 'About Us | Amphere Solutions' });
            break;
    }
});
homepage.get('/partner', (req,res)=> {
    let params = getParameters(req);
    switch(params.q) {
        case 'onboard':
            res.render('onboarding', {
                title: 'Partner | Amphere Solutions',
                onboarding: true
            });
            break;
        case 'completion':
            res.render('onboarding', { title: 'Partner | Amphere Solutions' });
            break;
        default:
            res.render('onboarding', { title: 'Partner | Amphere Solutions' });
            break;
    }
});
homepage.get('/faq', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'homepage', 'LEGACY', 'faq.html'));
});
homepage.get('/team', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'homepage', 'LEGACY', 'team.html'));
});
homepage.get('/join', (req, res) => {
    let params = getParameters(req);
    switch(params.q){
        case 'info' :
            res.sendFile(path.resolve(__dirname, 'homepage', 'LEGACY', 'careers.html'));
            break;
    }
});
homepage.get('/support', (req, res) => {
    let params = getParameters(req);
    switch(params.q){
        default:
            res.sendFile(path.resolve(__dirname, 'homepage', 'LEGACY', 'support.html'));
            break;
    }
});
// homepage.get('/terms', (req, res) => {
//     let params = getParameters(req);
//     switch(params.q){
//         case 'damage':
//         case 'refunds':
//         default:
//             res.sendFile(path.resolve(__dirname, 'homepage', 'userterms.html'));
//             break;
//     }
// });
homepage.post('/onboarding', (req, res) => {
    let params = getParameters(req);
    MerchantWorker.MerchantOnboard({
        "rname" : params.rname,
        "name" : params.name,
        "phone" : params.phone,
        "email" : params.email,
        "address" : params.address,
        "comments" : params.comments
    }).then((_res)=>{
        if(_res) res.status(200).json({"state" : "SUCCESS"});
    });
});
homepage.post('/signupWorker', (req, res) => {
    let params = getParameters(req);
    SignupWorker.CreateNewUser({
        "phone" : params.phone,
        "name" : params.name,
        "password" : params.password,
        "verify" : params.verify
    }).then( _res => {
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS",
                "uid" : _res.uid,
                "hash" : params.hash
            });
            console.log(`\nNEW USER ADDED => \n\t- name: ${params.name} \n\t- phone: ${params.phone}`);
        } else {
            res.status(200).json({"state" : _res.error});
        }
    });
});
//===================================================================//



//===================================================================//
//----------------------------- ACCOUNT -----------------------------//

account.get((req, res) => {
    res.sendFile(path.resolve(__dirname, 'account/build', 'index.html'));
});
account.post('/userLoginWorker', (req, res)=> {
    let params = getParameters(req);
    LoginWorker.Login({
        "phone" : params.phone,
        "password" : params.password
    }).then((_res)=>{
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS",
                "uid" : _res.uid,
                "phone" : _res.phone,
                "name" : _res.name,
                "token" : _res.token
            });
        } else {
            res.status(200).json({"state" : "PASSWORD-INCORRECT"});
        }
    }).catch((err)=>{
        res.status(200).json({"state" : "NO-USER"});
    });
});
account.post('/sessionsWorker', (req, res) => {
    let params = getParameters(req);
    SessionsWorker.BookSession({
        "uid" : params.uid,
        "phone" : params.phone,
        "name" : decodeURI(params.name),
        "location" : params.location,
        "duration" : params.duration,
        "device" : params.device,
        //-----//
        "promoValid":decodeURI(params.promoValid),
        "promoCode":decodeURI(params.promoCode),
        "promoAmount":decodeURI(params.promoAmount)
        //-----//
    }).then( _res => {
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS",
                "sid" : _res.sid,
                "startDate" : _res.startDate
            });
            console.log(`\nNEW SESSION ADDED => \n\t- sid: ${_res.sid} \n\t- phone: ${params.phone}`);
        } else {
            res.status(500).json({"state" : "FAILED"});
        }
    }).catch((err)=>{
        console.log('\n'+err+'\n');
        res.status(500).send(err);
    });
});
account.post('/userCancelSession', (req, res)=> {
    let params = getParameters(req);
    SessionsWorker.CancelSession(params.sid, params.exp).then((_res)=>{
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS"
            });
        } else {
            res.status(200).json({"state" : "NO-USER"});
        }
    });
});
account.post('/userCancelActiveSession', (req, res)=> {
    let params = getParameters(req);
    // SessionsWorker.CancelSession(params.sid).then((_res)=>{
    //     if(_res.success===true){
    //         res.status(200).json({
    //             "state" : "SUCCESS"
    //         });
    //     } else {
    //         res.status(200).json({"state" : "NO-USER"});
    //     }
    // });
    SessionsWorker.ExpireSession(params.sid).then((_res)=>{
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS"
            });
        } else {
            res.status(200).json({"state" : "NO-USER"});
        }
    });
});
//-------------------------------------------------------------------//
//@adil
account.post('/validatePromo',(req,res)=>{
    CouponWorker.ValidateCoupon({
        "code":decodeURI(req.query.code),
        "userphone" : decodeURI(req.query.user)
    }).then((_res)=>{

        if(_res.success === true)
        {

            res.status(200).json({
                "state":"SUCCESS",
                "valid":true,
                "promoCode":_res.promoCode,
                "amount":_res.amount
            });
        }
        else
        {
            res.status(200).json({
                "state":"ERROR",
                "valid":false
            });
        }
    });
});

account.post('/removePromo',(req,res)=>{
    CouponWorker.RemovePromoCode({
        "code":decodeURI(req.query.code),
        "phone":decodeURI(req.query.phone)
    }).then((_res)=>{
        if(_res.success === true)
        {
            res.status(200).json({
                "state":"SUCCESS"
            });
        }
        else
        {
            res.status(200).json({
                "state": "ERROR"
            });
        }
    });
});
//-------------------------------------------------------------------//
//===================================================================//



//===================================================================//
//---------------------------- MERCHANT -----------------------------//

merchant.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'merchant/build', 'index.html'));
});
merchant.post('/sessionsWorker', (req, res) => {
    let params = getParameters(req);
    SessionsWorker.BookDeadSession({
        "uid" : params.uid,
        "phone" : params.phone,
        "name" : decodeURI(params.name),
        "location" : params.location,
        "duration" : params.duration,
        "device" : params.device
    }).then( _res => {
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS",
                "sid" : _res.sid,
                "startDate" : _res.startDate
            });
            console.log(`\nNEW DEAD SESSION ADDED => \n\t- sid: ${_res.sid} \n\t- phone: ${params.phone}`);
        } else {
            res.status(500).json({"state" : "FAILED"});
        }
    }).catch((err)=>{
        console.log('\n'+err+'\n');
        res.status(500).send(err);
    });
});
merchant.post('/merchantLoginWorker', (req, res)=> {
    let params = getParameters(req);
    MerchantWorker.MerchantLogin({
        "mid" : params.mid,
        "password" : params.password
    }).then((_res)=>{
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS",
                "mid" : _res.mid,
                "phone" : _res.phone,
                "name" : _res.name,
                "token" : _res.token
            });
        } else {
            res.status(200).json({"state" : "PASSWORD-INCORRECT"});
        }
    });
});
merchant.post('/merchantActivateSession', (req, res)=> {
    let params = getParameters(req);
    SessionsWorker.ActivateSession({
        "sid" : params.sid,
        "otp" : params.otp,
        "table" : params.table
    }).then((_res)=>{
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS",
                "time" : _res.time
            });
        } else {
            res.status(200).json({"state" : "NO-USER"});
        }
    });
});
merchant.post('/merchantExpireSession', (req, res)=> {
    let params = getParameters(req);
    SessionsWorker.ExpireSession(params.sid).then((_res)=>{
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS"
            });
        } else {
            res.status(200).json({"state" : "NO-USER"});
        }
    });
});
merchant.post('/merchantCancelSession', (req, res)=> {
    let params = getParameters(req);
    SessionsWorker.CancelSession(params.sid, params.exp).then((_res)=>{
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS"
            });
        } else {
            res.status(200).json({"state" : "NO-USER"});
        }
    });
});
merchant.post('/merchantCompleteSession', (req, res)=> {
    let params = getParameters(req);
    SessionsWorker.CompleteSession(params.sid).then((_res)=>{
        if(_res.success===true){
            res.status(200).json({
                "state" : "SUCCESS"
            });
        } else {
            res.status(200).json({"state" : "NO-USER"});
        }
    });
});
//===================================================================//



//===================================================================//
//----------------------------- ADMIN -------------------------------//

admin.set('views', path.join(__dirname, 'admin'));
admin.set('view engine', 'hbs');
admin.engine('hbs', handle({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/admin/layouts',
    partialsDir  : [
        __dirname + '/admin/partials',
    ]
}));

admin.get('/', (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'admin', 'login.html'));
});
admin.get('/u/keygen', (req,res)=>{
    let params = getParameters(req);
    let pubkey = generateKey(params.mac);
    res.status(200).json({'pubkey' : pubkey, });
});
admin.post('/u/login', (req,res)=>{
    let params = {
        password : Buffer.from( ((req.url.split('?')[1]).split('&')[0]).split('=')[1] , 'base64').toString('ascii'),
        pubkey : ((req.url.split('?')[1]).split('&')[1]).split('=')[1],
        mac : ((req.url.split('?')[1]).split('&')[2]).split('=')[1]
    }
    fs.readFile('admin-access-keys/key-'+ params.mac +'.json', (err,content)=>{
        if(err) return console.log("error");
        if(Hasher.generateHash(params.password, AdminPassword.salt)===AdminPassword.pwd && params.pubkey=== JSON.parse(content).key.pubkey) {
            res.status(200).json({'verify': true, 'pid' : JSON.parse(content).key.pvtkey});
        } else {
            res.status(200).json({'verify' : false});
        }
    });
});
admin.get('/u/login/p', (req,res)=>{
    let params = getParameters(req);
    fs.readFile('admin-access-keys/key-'+ params.mac +'.json', (err,content)=>{
        if(err) return console.log("error");
        if(params.id=== JSON.parse(content).key.pvtkey) {
            // ACCOUNT/PRIVATE PAGE HERE
            res.render('merchant', { title: 'Admin | Amphere Solutions' });
        }
    });
});
admin.post('/u/login/p', (req,res)=>{
    let params = getParameters(req);
    fs.readFile('admin-access-keys/key-'+ params.mac +'.json', (err,content)=>{
        if(err) return console.log("error");
        if(params.pvt=== JSON.parse(content).key.pvtkey) {
            res.status(200).json({'verify' : true});
        } else {
            res.status(200).json({'verify' : false});
        }
    });
});
admin.post('/u/logout', (req,res)=>{
    let params = getParameters(req);
    fs.writeFile('admin-access-keys/key-'+ params.mac +'.json', JSON.stringify({
        'key' : {
            'pubkey' : '',
            'pvtkey' : ''
        },
        'mac' : ''
    }), (e) => {
        if (e) return console.error(e);
    });
    res.sendStatus(200);
});
admin.post( '/u/addMerchant', (req, res)=>{
    let params = getParameters(req);
    if(params.phone!==null && params.mid!==null && params.password!==null) {
        Admin.AddMerchant({
            "name": decodeURI(params.name),
            "phone": decodeURI(params.phone),
            "mid": decodeURI(params.mid),
            "password": decodeURI(params.password)
        }).then((_res)=>{
            res.status(200).json({"state" : "SUCCESS"});
        });
    } else {
        res.status(200).json({"state" : "FAILED"});
    }
} );

//-------------------------------------------------------------------//
//@adil
admin.post('/u/coupons',(req,res)=>{
    let params = getParameters(req);
    if (params.class === '1') {
        CouponWorker.generateCoupons({
            "len":decodeURI(params.len),
            "count":decodeURI(params.count),
            "pattern":decodeURI(params.pattern)
        }).then((_res) =>{
            if(_res.success === true)
            {
                res.status(200).json({
                    "state":"SUCCESS",
                    "coupons":_res.coupons
                });
            }
            else{
                res.status(200).json({"state" : "FAILED"});
            }
        });
    }
    else if(params.class === '2'){
        CouponWorker.generateSelfCoupon({
            "coupon":decodeURI(params.coupon)
        }).then((_res)=>{
            if(_res.success === true)
            {
                res.status(200).json({
                    "state":"SUCCESS"
                });
            } else {
                res.status(200).json({
                    "state":"EXISTS"
                });
            }
        });
    }
    else if(params.class === '3')
    {
        CouponWorker.generateGenCoupon({
            "coupon":decodeURI(params.coupon)
        }).then((_res)=>{
            if(_res.success === true)
            {
                res.status(200).json({
                    "state":"SUCCESS"
                });
            } else {
                res.status(200).json({
                    "state":"EXISTS"
                });
            }
        });
    }
  });
//-------------------------------------------------------------------//


//===================================================================//


//===================================================================//
//------------------------- VIRTUAL HOST ----------------------------//

amphere.use(vhost('amphere.in', homepage));
amphere.use(vhost('www.amphere.in', homepage));
amphere.use(vhost('account.amphere.in', account));
amphere.use(vhost('merchant.amphere.in', merchant));
amphere.use(vhost('admin.amphere.in', admin));

//------------------------------------------------------------------------------------------------------//
// S E R V E R =============================== L E G A C Y ================================ S E R V E R //
//------------------------------------------------------------------------------------------------------//
/*
http.createServer((request,response)=>{
    params = _params(request);
    //console.log(`Request => \n\taction : ${params.action}`);
    //console.log(`Request => ${JSON.stringify(params)}`);

	switch(params.action){
        case '/':
            getFile(response, 'homepage/index.html', 'text/html');
            break;

        case '/about':
            getFile(response, 'homepage/about.html', 'text/html');
            break;

        case '/contact':
            getFile(response, 'homepage/contact.html', 'text/html');
            break;

        case '/signup':
            getFile(response, 'homepage/signup.html', 'text/html');
            break;

        case '/signupWorker':
            SignupWorker.CreateNewUser({
                "country_code" : params.cncode,
                "phone" : params.phone,
                "name" : params.name,
                "password" : params.password,
                "verify" : params.verify
            }).then( res => {
                if(res === true){
                    response.writeHead(200,{'Content-Type':'text/html'});
                    response.end("[SUCCESS] USER ADDED");
                    console.log(`\nNEW USER ADDED => \n\t- name: ${params.name} \n\t- phone: ${params.phone}`);
                } else {
                    response.writeHead(200,{'Content-Type':'text/html'});
                    response.end("[FAILURE] ERROR");
                }
            });
            break;

		default:
            let _other = params.action.split('/');
            let ext = _other[2].split('.');
                if(_other[1]==="css"){
                    getFile(response, `homepage/css/${_other[2]}`, 'text/css');
                } else if(_other[1]==="assets") {
                    getFile(response, `homepage/assets/${_other[2]}`, 'image/*');
                } else if(_other[1]==="js") {
                    getFile(response, `homepage/js/${_other[2]}`, 'text/javascript');
                } else {
                    response.writeHead(404,{'Content-Type':'text/plain'});
                    response.end("404 - File not found");
                }
            break;
    }
}).listen(PORT);
*/

//------------------------------------------------------------------------------------------------------//
// DIRECT UTILITY FUNCTIONS =================================================== DIRECT UTILITY FUNCTIONS//
//------------------------------------------------------------------------------------------------------//

function generateKey(mac) {
    let pubkey = '', pvtkey = '';
    for(var i=0 ; i<12 ; i++)
        pubkey = pubkey + Math.floor(Math.random()*16).toString(16);

    for(var i=0 ; i<24 ; i++)
        pvtkey = pvtkey + Math.floor(Math.random()*16).toString(16);

    fs.readFile('admin-access-keys/key-'+ mac +'.json', (err,content)=>{
        if(err) {

        } else {
            // EMAIL to admin => 'Access from new machine';
        }
        fs.writeFile('admin-access-keys/key-'+ mac +'.json', JSON.stringify({
            'key' : {
                'pubkey' : pubkey,
                'pvtkey' : pvtkey
            },
            'mac' : mac
        }), (e) => {
            if (e) return console.error(e);
        });
    });
    return pubkey;
}

function getParameters(request){
    url = request.url.split('?');
    var query = {
        "action" : url[0]
    };
    if(url.length>=2){
        url[1].split('&').forEach((q)=>{
            try{
                query[q.split('=')[0]] = q.split('=')[1];
            } catch(e) {
                query[q.split('=')[0]] = '';
            }
        })
    }
    return query;
}

function getFile(filepath){
	fs.readFile(filepath, function(err, _file){
		if(err){
            return(err);
		} else {
            return(_file);
		}
	})
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

function generateAdminKey(length) {
    var key = "";
    for(var i=0 ; i<length ; i++){
        key = key + Math.floor(Math.random()*16).toString(16);
    }
    return key;
}
