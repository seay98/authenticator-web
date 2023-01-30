var express = require('express');
var router = express.Router();

/* For qrcode generation */
const qrcode = require('qrcode')
/* For bash script */
const { spawnSync } = require('child_process');

/* For email */
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: "yuhai-2019@hotmail.com",
        pass: "2re2zib26n",
    },
});

/* For user list */
const csv = require('csv-parser');
const fs = require('fs');
const upath = '/home/yh/usertable.csv';
const users = [];
fs.createReadStream(upath)
    .pipe(csv())
    .on('data', (data) => users.push(data))
    .on('end', () => {
        console.log('User list loaded.');
    });

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'sign up' });
});

router.post('/', function (req, res) {
    console.log('Receiving params...');

    /* Check user. */
    let user = users.find(({username}) => username === req.body.username);
    if (user === undefined) {
        res.send(`<!DOCTYPE html>
                    <html>
                    <head>
                        <title>Sign up</title>
                    </head>
                    <body>
                        <p> Not found! </p>
                        <p> User ${req.body.username} is not in the user list.</p>
                        <a href="http://localhost:3000">Go Back</a>
                    </body>
                    </html>`
                );
        return;
    }

    // out = spawnSync('ls', ['-l']).stdout;
    let out = spawnSync('sh', ['setup.sh', `${req.body.username}`, `${req.body.password}`]);
    let msg = "";
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
                let html = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Sign up</title>
                        </head>
                        <body>
                            <img class="mb-4" src="${src}" alt="" width="200" height="200"/>
                            <p> ${lines[3].trim()} </p>
                            <p> This is the original google QRcode <a href="${lines[2].trim()}" target="_blank">link</a>.</p>
                            <a href="http://localhost:3000">Go Back</a>
                        </body>
                        </html>
                        `;
                
                /* Send key and QRcode to user's mailbox */
                let info = {
                    from: '"no-reply" <yuhai-2019@hotmail.com>',
                    to: `"${user.username}" <${user.address}>`,
                    subject: 'Authenticator setup',
                    text: 'This message is sent automatically.',
                    html: html,
                };
                transporter.sendMail(info, (error, resp) => {
                    if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + resp.response);
                    }
                });
                
                /* Response to browser */
                res.send(`<!DOCTYPE html>
                            <html>
                            <head>
                                <title>Sign up</title>
                            </head>
                            <body>
                                <p> Hi ${user.username}, </p>
                                <p> Your new secret key has sent to your mailbox [${user.address}].</p>
                                <a href="http://localhost:3000">Go Back</a>
                            </body>
                            </html>`);
            });
        } else {
            res.send(msg); 
        }
    } else {
        res.send(msg);
    }
});

module.exports = router;
