const http = require('http');
const file = require('fs');
const path = require('path');

const ServerConfig = require('./config.json');
const ServerState = ServerConfig.ServerState;
const PORT = process.env.PORT || ServerConfig.PORT;

const express = require('express');
const vhost = require('vhost');     // VHOST FOR MULTIPLE SUBDOMAINS
const amphere = express();          // EXPRESS FOR MULTIPLE SUBDOMAINS
const homepage = express();
const account = express();          // EXPRESS FOR MULTIPLE SUBDOMAINS
const merchant = express();         // EXPRESS FOR MULTIPLE SUBDOMAINS
const admin = express();            // EXPRESS FOR MULTIPLE SUBDOMAINS

const cookieParser = require('cookie-parser');

const SignupWorker = require('./util/SignupWorker');
const SessionsWorker = require('./util/SessionsWorker');
const ConsoleScreen = require('./util/ConsoleScreen');

//------------------------------------------------------------------------------------------------------//
// S E R V E R ============================== E X P R E S S =============================== S E R V E R //
//------------------------------------------------------------------------------------------------------//

amphere.listen(PORT, () => {
    ConsoleScreen.StartupScreen({
        "PORT" : PORT,
        "ServerState" : ServerState
    });
});

homepage.use(express.static(path.join(__dirname, 'homepage')));
account.use(express.static(path.join(__dirname, 'account')));
merchant.use(express.static(path.join(__dirname, 'merchant')));
admin.use(express.static(path.join(__dirname, 'admin')));

    //--------------------------------------------------------------------------//
    // R O U T E R ================ E X P R E S S ================= R O U T E R //
    //--------------------------------------------------------------------------//

    homepage.use(cookieParser());

    //---------------------------- HOMEPAGE -----------------------------//
    homepage.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'homepage', 'index.html'));
    });
    homepage.get('/signup', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'homepage', 'signup.html'));
    });
    homepage.get('/about', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'homepage', 'about.html'));
    });
    homepage.get('/faq', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'homepage', 'faq.html'));
    });
    homepage.get('/contact', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'homepage', 'contact.html'));
    });
    homepage.get('/redirectToApp', (req, res) => {
        res.redirect('account.amphere.in:9000');
    });
    homepage.post('/signupWorker', (req, res) => {
        let params = getParameters(req);
        SignupWorker.CreateNewUser({
            "phone" : params.phone,
            "name" : params.name,
            "password" : params.password,
            "verify" : params.verify
        }).then( _res => {
            if(_res.success === true){
                res.status(200).json({
                    "state" : "SUCCESS",
                    "uid" : _res.uid,
                    "phone" : params.phone,
                    "name" : params.name,
                    "salt" : _res.salt
                });
                console.log(`\nNEW USER ADDED => \n\t- name: ${params.name} \n\t- phone: ${params.phone}`);
            } else {
                res.status(500).json({"state" : "FAILED"});
            }
        });
    });

    //----------------------------- ACCOUNT -----------------------------//    
    account.get((req, res) => {
        console.log(req);
        res.sendFile(path.resolve(__dirname, 'account', 'index.html'));
    });
    account.post('/sessionsWorker', (req, res) => {
        // CHECK VERIFY PARAMETER
        let params = getParameters(req);
        SessionsWorker.BookNewSession({
            "phone" : params.phone,
            "uid" : params.uid,
            "location" : params.location,
            "duration" : params.duration,
            "device" : params.device
        }).then( _res => {
            if(_res.success === true){
                res.status(200).json({
                    "state" : "SUCCESS",
                    "sid" : _res.sid,
                    "startDate" : _res.startDate
                });
                console.log(`\nNEW SESSION ADDED => \n\t- sid: ${_res.sid} \n\t- phone: ${params.phone}`);
            } else {
                res.status(500).json({"state" : "FAILED"});
            }
        });
    })

    //----------------------------- ADMIN -------------------------------//
    admin.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'admin', 'index.html'));
    });

    //---------------------------- MERCHANT -----------------------------//
    merchant.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'merchant', 'index.html'));
    });

    //==========================================================================//

amphere.use(vhost('amphere.in', homepage));
amphere.use(vhost('www.amphere.in', homepage));         // SET TO LOCAL
//amphere.use(vhost('amphere-web.herokuapp.com', homepage));         // SET TO HEROKU
amphere.use(vhost('account.amphere.in', account));
amphere.use(vhost('merchant.amphere.in', merchant));
amphere.use(vhost('admin.amphere.in', admin));

// amphere.use(homepage);
// amphere.use(account);
// amphere.use(merchant);
// amphere.use(admin);

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
	file.readFile(filepath, function(err, _file){
		if(err){
            return(err);
		} else {
            return(_file);
		}
	})
}