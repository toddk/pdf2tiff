const express = require('express'),
    fs = require('fs'),
    Busboy = require('busboy'),
    dotenv = require('dotenv'),
    path = require('path'),
    cors = require('cors'),
    winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service'},
    transports: [
        new winston.transports.File( {filename: 'error.log', level: 'error'}),
        new winston.transports.File( {filename: 'combined.log'})
    ]
});

const exec = require('child_process').exec;
const app = express();

let indir = '/usr/data/in/';
let outdir = '/usr/data/out/';

exec(`sh scripts/translate.sh ${indir} ${outdir}`, (error, stdout, stderr) => {
    logger.info("Starting watcher script...");
    logger.info(stdout);
    logger.warn(stderr);
    if (error) {
        logger.error(`exec error: ${error}`);
    }
});

dotenv.config();
const port = process.env.APP_SERVER_PORT;
app.use(cors());
app.route('/').get((req, res) => {
    res.send("Hello world");
});

app.route('/convert').post( (req, res) => {
    var busboy = new Busboy({headers: req.headers});
    let formData = new Map();
    var uploadedFile = '';

    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
        logger.info(`'${fieldname}' : '${val}'`);
        formData.set(fieldname, val);
    });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        uploadedFile = filename;
        var saveTo = path.join(indir, filename);
        logger.info(`Uploading to ${saveTo}`);
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', () => {
        logger.info('Upload complete');
        var metadata = path.join(outdir, `${uploadedFile}.txt`);
        fs.writeFileSync(metadata, `{'email': '${formData.get('email')}', 'name': '${formData.get('name')}'}` , 'utf-8', (err) => {
            if (err) logger.error(err);
            logger.info("Metadata written to file for use after conversion");
        });
        
        res.writeHead(200, { 'Connection' : 'close' });
        res.end('Upload complete!');
    });

    return req.pipe(busboy);
});


app.listen(port, () => console.log(`PDF2TIFF service running on port ${port}`));
