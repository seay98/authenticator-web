const express = require('express');
const qrcode = require('qrcode');
const ldap = require('ldapjs');

const { spawnSync } = require('child_process');

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});

const lclient = ldap.createClient({
    url: ['ldap://localhost:389']
});
lclient.bind('cn=admin,dc=test,dc=com', '-pl,0okm', (err) => {
    if(err) {
        console.log('ldap binding failed.');
    }
});
lclient.on('error', (err) => {
    console.log(err);
});

app.get('/', async(req, res) => {
    let lopts = {
        filter: '(cn=u1)',
        scope: 'sub',
        attributes: ['cn', 'userPassword'],
        timeLimit: 5
    };
    lclient.search('dc=test,dc=com', lopts, (err, ret) => {
        ret.on('searchRequest', (searchRequest) => {
            console.log('searchRequest: ', searchRequest.messageID);
        });
        ret.on('searchEntry', (entry) => {
            console.log('entry: ' + JSON.stringify(entry.object));
        });
        ret.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join());
        });
        ret.on('error', (err) => {
            console.error('error: ' + err.message);
            lclient.unbind();
        });
        ret.on('end', (result) => {
            console.log('status: ' + result);
            lclient.unbind();
        });
    });
    // let opts = {
    //     margin:10,
    //     errorCorrectionLevel:'M',
    //     width: 200
    // };
    // qrcode.toDataURL('otpauth://totp/root@localhost.localdomain?secret=AB7JZJXDW4LS3SEZ5OF5J4TDHM&issuer=localhost.localdomain', opts, (err, src) => {
    //     if (err) res.send("Error occured");
    //     res.send(`<!DOCTYPE html>
    //     <html>
    //     <head>
    //         <title>Sign up</title>
    //     </head>
    //     <body>
    //         <img class="mb-4" src="${src}" alt="" width="200" height="200"/>
            
    //     </body>
    //     </html>`);
    // });
    res.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>Sign up</title>
    </head>
    <body>
        <p>done.</p>
    </body>
    </html>`);
});
