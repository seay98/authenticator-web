const express = require('express')
const qrcode = require('qrcode')

const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.get('/', (req, res) => {
    let opts = {
        margin:0,
        errorCorrectionLevel:'M',
        width: 200
    };
    qrcode.toDataURL('otpauth://totp/test@localhost.localdomain?secret=4CNDIM6OHEUSZTI6BOMMXWJL4A&issuer=localhost.localdomain', opts, (err, src) => {
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
