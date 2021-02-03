//////////////////////////////////////////////////////////////////////
///////////////        IoT Smart Toilet System         ///////////////
//////////////////////////////////////////////////////////////////////
// Author            : Patrick, Jarvis
// Develop Start Day : 21st January, 2021
// Developed By      : Linked-Technologies Limited

//#region Timer & Delay
//////////////////////////////////////////////////////////////////////
global.DELAY     = 500;
global.SYS_DELAY = 5000;

var timestamp   = { hour12:   false,
                    year: '2-digit',  month: '2-digit',    day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit' };
var time_format = { hour12:   false,   hour: '2-digit', minute: '2-digit' };
var date_format = { year: '2-digit',  month: '2-digit',    day: '2-digit' };

var getTimestamp = function() {
  var now = new Date();
  var msecs = ('00' + now.getMilliseconds()).slice(-3);
  return '[' + now.toLocaleString("zh-GB", timestamp) + '.' + msecs + ']';
};

var getTestTime = function() {
  var now = new Date();
  return now.toLocaleString("en-GB", date_format) + ',' + now.toLocaleString("en-GB", time_format);
};

var getDate = function() {
  var now = new Date();
  return now.toLocaleString("en-GB", date_format);
};
//////////////////////////////////////////////////////////////////////
//#endregion

//#region Logging Message Header
//////////////////////////////////////////////////////////////////////
var headerINFO   = '[INFO]    ';
var headerERROR  = '[ERROR]   ';
var headerSERVER = '[SERVER]  '; // Message sent
var headerMAINGW = '[MAINGW]  '; // Message received
var headerDEBUG  = '[DEBUG]   ';
var headerQUEUE  = '[QUEUE]   ';

var myConsoleLog = function(msgHeader, msg) {
  console.log(getTimestamp() + msgHeader + msg);
};
//////////////////////////////////////////////////////////////////////
//#endregion

var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var logger        = require('morgan');
var async         = require('async');
var mongoose      = require('mongoose');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy
var session       = require('express-session');
var flash         = require('connect-flash');
var multer        = require('multer');
var fs            = require('fs');
var schedule      = require('node-schedule');
var favicon       = require('serve-favicon');
var sp            = require("serialport");

// To support parser function
const Readline    = require('@serialport/parser-readline');
const ByteLength  = require('@serialport/parser-byte-length');

// Serial Port Setting
// RX      = ttyS0
// BaudRate: 115200
var serialPort = new sp("/dev/ttyS0", {
	baudRate: 115200,
}).setEncoding('ASCII');

// const parser = serialPort.pipe(new ByteLength({length: 143}));
const parser = serialPort.pipe(new Readline({ delimiter: '\n' }));

//#region  Multer Setup for File Uploads
//////////////////////////////////////////////////////////////////////
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')       // Destination folder
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname) // File name after saving
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      req.fileValidationError = 'Only .png, .jpg and .jpeg format allowed!';
      cb(null, false, req.flash('info', 'Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

var upload        = multer({ storage: storage });
//////////////////////////////////////////////////////////////////////
//#endregion

var message       = require('./operation/message');
var driver        = require('./operation/driver');
// var queue         = require('./behavior/handleQueue');
var indexRouter   = require('./routes/index')(passport, upload);

//#region Mongoose Setup for MongDB Read/Write
//////////////////////////////////////////////////////////////////////
// var mongoDB = 'mongodb://127.0.0.1/iot2db';
// mongoose.set('useCreateIndex', true);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useUnifiedTopology', true);
// mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
// mongoose.Promise = global.Promise;

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// var MainGateway  = require('./models/device_mg');
// var SubGateway   = require('./models/device_sg');
// var Endpoint     = require('./models/device_ep');
// var Site         = require('./models/site');
// var User         = require('./models/user');
// var Mode         = require('./models/mode');
// var Map          = require('./models/map');
// var Group        = require('./models/group');

const { fail }   = require('assert');
const { type }   = require('os');
//////////////////////////////////////////////////////////////////////
//#endregion

const { Socket }  = require('net');
var app           = express();
var server        = require('http').createServer(app);
var io            = require('socket.io')(server);

//#region Passport Setup for User Authentication
//////////////////////////////////////////////////////////////////////
// passport.serializeUser(function (user, done) {
//   done(null, user._id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// passport.use('login', new LocalStrategy({
//     passReqToCallback: true
//   },

//   function (req, username, password, done) {
//     User.findOne({ userid: username }, function (err, user) {
//       if (err) {
//         return done(err);
//       }

//       if (!user) {
//         return done(null, false, req.flash('info', 'User not found.'));
//       }

//       if (!isValidPassword(user, password)) {
//         return done(null, false, req.flash('info', 'Invalid password'));
//       }

//       return done(null, user);
//     });
//   }
// ));

// var isValidPassword = function (user, password) {
//   // return bcrypt.compareSync(password, user.password)
//   return (password == user.password);
// };

// app.use(session({
//   secret: 'Hello There!',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
//////////////////////////////////////////////////////////////////////
//#endregion

//#region View Engine Setup for UI/UX
//////////////////////////////////////////////////////////////////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use('/', indexRouter);
//////////////////////////////////////////////////////////////////////
//#endregion

parser.on('data', function(data) {
	var data_ascii = data.toString('ASCII');
  var payload    = data_ascii.toLowerCase();

  var cargo = {
    prea: message.getPreamble(payload),
    chri: message.getCharacteristic(payload),
    mgid: message.getMGID(payload),
    sgid: message.getSGID(payload),
    dest: message.getDestID(payload),
    func: message.getFunction(payload),
    crcb: message.getCRCByte(payload),
    rssi: message.getRSSIValue(payload),
    msgN: message.getMessageNo(payload),
    cont: message.getContent(payload),
  };

  if ((cargo.dest == '10000970') || (cargo.dest == '10000971') || (cargo.dest == '10000972') || (cargo.dest == '1000099a') || (cargo.dest == '1000099b') ||
      (cargo.dest == '10000973') || (cargo.dest == '10000974') || (cargo.dest == '10000975') ||
      (cargo.dest == '10000976') || (cargo.dest == '10000977') || (cargo.dest == '10000978') ||
      (cargo.dest == '10000979') || (cargo.dest == '10000980') || (cargo.dest == '10000981')) {
      
    //#region Content Format (NON-IAQ)
    // typedef struct{
    //   uint8_t DataLength;
    //   EP_Type EpType;                           // uint8_t 
    //   uint8_t EPRssi;
    //   uint8_t OffOn;
    //   OnOffStatus_Warning	Warning;
    //   RTC_DateTypeDef LastWarningDate;          // 4*uint8_t WeekDay, Month, Date, Year
    //   RTC_TimeTypeDef LastWarningTime;          // 3*uint8_t Hours, Min, Sec
    //   uint8_t	BatLvMSB;							
    //   uint8_t	BatLvLSB;
    //   uint8_t SleepMinMSB;                      // Could be set?
    //   uint8_t SleepMinLSB;                      // Could be set?
    //   uint8_t WakeUpWindowMS_MSB;               // Could be set?
    //   uint8_t WakeUpWindowMS_LSB;               // Could be set?
    //   uint8_t hardwareVer;
    //   uint8_t firmwareVer;
    //
    // } OnOffStatusUplink_Type;
    //#endregion

    console.log(getTimestamp() + headerMAINGW + 'Sensor Alert   : ' + 
                cargo.prea + ' ' + cargo.chri + ' ' + cargo.mgid + ' ' + cargo.sgid + ' ' + cargo.dest + ' ' +
                cargo.func + ' ' + cargo.crcb + ' ' + cargo.rssi + ' ' + cargo.msgN + ' ' + cargo.cont);

    io.sockets.emit('debug_show', getTimestamp() + headerMAINGW + 'Sensor Alert   : ' + 
                                  cargo.prea + ' ' + cargo.chri + ' ' + cargo.mgid + ' ' + cargo.sgid + ' ' + cargo.dest + ' ' +
                                  cargo.func + ' ' + cargo.crcb + ' ' + cargo.rssi + ' ' + cargo.msgN + ' ' + cargo.cont);

    var warning = cargo.cont.substring(8, 10);
    var battery = cargo.cont.substring(24, 28);

    if (cargo.dest == '10000981') {
      warning = getTimestamp();
    } else if (cargo.dest == '10000979') {
      warning = cargo.cont.substring(8);
    }

    io.sockets.emit('sensor_demo', cargo.dest, warning);

    switch(cargo.dest) {
      case '10000971':
        console.log(getTimestamp() + headerDEBUG + 'Nursery room Triggered!');

        if (warning == '02') {
          var destination = 'dest_nursery';
          var content     = 'in-use';

          io.sockets.emit('viewer', destination, content);

        } else {
          var destination = 'dest_nursery';
          var content     = 'available';

          io.sockets.emit('viewer', destination, content);
        }
        break;

      case '10000972':
        console.log(getTimestamp() + headerDEBUG + 'Male toilet Triggered!');

        if (warning == '01') {
          var destination = 'dest_male1';
          var content     = 'in-use';

          io.sockets.emit('viewer', destination, content);

        } else {
          var destination = 'dest_male1';
          var content     = 'available';

          io.sockets.emit('viewer', destination, content);
        }
        break;

      case '1000099a':
        console.log(getTimestamp() + headerDEBUG + 'Female toilet A Triggered!');

        var destination = 'dest_female_a';
        var content     = 'available';

        if (warning == '02') {
          content = 'in-use';
        } else {
          content = 'available';
        }

        io.sockets.emit('viewer', destination, content);
        break;

      case '1000099b':
        console.log(getTimestamp() + headerDEBUG + 'Female toilet B Triggered!');

        var destination = 'dest_female_b';
        var content     = 'available';

        if (warning == '02') {
          content = 'in-use';
        } else {
          content = 'available';
        }
        
        io.sockets.emit('viewer', destination, content);
        break;

      case '10000979':
        console.log(getTimestamp() + headerDEBUG + 'IAQ sensor Triggered!');

        var PM25_MSB = parseInt(warning.substring(0,2), 16) * 256;
        var PM25_LSB = parseInt(warning.substring(2,4), 16);
        var PM25     = PM25_MSB + PM25_LSB;
        
        var PM10_MSB = parseInt(warning.substring(4,6), 16) * 256;
        var PM10_LSB = parseInt(warning.substring(6,8), 16);
        var PM10     = PM10_MSB + PM10_LSB;
        
        var H2S_MSB  = parseInt(warning.substring(8,10), 16) * 256;
        var H2S_LSB  = parseInt(warning.substring(10,12), 16);
        var H2S      = H2S_MSB + H2S_LSB;
        
        var NH3_MSB  = parseInt(warning.substring(12,14), 16) * 256;
        var NH3_LSB  = parseInt(warning.substring(14,16), 16);
        var NH3      = NH3_MSB + NH3_LSB;
        
        var CO2_MSB  = parseInt(warning.substring(16,18), 16) * 256;
        var CO2_LSB  = parseInt(warning.substring(18,20), 16);
        var CO2      = CO2_MSB + CO2_LSB;

        var CH2O_MSB = parseInt(warning.substring(20,22), 16) * 256;
        var CH2O_LSB = parseInt(warning.substring(22,24), 16);
        var CH2O     = CH2O_MSB + CH2O_LSB;

        var TVOC_MSB = parseInt(warning.substring(24,26), 16) * 256;
        var TVOC_LSB = parseInt(warning.substring(26,28), 16);
        var TVOC     = TVOC_MSB + TVOC_LSB;

        var TEMP     = parseInt(warning.substring(28,30), 16);
        var HUMD     = parseInt(warning.substring(30,32), 16);

        io.sockets.emit('viewer', 'dest_temperature', TEMP);
        io.sockets.emit('viewer', 'dest_humidity', HUMD);

        if (HUMD > 60) {
          io.sockets.emit('viewer', 'dest_airquality', 'Normal');

        } else {
          io.sockets.emit('viewer', 'dest_airquality', 'Good');
        }
        break;
    }

    var destination = './sensor_log.txt';
    var log_message =  getTimestamp() + ' ' + cargo.dest + ' ' + battery  + ' message: ' + cargo.cont + '\r\n';
    fs.appendFile(destination, log_message, function(err_fs) {
      if (err_fs) {
        console.log(err);
      }
    });

  } else {
      console.log(getTimestamp() + headerERROR + 'Receive INVALID MG Response (Preamble/Characteristic): ' + payload);
      io.sockets.emit('debug_show', getTimestamp() + headerERROR + 'Receive INVALID MG Response (Preamble/Characteristic): ' + payload);
  }
});

//////////////////////////////////////////////////////////////////////
//////////       Clients SocketIO Communication Block       //////////
//////////////////////////////////////////////////////////////////////
io.sockets.on('connection', function(socket) {
  var socketID = socket.id;
  myConsoleLog(headerINFO, 'Device connected, id #' + socket.id);

  socket.on('disconnect', () => {
    console.log(getTimestamp() + headerINFO + 'Device disconnected, id #' + socket.id);
  });

  socket.on('error', () => {
    console.log(getTimestamp() + headerERROR + 'Device connection error, id #' + socket.id);
  });

// The Lord will fight for you. You just keep still. - Exodus 14:14
});
//////////////////////////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app: app, server: server }; 
