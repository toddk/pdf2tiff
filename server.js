const express = require('express'),
    fs = require('fs'),
    Busboy = require('busboy'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    path = require('path'),
    cors = require('cors'),
    md5File = require('md5-file'),
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

mongoose.connect('mongodb://mongo:27017/pdf2tiff', { useNewUrlParser: true, useFindAndModify: false})
    .then(() => logger.info("Connected to MongoDB"))
    .catch(err => logger.error(`Couldn't connect to Mongo\n${err}`));

const UserRequest = require('./models/UserRequest');

const exec = require('child_process').exec;
const app = express();

let indir = '/usr/data/in/';
let outdir = '/usr/data/out/';


dotenv.config();
const port = process.env.APP_SERVER_PORT;
app.use(cors());
app.route('/').get((req, res) => {
    res.send("Hello world");
});
app.route('/uploads').get((req, res) => {
    UserRequest.find()
        .then(userRequests => res.json(userRequests))
        .catch(err => res.status(404).json({ msg: 'No User Requests Found'}));
});

app.route('/download/:requestId').get((req, res) => {
    console.log(req.params);
    UserRequest.findOne({id: req.params.requestId})
        .then(result => {
            console.log(`Filename ${result.filename}`);
            const headers = {
                'Content-Disposition' : `attachment; filename=${path.basename(result.filename)}`,
                'Content-Type' : 'image/tiff'
            };
            res.sendFile(result.filename, headers);
        })
        .catch(err => {
            console.log(err);
            res.send("Sorry, didn't work!")
        });
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
        let fullPathToUpload = path.join(indir, uploadedFile);
        let md5 = md5File.sync(fullPathToUpload);

        let newRequest = new UserRequest({
            name: formData.get('name'),
            email: formData.get('email'),
            organization: formData.get('organization'),
            filename: uploadedFile,
            md5,
            uploadedOn: new Date(),
            status: "uploaded",
            id: mongoose.Types.ObjectId()
        });
        
        newRequest.save().then(() => {
            res.writeHead(200, {'Connection' : 'close'});
            res.end('Upload complete!');
        });

        let outputFilename = path.join(outdir, `${path.basename(uploadedFile, "pdf")}tiff`);
        console.log(outputFilename);

        exec(`sh scripts/translate.sh ${fullPathToUpload} ${outputFilename}`, (error, stdout, stderr) => {
            logger.info("Starting translate script...");
            logger.info(stdout);
            logger.warn(stderr);
            // send the message now.
            var update;
            
            if (error) {
                logger.error(`exec error: ${error}`);
                update = { status: "error" };
            } else {
                let newMd5 = md5File.sync(outputFilename);
                update = { status: "converted", filename: outputFilename, md5: newMd5 };
            }

            UserRequest.findOneAndUpdate({md5}, update).then(result => { console.log(`${req.protocol}://${req.get('host')}/download/${result.id}`); logger.info(result); })
        });
    });

    return req.pipe(busboy);
});


app.listen(port, () => console.log(`PDF2TIFF service running on port ${port}`));
