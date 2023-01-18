const express = require('express')
const qrcode = require('qrcode')

const { spawnSync } = require('child_process');

const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.get('/', (req, res) => {
    let opts = {
        margin:10,
        errorCorrectionLevel:'M',
        width: 200
    };
    qrcode.toDataURL('otpauth://totp/root@localhost.localdomain?secret=AB7JZJXDW4LS3SEZ5OF5J4TDHM&issuer=localhost.localdomain', opts, (err, src) => {
        if (err) res.send("Error occured");
        res.send(`<!DOCTYPE html>
        <html>
        <head>
            <title>Sign up</title>
        </head>
        <body>
            <img class="mb-4" src="${src}" alt="" width="200" height="200"/>
            
        </body>
        </html>`);
    });
})
