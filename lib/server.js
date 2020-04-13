const fs = require('fs');

const express = require('express');
const compression = require('compression');
const app = express();
const bodyParser = require('body-parser');
const winston = require('winston');
require('winston-daily-rotate-file');
const {combine, timestamp, printf, splat} = winston.format;

global.__root = __dirname + '/';
global.HttpError = require('./helpers/HttpError');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('lib/files'));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', ['*', 'https://real-estate-app-stefan-fe.herokuapp.com']);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type, x-access-token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);

  res.setHeader('Access-Control-Expose-Headers', 'token');

  logger.info(`req.url: ${JSON.stringify(req.url)} \n req.headers: ${JSON.stringify(req.headers)} \n req.body: ${JSON.stringify(req.body)} \n`);

  // Pass to next layer of middleware
  next();
});

app.use(compression());

if (!fs.existsSync('logs')) fs.mkdirSync('logs');

var transportLogs = new (winston.transports.DailyRotateFile)({
  filename: 'logs-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HHmm',
  dirname: 'logs',
  frequency: '6h',
  zippedArchive: true,
  maxFiles: '1d',
  level: 'info'
});

var transportErrors = new (winston.transports.DailyRotateFile)({
  filename: 'errors-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HHmm',
  dirname: 'logs',
  frequency: '6h',
  zippedArchive: true,
  maxFiles: '1d',
  level: 'error'
});

global.logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
    splat()
  ),
  transports: [transportLogs, transportErrors]
});

module.exports = {
  serve(env) {
    if (env !== 'test')
      logger.add(new winston.transports.Console, {prettyPrint: true});

    app.config = require('./config')(env);
    require('./db')(app);
    require('./routes')(app);
    app.port = process.env.PORT || 3127;

    // Liveness probe to be used by Kube API to determine server status
    app.get('/api/health', (req, res) => {
      res.status(200).send('Health check passed');
    });

    return new Promise((resolve, reject) => {
      app.listen(app.port, function (err) {
        if (err)
          return reject(err);
        resolve(app);
      });
    });
  }
};
