var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db');
var app = module.exports = express.Router();
var jwtCheck = jwt({
  secret: config.secretKey
});


app.post('/api/date/aktifsidang', function(req, res) {
  if (!req.body.nama_sidang || !req.body.id_jurusan) {
    return res.status(400).json({Status:"You must send the nama_sidang and the id_jurusan"});
  }
  var nama_sidang = req.body.nama_sidang;
  var id_jurusan = req.body.id_jurusan;
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = 07;

  db.get().query(`SELECT bulan_aktif_id, tgl_mulai,tgl_akhir
                  FROM bulan_sidang
                  WHERE YEAR(tgl_mulai)= ${tahun} AND MONTH(tgl_mulai)=${bulan}
                  AND id_jurusan=${id_jurusan} AND nama_sidang='${nama_sidang}'`,
    function(err, result){
    if (err) throw err;
    let row = result[0];
	if(!row){
      return res.status(400).json({Status:"Data tidak ditemukan"});
    }
    var mulai = row.tgl_mulai ;
    var selesai = row.tgl_akhir;
    var bln_id = row.bulan_aktif_id;

    var tahunc = date.getFullYear();
    var bulanc = date.getMonth();
    var tglc = date.getDate();

    var tahuns = selesai.getFullYear();
    var bulans = selesai.getMonth();
    var tgls = selesai.getDate();

    if ((tgls < tglc) && (bulans == bulanc) && (tahuns == tahunc)){
      var status = 'tidak aktif';
    }else if((tgls >= tglc) && (bulans == bulanc) && (tahuns == tahunc)){
      var status = 'aktif';
    }else {
      var status = 'bulan atau tahun yang berbeda';
    }

    res.status(200).json({
      sekarang : date,
      bulan_aktif_id :bln_id,
      tgl_mulai : mulai,
      tgl_selesai : selesai,
      Status : status

    });
  });
});

function getDateKrs(done){
    var date = new Date();
    var tahun = date.getFullYear();
    var bulan = date.getMonth()+1;
    if(bulan<10){
        bulan='0'+bulan;
    }
    db.get().query('SELECT sempProdiKode,sempTanggalKrsMulai, sempTanggalKrsSelesai,sempTanggalRevisiMulai,sempTanggalRevisiSelesai FROM s_semester_prodi WHERE sempProdiKode=705 AND sempIsAktif=1',
    function(err, rows){
        if (err) throw err;
        let row = rows[0];
        if(!row){
            done(`Data Tidak Ditemukan`)
        }
        else{
            done(rows);
        }
    });
}

function getDateDaftarSdg(done){
    var date = new Date();
    var tahun = date.getFullYear();
    var bulan = date.getMonth()+1;
    if(bulan<10){
        bulan='0'+bulan;
    }
    db.get().query(`SELECT bulan_aktif_id, id_jurusan, jurusan, nama_sidang,tgl_mulai,tgl_akhir,tgl_seminar
                    FROM bulan_sidang LEFT JOIN kode_jurusan_fak ON id_jurusan=kode_jurusan
                    WHERE YEAR(tgl_mulai)= ${tahun} AND MONTH(tgl_mulai)=${bulan}`,
    function(err, rows){
        if (err) throw err;
        let row = rows[0];
        if(!row){
            done(`Data pada bulan = ${bulan} - ${tahun} tidak ditemukan..`)
        }
        else{
            done(rows);
        }
    });
}

app.use('/api/date/krs', jwtCheck);
app.get('/api/date/krs', function(req, res) {
  getDateKrs(function(result) {
      res.status(200).send(result);
  });
});

app.use('/api/date/daftarsidang', jwtCheck);
app.get('/api/date/daftarsidang', function(req, res) {
  getDateDaftarSdg(function(result) {
      res.status(200).send(result);
  });
});

//-----------------  test ----------------------

function getDateDaftarSdgx(done){
    var date = new Date();
    var tahun = date.getFullYear();
    var bulan = 07;

    db.get().query(`SELECT bulan_aktif_id, id_jurusan, jurusan, nama_sidang,tgl_mulai,tgl_akhir,tgl_seminar
                    FROM bulan_sidang LEFT JOIN kode_jurusan_fak ON id_jurusan=kode_jurusan
                    WHERE YEAR(tgl_mulai)= ${tahun} AND MONTH(tgl_mulai)=${bulan}`,
    function(err, rows){
        if (err) throw err;
        let row = rows[0];
        if(!row){
            done(`Data pada bulan = ${bulan} - ${tahun} tidak ditemukan..`)
        }
        else{
            done(rows);
        }
    });
}

app.get('/api/date/daftarsidangx', function(req, res) {
  getDateDaftarSdgx(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/date/krsx', function(req, res) {
  getDateKrs(function(result) {
      res.status(200).send(result);
  });
});
