const { google } = require('googleapis');
const readline = require('readline');
const dotenv = require('dotenv');

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost/3080' // Out-of-band redirect URI
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this url:', authUrl);

rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    console.log('Token:', token);
    console.log('Refresh Token:', token.refresh_token);
  });
});
