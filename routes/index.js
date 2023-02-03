var express = require('express');
var router = express.Router();

const qrcode = require('qrcode')

const { spawnSync } = require('child_process');

const ldap = require('ldapjs');
const lclient = ldap.createClient({
    url: ['ldap://localhost:389']
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'sign up', err:'' });
});

router.post('/', async function (req, res) {
    console.log('Receiving params...');
    let msg = "";
    
    let rec = await checkUser(req.body.username);
    console.log('ldap record: ' + rec);
    if (rec) {
        if (rec.userPassword != req.body.password) {
            msg = 'Password is not correct!';
            // res.send(msg);
            res.render('index', { title:'sign up', err:msg });
            return;
        }
    } else {
        msg = `User is not found!`;
        // res.send(msg);
        res.render('index', { title:'sign up', err:msg });
        return;
    }
    
    // out = spawnSync('ls', ['-l']).stdout;
    let out = spawnSync('sh', ['setup.sh', `${req.body.username}`, `${req.body.password}`]);
    if (out.error) {
        console.log(`error: ${error.message}`);
        msg += out.error.message;
    }
    if (out.stderr) {
        console.log(`stderr: ${out.stderr}`);
        msg += out.stderr;
    }
    if (out.stdout) {
        console.log(`stdout: ${out.stdout}`);
        if (out.stdout.length > 3) {
            msg = out.stdout.toString();
            const lines = msg.split('\n');
            let uri = lines[2].split('chl=');
            // console.log(uri[1]);
            let key = uri[1].replaceAll('%3F', '?').replaceAll('%3D', '=').replaceAll('%26', '&');
            // console.log(src);
            let opts = {
                margin:0,
                errorCorrectionLevel:'M',
                width: 200
            };
            qrcode.toDataURL(key, opts, (err, src) => {
                if (err) res.send("Error occured");
                // res.send(`
                //     <!DOCTYPE html>
                //     <html>
                //     <head>
                //         <title>Sign up</title>
                //     </head>
                //     <body>
                //         <img class="mb-4" src="${src}" alt="" width="200" height="200"/>
                //         <p> ${lines[3].trim()} </p>
                //         <p> This is the original google QRcode <a href="${lines[2].trim()}" target="_blank">link</a>.</p>
                //         <a href="http://localhost:3000">Go Back</a>
                //     </body>
                //     </html>
                //     `);
                res.render('info', {src:src, key:lines[3].trim(), link:lines[2].trim()});
            });
        }
    } else {
        res.send(msg);
    }
});

function checkUser(username) {
    let lopts = {
        filter: `(cn=${username})`,
        scope: 'sub',
        attributes: ['cn', 'userPassword'],
        timeLimit: 5
    };
    let rec = new Promise((resolve, reject) => {
        lclient.search('dc=test,dc=com', lopts, (err, ret) => {
            let rec = null;
            ret.on('searchRequest', (searchRequest) => {
                console.log('searchRequest: ', searchRequest.messageID);
            });
            ret.on('searchEntry', (entry) => {
                console.log('entry: ' + JSON.stringify(entry.object));
                rec = entry.object;
            });
            ret.on('searchReference', (referral) => {
                console.log('referral: ' + referral.uris.join());
            });
            ret.on('error', (err) => {
                console.error('error: ' + err.message);
                // lclient.unbind();
                reject('error: ' + err.message);
            });
            ret.on('end', (result) => {
                console.log('status: ' + result);
                // lclient.unbind();
                resolve(rec);
            });
        });
    });
    return rec;
}

module.exports = router;
