var express = require('express');
var router = express.Router();

const { spawnSync } = require('child_process');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'sign up' });
});

router.post('/', function (req, res) {
    console.log('Receiving params...');

    // out = spawnSync('ls', ['-l']).stdout;
    let out = spawnSync('sh', ['setup.sh', `${req.body.emailaddress}`, `${req.body.password}`]);
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
            msg = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sign up</title>
            </head>
            <body>
                <img class="mb-4" src="${lines[2].trim().replace('www.google.com', 'chart.googleapis.com')}" alt="" width="200" height="200"/>
                <p> ${lines[3].trim()} </p>
                <p> If you can not see the QRcode, please copy this <a href="${lines[2].trim()}" target="_blank">link</a> and open it in a new window.</p>
            </body>
            </html>
            `;
        }
    }

    res.send(msg);
});

module.exports = router;
