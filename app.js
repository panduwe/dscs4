var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors'); //add cors

var routes = require('./routes/index');
var loginMhs = require('./routes/loginMhs');
var biodataMhs = require('./routes/biodataMhs');
var sidang = require('./routes/sidang');
var tangalPtg = require('./routes/tangalPtg');
var alumniKerja = require('./routes/alumniKerja');
var peminjamBuku = require('./routes/peminjamBuku');
var daftarSidang = require('./routes/daftarSidang');
var daftarDosen = require('./routes/daftarDosen');
var daftarMatkul = require('./routes/daftarMatkul');
var daftarMhsKls = require('./routes/daftarMhsKls');
var daftarFakultas = require('./routes/daftarFakultas');
var daftarBuku = require('./routes/daftarBuku');
var nilaiMhs = require('./routes/nilaiMhs');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors()); //add cors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //false ==> true
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users); //change to below line
app.use(loginMhs);
app.use(biodataMhs);
app.use(sidang);
app.use(tangalPtg);
app.use(alumniKerja);
app.use(peminjamBuku);
app.use(daftarSidang);
app.use(daftarDosen);
app.use(daftarMatkul);
app.use(daftarMhsKls);
app.use(daftarFakultas);
app.use(daftarBuku);
app.use(nilaiMhs);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
