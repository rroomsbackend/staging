import express from 'express';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
// import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import expressSanitizer from 'express-sanitizer';
var fs = require('fs');
// import rfs from 'rotating-file-stream';
global.__basedir = __dirname;
export default {
    setup: (config, defaultLayout) => {
        const app = express();
        // app.use(logger(config.app.log, { stream: accessLogStream }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(cookieParser(config.app.secret));
        app.use(session({ secret: config.app.secret, resave: true, saveUninitialized: true }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(expressSanitizer());
        app.use("/uploads", express.static(path.join(__dirname, "../src/uploads")));
        app.use("/static", express.static(path.join(__dirname, 'public')));
        app.use('/images', express.static('./src/uploads'));
        Number.prototype.pad = function (size) {
            var s = String(this);
            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
        }
        app.get('/uploads/:file', function (req, res) {
            res.set("Content-Disposition", "attachment;filename=" + req.params.file);
            res.sendFile(__basedir + "/uploads/" + req.params.file);
        });
        app.get('/image-b64/:file', function (req, res) {
            var base64 = fs.readFileSync(__basedir + "/uploads/" + req.params.file, 'base64');
            return res.status(200).json({ status: true, image: base64 });
        });
        return app;
    }
}
