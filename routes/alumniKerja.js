var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken'),
    ejwt    = require('express-jwt'),
    db      = require('../db2');

var app = module.exports = express.Router();

var jwtCheck = ejwt({
  secret: config.secretKey
});

function cekAlm(almNiu, done) {
  db.get().query('SELECT * FROM kerja_alm WHERE almNiu = ? LIMIT 1', [almNiu], function(err, rows, fields) {
    if (err) throw err;
    //console.log(rows[0]);
    done(rows[0]);
  });
}

function getDataKerja(done){
  db.get().query(`select * from kerja_alm`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data not found..`)
       }else{
         done(rows);
       }
    });
}

function getAlm(done){
    db.get().query(`SELECT    mhsNiu,
          mhsNama,
          mhsJenisKelamin,
          kotaNama AS tempatLahir,
          mhsTanggalLahir,
          agmrNama,
          mhsJumlahSaudara,
          mhsAlamatMhs,
          mhsNoHp,
          mhsEmail,
          mhsProdiKode,
          prodiNamaResmi,
          mhsAngkatan,
          mhsTanggalLulus,
          CONCAT(prodiNamaResmi, ' - ', prodiJjarKode, ' ', modelrNama) AS prodi_info,
          TRIM(CONCAT(IFNULL(PA.pegGelarDepan,''),' ',IF(PA.pegGelarBelakang='',PA.pegNama,CONCAT_WS(', ', PA.pegNama, PA.pegGelarBelakang)))) AS dosen_pa,
          PA.pegNip AS nip_pa
          FROM mahasiswa
          LEFT JOIN program_studi ON mhsProdiKode=prodiKode
          LEFT JOIN agama_ref ON agmrId=mhsAgmrId
          LEFT JOIN kota_ref ON kotaKode=mhsKotaKodeLahir
          LEFT JOIN model_ref ON prodiModelrId = modelrId
          LEFT JOIN pegawai PA ON mhsDsnPegNipPembimbingAkademik=PA.pegNip
          WHERE
          mhsStakmhsrKode='L'`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data not found..`)
       }else{
         done(rows);
       }
    });
}

app.use('/api/alm/kerja', jwtCheck);
app.post('/api/alm/kerja', function(req, res) {
  if (!req.body.almNiu) {
    return res.status(400).json({status:"You must send the almNiu"});
  }
  cekAlm(req.body.almNiu, function(alumni){
    if(!alumni) {
      alumni = {
        almNiu: req.body.almNiu,
        almNama: req.body.almNama,
        prsNama : req.body.prsNama,
        prsAlmt : req.body.prsAlmt,
        prsJenis : req.body.prsJenis,
        jabatan : req.body.jabatan,

      };
      db.get().query('INSERT INTO kerja_alm SET ?', [alumni], function(err, result){
        if (err) throw err;
        res.status(200).json({
          status : 'Data Berhasil disimpan'
        });
      });
    }
    else res.status(400).json({status:"A Data with that user already exists"});
  });
});


app.use('/api/alm/allkrj', jwtCheck);
app.get('/api/alm/allkrj', function(req, res) {
  getDataKerja(function(result) {
      res.status(200).send(result);
  });
});

//app.use('/api/alm', jwtCheck);
app.get('/api/alm', function(req, res) {
  getAlm(function(result) {
      res.status(200).send(result);
  });
});


//------------------test------------------

app.post('/api/alm/kerjax', function(req, res) {
  if (!req.body.almNiu || !req.body.almNama || !req.body.prsNama || !req.body.prsAlmt || !req.body.prsJenis || !req.body.jabatan) {
    return res.status(400).json({status:"You must send the almNiu,almNama,prsNama,prsAlmt,prsJenis,jabatan  "});
  }
  cekAlm(req.body.almNiu, function(alumni){
    if(!alumni) {
      alumni = {
        almNiu: req.body.almNiu,
        almNama: req.body.almNama,
        prsNama : req.body.prsNama,
        prsAlmt : req.body.prsAlmt,
        prsJenis : req.body.prsJenis,
        jabatan : req.body.jabatan,

      };
      db.get().query('INSERT INTO kerja_alm SET ?', [alumni], function(err, result){
        if (err) throw err;
        res.status(200).json({
          status : 'Data Berhasil disimpan'
        });
      });
    }
    else
    res.status(400).json({status:"A Data with that user already exists"});
  });
});
