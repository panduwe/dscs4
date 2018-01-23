var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secretKey
});


function daftarDsnSaintek(done){
    db.get().query(`SELECT id, nip, kode_jurusan, nama FROM kode_dosen WHERE
        kode_jurusan=55201
        OR kode_jurusan=44201
        OR kode_jurusan=47201
        OR kode_jurusan=20201
        OR kode_jurusan=54211
        OR kode_jurusan=46201
        OR kode_jurusan=45201 `,
        function(err, rows) {
         if (err) throw err;
         let row = rows[0];
         if(!row){
            done(`data dosen IF tidak ditemukan.`)
         }else{
           done(rows);
         }
       });
}

function daftarDsnIf(done){
  db.get().query(`SELECT id, nip, kode_jurusan, nama FROM kode_dosen WHERE
      kode_jurusan=55201`,
      function(err, rows) {
       if (err) throw err;
       let row = rows[0];
       if(!row){
          done(`data dosen IF tidak ditemukan.`)
       }else{
         done(rows);
       }
     });
}

app.use('/api/dsn/sains', jwtCheck);
app.get('/api/dsn/sains', function(req, res) {
  daftarDsnSaintek(function(result) {
      res.status(200).send(result);
  });
});

app.use('/api/dsn/if', jwtCheck);
app.get('/api/dsn/if', function(req, res) {
  daftarDsnIf(function(result) {
      res.status(200).send(result);
  });
});

//=========================test==================================

app.get('/api/dsn/ifx', function(req, res) {
  daftarDsnIf(function(result) {
    res.status(200).json({
      status : "200",
      message : "berhasil mendapatkan data dosen",
      dosen : result,
    });
  });
});

app.get('/api/dsn/sainsx', function(req, res) {
  daftarDsnSaintek(function(result) {
      res.status(200).send(result);
  });
});
