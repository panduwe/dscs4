var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secretKey
});

function getDaftarJurusan(done){
    db.get().query(`SELECT prodiKode, prodiNamaResmi FROM program_studi`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data tidak tersedia..`)
       }else{
         done(rows);
       }
    });
}

function getDaftarFakultas(done){
  db.get().query(`SELECT id_fak, nama_fak FROM kode_fakultas`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data tidak tersedia..`)
       }else{
         done(rows);
       }
    });
}


app.get('/api/list/jurusan', function(req, res) {
  getDaftarJurusan(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/list/fakultas', function(req, res) {
  getDaftarFakultas(function(result) {
      res.status(200).send(result);
  });
});
