const firebase = require('../node_modules/firebase');
const DatabaseConfig = require('../config.json');

firebase.initializeApp(DatabaseConfig.firebase);

exports.firebase = firebase;

/**
* @author Alisamar Husain
* 
* Standard Firebase Database Export
* ---------------------------------
* Import the object by either
*   const db = require('./Database')
* or
*   import db from './Database';
* 
* Use the object to get a database
* namespace by 'db.firebase.database()'
* 
* Check the firebase docs for more.
*/