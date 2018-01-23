var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken'),
    ejwt    = require('express-jwt'),
    db      = require('../db');

var app = module.exports = express.Router();

var jwtCheck = ejwt({
  secret: config.secretKey
});

function cekAlm(kodePjm, done) {
  db.get().query('SELECT * FROM peminjam_buku WHERE kodePjm = ? LIMIT 1', [kodePjm], function(err, rows, fields) {
    if (err) throw err;
    //console.log(rows[0]);
    done(rows[0]);
  });
}

app.use('/api/prs/pinjambuku', jwtCheck);
app.post('/api/prs/pinjambuku', function(req, res) {
  if (!req.body.kodePjm || !req.body.idUser || !req.body.judulBuku || !req.body.tglPjm || !req.body.tglExp || !req.body.statusPjm) {
    return res.status(400).send("You must send the kodePjm,idUser,judulBuku,tglPjm,tglExp,statusPjm ");
  }
  cekAlm(req.body.kodePjm, function(pinjambuku){
    if(!pinjambuku) {
      pinjambuku = {
        kodePjm: req.body.kodePjm,
        idUser: req.body.idUser,
        judulBuku : req.body.judulBuku,
        tglPjm : req.body.tglPjm,
        tglExp : req.body.tglExp,
        statusPjm : req.body.statusPjm,

      };
      db.get().query('INSERT INTO peminjam_buku SET ?', [pinjambuku], function(err, result){
        if (err) throw err;
        res.status(200).json({
          status : 'Data Berhasil disimpan'
        });
      });
    }
    else res.status(400).send("A Data with that kode pinjam already exists");
  });
});

function daftarPeminjam(done){
    db.get().query(`SELECT kodePjm, idUser, judulBuku, tglPjm, tglExp, statusPjm FROM peminjam_buku where statusPjm='pinjam'`,
        function(err, rows) {
         if (err) throw err;
         let row = rows[0];
         if(!row){
            done(`data tidak ditemukan.`)
         }else{
           done(rows);
         }
       });
}


//------------------test------------------

app.get('/api/list/peminjamx', function(req, res) {
  daftarPeminjam(function(result) {
    res.status(200).json({
      status : "200",
      message : "berhasil mendapatkan data ",
      hasil : result,
    });
  });
});

app.use('/api/list/peminjam', jwtCheck);
app.get('/api/list/peminjam', function(req, res) {
  daftarPeminjam(function(result) {
    res.status(200).json({
      status : "200",
      message : "berhasil mendapatkan data ",
      hasil : result,
    });
  });
});

app.post('/api/prs/pinjambukux', function(req, res) {
  if (!req.body.kodePjm || !req.body.idUser || !req.body.judulBuku || !req.body.tglPjm || !req.body.tglExp || !req.body.statusPjm) {
    return res.status(400).send("You must send the kodePjm,idUser,judulBuku,tglPjm,tglExp,statusPjm ");
  }
  cekAlm(req.body.kodePjm, function(pinjambuku){
    if(!pinjambuku) {
      pinjambuku = {
        kodePjm: req.body.kodePjm,
        idUser: req.body.idUser,
        judulBuku : req.body.judulBuku,
        tglPjm : req.body.tglPjm,
        tglExp : req.body.tglExp,
        statusPjm : req.body.statusPjm,

      };
      db.get().query('INSERT INTO peminjam_buku SET ?', [pinjambuku], function(err, result){
        if (err) throw err;
        res.status(200).json({
          status : 'Data Berhasil disimpan'
        });
      });
    }
    else res.status(400).send("A Data with that kode pinjam already exists");
  });
});
