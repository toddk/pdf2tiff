const express = require('express');
const fs = require('fs');
const Busboy = require('busboy');
const dotenv = require('dotenv');
const util = require('util');
const path = require('path');
const cors = require('cors');
const exec = require('child_process').exec;
const app = express();

exec(`sh scripts/translate.sh /usr/data/in/ /usr/data/out/`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error) {
        console.log(`exec error: ${error}`);
    }
});

dotenv.config();
const port = process.env.APP_SERVER_PORT;
app.use(cors());

app.route('/convert').post( (req, res) => {
    var busboy = new Busboy({headers: req.headers});
    let formData = new Map();
    var uploadedFile = '';

    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
        console.log(`'${fieldname}' : '${val}'`);
        formData.set(fieldname, val);
    });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        uploadedFile = filename;
        var saveTo = path.join("./in/", filename);
        console.log(`Uploading to ${saveTo}`);
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', () => {
        console.log('Upload complete');
        var metadata = path.join('./out/', `${uploadedFile}.txt`);
        fs.writeFileSync(metadata, `{'email': '${formData.get('email')}', 'name': '${formData.get('name')}'}` , 'utf-8', (err) => {
            if (err) console.log(err);
            console.log("Metadata written to file for use after conversion");
        });
        

        console.log(`Name: ${formData.get('name')}`);
        console.log(`Email: ${formData.get('email')}`);
        res.writeHead(200, { 'Connection' : 'close' });
        res.end('Upload complete!');
    });

    return req.pipe(busboy);
});


app.listen(port, () => console.log(`PDF2TIFF service running on port ${port}`));
