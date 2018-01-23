var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secretKey
});

function getDaftarMhsKlsx(kelas, done){
db.get().query(`SELECT
                  krsId, krsSempId, sempSemId, krsMhsNiu, mhsNama, sempProdiKode,krsdtKlsId, mkkurKode, mkkurNamaResmi
                FROM
                  s_krs
                  JOIN mahasiswa ON mhsNiu = krsMhsNiu
                  JOIN s_semester_prodi ON sempId = krsSempId
                  JOIN s_krs_detil ON krsId = krsdtKrsId
                  JOIN s_matakuliah_kurikulum ON mkkurId = krsdtMkkurId
                WHERE
                  sempProdiKode=705
                  AND sempSemId=20151
                  AND krsdtKlsId= ${kelas}`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data pada 20151 kelas ${kelas} ini tidak tersedia..`)
       }else{
         done(rows);
       }
    });
}

function getDaftarMhsKls(kelas,done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = date.getMonth()+1;
  if(bulan<7){
      var semes='2';
  }
  else {
      var semes='1';
  }
  var semesid=tahun+semes;
    db.get().query(`SELECT
                      krsId, krsSempId, sempSemId, krsMhsNiu, mhsNama, sempProdiKode,krsdtKlsId, mkkurKode, mkkurNamaResmi
                    FROM
                      s_krs
                      JOIN mahasiswa ON mhsNiu = krsMhsNiu
                      JOIN s_semester_prodi ON sempId = krsSempId
                      JOIN s_krs_detil ON krsId = krsdtKrsId
                      JOIN s_matakuliah_kurikulum ON mkkurId = krsdtMkkurId
                    WHERE
                      sempProdiKode=705
                      AND sempSemId=${semesid}
                      AND krsdtKlsId= ${kelas}`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data pada semester ${semesid} kelas ${kelas} tidak tersedia..`)
       }else{
         done(rows);
       }
    });
}

//tahun terbaru token
app.use('/api/list/mhskls', jwtCheck);
app.post('/api/list/mhskls', function(req, res) {
  getDaftarMhsKls(req.body.klsId,function(result) {
      res.status(200).send(result);
  });
});

//tahun terbaru tanpa token
app.post('/api/list/mhsklsx', function(req, res) {
  getDaftarMhsKls(req.body.klsId,function(result) {
      res.status(200).send(result);
  });
});

app.use('/api/list/mhskls2015', jwtCheck);
app.post('/api/list/mhskls2015', function(req, res) {
  getDaftarMhsKlsx(req.body.klsId,function(result) {
      res.status(200).send(result);
  });
});

app.post('/api/list/mhskls2015x', function(req, res) {
  if (!req.body.klsId) {
    return res.status(400).json({status:"You must send the klsId"});
  }
  getDaftarMhsKlsx(req.body.klsId,function(result) {
      res.status(200).send(result);
  });
});
