var winston		 = require('winston')
var morgan     = require('morgan')
var path       = require('path')
var fs				 = require('fs')

var logdir     = process.env.LOGDIR || __dirname
var logfile    = process.env.LOGFILE || path.basename(process.mainModule.filename).replace('.js','') || path.basename(__dirname);
var esurl	= process.env.ELASTICSEARCH || false

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
      // logstash: true,
      timestamp: true,
      maxsize: 1024000, // maxsize in bytes of each logfile
      maxFiles: 1
    }),
    // new winston.transports.Http({
    //   host: 'log.bfdev.vk1881.no',
    //   port: 80,
    //   // path: '/log/v1_0/simplelogservice.svc/xml/LogPost'
    //   path: '/log/v1_0/simplelogservice.svc/xml/Log/'
    //   // path: '/log/v1_0/simplelogservice.svc/xml/Log/?level=info&namespace=glennspace&msg=glennmsg28&host=pcdevglenn&version=1.1&requestId=abcdef123'
    // })
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
