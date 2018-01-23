var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secretKey
});

function getKodeMatkul(done){
    db.get().query(`SELECT mkkurKode, mkkurNamaResmi FROM s_matakuliah_kurikulum WHERE mkkurProdiKode ='705'`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data pada semester ini belum tersedia..`)
       }else{
         done(rows);
       }
    });
}

function getDaftarMatkulx(done){
    db.get().query(`SELECT klsSemId AS semester,
                    jdkulHari AS hari,
                    jdkulJamMulai AS sesi_mulai,
                    jdkulJamSelesai AS sesi_selesai,
                    ruNama AS ruang,
                    klsId,
                    klsNama AS klsNama ,
                    mkkurKode AS kodeMk ,
                    mkkurNamaresmi AS namaresmi,
                    TRIM(CONCAT(IFNULL(PA.pegGelarDepan,''),' ',IF(PA.pegGelarBelakang='',PA.pegNama,CONCAT_WS(', ', PA.pegNama, PA.pegGelarBelakang)))) AS Dosen,
                    dsnkDsnPegNip
                  FROM s_jadwal_kuliah
                    LEFT JOIN e_ruang ON ruId = jdkulRuId
                    INNER JOIN s_kelas ON jdkulKlsId = klsId
                    LEFT JOIN s_matakuliah_kurikulum ON klsMkkurId = mkkurId
                    LEFT JOIN s_dosen_kelas ON dsnkKlsId = jdkulKlsId
                    LEFT JOIN pegawai PA ON dsnkDsnPegNip=PA.pegNip
                  WHERE klsSemId =20151
                    AND mkkurProdiKode=705`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data pada semester ini belum tersedia..`)
       }else{
         done(rows);
       }
    });
}

function getDaftarMatkul(done){
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
    db.get().query(`SELECT klsSemId AS semester,
                    jdkulHari AS hari,
                    jdkulJamMulai AS sesi_mulai,
                    jdkulJamSelesai AS sesi_selesai,
                    ruNama AS ruang,
                    klsId,
                    klsNama AS klsNama ,
                    mkkurKode AS kodeMk ,
                    mkkurNamaresmi AS namaresmi,
                    TRIM(CONCAT(IFNULL(PA.pegGelarDepan,''),' ',IF(PA.pegGelarBelakang='',PA.pegNama,CONCAT_WS(', ', PA.pegNama, PA.pegGelarBelakang)))) AS Dosen,
                    dsnkDsnPegNip
                  FROM s_jadwal_kuliah
                    LEFT JOIN e_ruang ON ruId = jdkulRuId
                    INNER JOIN s_kelas ON jdkulKlsId = klsId
                    LEFT JOIN s_matakuliah_kurikulum ON klsMkkurId = mkkurId
                    LEFT JOIN s_dosen_kelas ON dsnkKlsId = jdkulKlsId
                    LEFT JOIN pegawai PA ON dsnkDsnPegNip=PA.pegNip
                  WHERE klsSemId =${semesid}
                    AND mkkurProdiKode=705`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data pada semester ${semesid} belum tersedia..`)
       }else{
         done(rows);
       }
    });
}

app.post('/api/mhs/jadwal', function(req, res) {
  if (!req.body.mhsNim || !req.body.sempId) {
    return res.status(400).json({status:"You must send the mhsNim and the sempId"});
  }
  var krsMhsNiu = req.body.mhsNim;
  var sempSemId = req.body.sempId;
  db.get().query(`SELECT
         jdkulHari AS hari,
         jdkulJamMulai AS sesi_mulai,
         jdkulJamSelesai AS sesi_selesai,
         ruNama AS ruang,
         klsId,
         klsNama AS klsNama ,
         mkkurKode AS kodeMk ,
         mkkurNamaresmi AS namaresmi,
         TRIM(CONCAT(IFNULL(PA.pegGelarDepan,''),' ',IF(PA.pegGelarBelakang='',PA.pegNama,CONCAT_WS(', ', PA.pegNama, PA.pegGelarBelakang)))) AS Dosen,
         dsnkDsnPegNip
      FROM s_jadwal_kuliah
       LEFT JOIN e_ruang ON ruId = jdkulRuId
      INNER JOIN s_kelas ON jdkulKlsId = klsId
      LEFT JOIN s_krs_detil ON krsdtKlsId = klsId
      LEFT JOIN s_krs ON krsdtKrsId = krsId
      LEFT JOIN s_semester_prodi ON krsSempId = sempId
      LEFT JOIN s_matakuliah_kurikulum ON klsMkkurId = mkkurId
      LEFT JOIN s_dosen_kelas ON dsnkKlsId = jdkulKlsId
      LEFT JOIN pegawai PA ON dsnkDsnPegNip=PA.pegNip
      WHERE sempSemId = ${sempSemId} AND krsMhsNiu = ${krsMhsNiu}`,
    function(err, result){
    if (err) throw err;
    let row = result[0];
    if(!row){
      return res.status(400).json({status:"data tidak ditemukan"});
    }
    res.status(200).json({
      status : "200",
      message : "berhasil mendapatkan data ",
      data : result,

    });
  });
});


app.get('/api/list/kodematkul', function(req, res) {
  getKodeMatkul(function(result) {
      res.status(200).json({
        status : "200",
        message : "berhasil mendapatkan data",
        data : result,
      });
  });
});

//tahun terbaru token
app.get('/api/list/matkul', function(req, res) {
  getDaftarMatkul(function(result) {
      res.status(200).send(result);
  });
});

//tahun terbaru tanpa token
app.get('/api/list/matkulx', function(req, res) {
  getDaftarMatkul(function(result) {
      res.status(200).send(result);
  });
});

//tahun 20151 token
app.use('/api/list/matkul/2015', jwtCheck);
app.get('/api/list/matkul', function(req, res) {
  getDaftarMatkulx(function(result) {
      res.status(200).send(result);
  });
});

//tahun 20151 tanpa token
app.get('/api/list/matkul/2015x', function(req, res) {
  getDaftarMatkulx(function(result) {
      res.status(200).send(result);
  });
});
