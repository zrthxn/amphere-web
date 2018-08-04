const fs = require('fs');
const {google} = require('googleapis');

const CREDENTIALS_PATH = './gss-credentials.json';
const TOKEN_PATH = './gss-token.json';

exports.WriteToSpreadsheet = function (payload) {
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
  
    const {client_secret, client_id, redirect_uris} = JSON.parse(content).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return console.log('Error loading token file:', err);
      oAuth2Client.setCredentials(JSON.parse(token));
      PayloadDelivery(oAuth2Client, payload);
    });
  });
}

function PayloadDelivery (oAuth2Client, payload) {
  google.sheets({version: 'v4', oAuth2Client}).spreadsheets.values.append({
    spreadsheetId: payload.ssId,
    
    range: payload.sheet,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    
    resource: {
        majorDimension: "ROWS",
        values: [payload.values]
    },
    auth: oAuth2Client
  }, function(err, response) {
      if (!err) console.log("\n\tSuccess :: Spreadsheet Payload Delivered\n");
      else console.error(err.errors, err.code);
  });
}