const http = require('http');
const file = require('fs');
const path = require('path');

const ServerConfig = require('./config.json');
const ServerState = ServerConfig.ServerState;
const PORT = process.env.PORT || ServerConfig.PORT;

const express = require('express');
const vhost = require('vhost');     // EXPRESS FOR MULTIPLE SUBDOMAINS
const amphere = express();    // EXPRESS FOR MULTIPLE SUBDOMAINS
const homepage = express();
const account = express();    // EXPRESS FOR MULTIPLE SUBDOMAINS
// const merchant = express();    // EXPRESS FOR MULTIPLE SUBDOMAINS
// const admin = express();    // EXPRESS FOR MULTIPLE SUBDOMAINS

const SignupWorker = require('./util/SignupWorker');
const ConsoleScreen = require('./util/ConsoleScreen');

//------------------------------------------------------------------------------------------------------//
// S E R V E R =============================== S E R V E R ================================ S E R V E R //
//------------------------------------------------------------------------------------------------------//

homepage.use(express.static(path.join(__dirname, 'homepage')));
homepage.listen(PORT, () => {
    ConsoleScreen.StartupScreen({
        "PORT" : PORT,
        "ServerState" : ServerState
    });
});

account.use(express.static(path.join(__dirname, 'account')));
account.listen(PORT, () => {
    ConsoleScreen.StartupScreen({
        "PORT" : PORT,
        "ServerState" : ServerState
    });
});

// merchant.use(express.static(path.join(__dirname, 'merchant')));
// merchant.listen(PORT, () => {
//     ConsoleScreen.StartupScreen({
//         "PORT" : PORT,
//         "ServerState" : ServerState
//     });
// });

// admin.use(express.static(path.join(__dirname, 'admin')));
// admin.listen(PORT, () => {
//     ConsoleScreen.StartupScreen({
//         "PORT" : PORT,
//         "ServerState" : ServerState
//     });
// });

homepage.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/homepage', '/index.html'));
});
homepage.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/homepage', '/signup.html'));
});
homepage.post('/signupWorker', (req, res) => {
    let params = getParameters(req);
    SignupWorker.CreateNewUser({
        "country_code" : params.cncode,
        "phone" : params.phone,
        "name" : params.name,
        "password" : params.password,
        "verify" : params.verify
    }).then( _res => {
        if(_res === true){
            res.status(200).json({"state" : "SUCCESS"});
            console.log(`\nNEW USER ADDED => \n\t- name: ${params.name} \n\t- phone: ${params.phone}`);
        } else {
            res.status(500).json({"state" : "FAILED"});
        }
    });
})

account.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/account', '/index.html'));
});

/*
//  EXPRESS FOR MULTIPLE SUBDOMAINS
homepage.use((req, res, next) => {

});
account.use((req, res, next) => {

});
merchant.use((req, res, next) => {

});
admin.use((req, res, next) => {

});
//  ADD CNAME RECORDS TO DNS REGISTRY
*/

// amphere.use(vhost('amphere.in', homepage));
amphere.use(vhost('amphere-web.herokuapp.com', homepage));
amphere.use(vhost('account.amphere-web.herokuapp.com', account));
// amphere.use(vhost('merchant.amphere.in', merchant));
// amphere.use(vhost('admin.amphere.in', admin));

//------------------------------------------------------------------------------------------------------//
// L E G A C Y =============================== S E R V E R ================================ L E G A C Y //
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
			if(_other[1]==="css"){
				getFile(response, `homepage/css/${_other[2]}`, 'text/css');
			} else if(_other[1]==="assets") {
                getFile(response, `homepage/assets/${_other[2]}`, 'image/*');
            } else if(_other[1]==="js") {
                getFile(response, `homepage/js/${_other[2]}`, 'text/javascript');
            } else {
				response.writeHead(404,{'Content-Type':'text/plain'});
				response.end("404 - File not found");
			} break;
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