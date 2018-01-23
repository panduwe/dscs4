var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secretKey
});


function daftarBuku(done){
    db.get().query(`SELECT kodeBuku, judul, tahun, pengarang, kategori FROM buku`,
        function(err, rows) {
         if (err) throw err;
         let row = rows[0];
         if(!row){
            done(`data buku tidak ditemukan.`)
         }else{
           done(rows);
         }
       });
}

//=========================test==================================
app.use('/api/list/buku', jwtCheck);
app.get('/api/list/buku', function(req, res) {
  daftarBuku(function(result) {
    res.status(200).json({
      status : "200",
      message : "berhasil mendapatkan data buku",
      hasil : result,
    });
  });
});

app.get('/api/list/bukux', function(req, res) {
  daftarBuku(function(result) {
    res.status(200).json({
      status : "200",
      message : "berhasil mendapatkan data buku",
      dosen : result,
    });
  });
});
