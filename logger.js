var winston		= require('winston')
var morgan    = require('morgan')
var path      = require('path')
var fs				= require('fs')
var argv      = require('minimist')(process.argv.slice(2))

var logdir     = argv.LOGDIR || process.env.LOGDIR || __dirname
var logfile    = argv.LOGFILE || process.env.LOGFILE || path.basename(process.mainModule.filename).replace('.js','') || path.basename(__dirname);
var esurl	     = argv.ELASTICSEARCH || process.env.ELASTICSEARCH || false
var logstash   = argv.LOGSTASH || false

// Configure winston as logger
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      json: false,
      timestamp: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: logdir + '/' + logfile + '-winston.log',
      json: false ,
      logstash: logstash,
      timestamp: true,
      maxsize: 1024000, // maxsize in bytes of each logfile
      maxFiles: 1
    }),
  ],

  exceptionHandlers: [
    new (winston.transports.Console)({
      json: false,
      timestamp: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: logdir + '/' + logfile + '-winston-exceptions.log',
      json: false,
      timestamp: true,
      mazsize: 1024000, // maxsize in bytes of each logfile
      mazFiles: 1
    })
  ],
  exitOnError: false
});

module.exports = logger;

// configure morgan as morgan
var accessLogStream = fs.createWriteStream(logdir + '/' + logfile + "-morgan.log", {flags: 'a'})
module.exports.morgan = function (app) {
  app.use(morgan('common', {stream: accessLogStream}))
  app.use(morgan('dev'))
};

logger.info('logger.js init logdir(%s) logfile(%s) esurl(%s)', logdir, logfile, esurl)
