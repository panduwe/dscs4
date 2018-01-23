var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db2');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secretKey
});

function cekMhs(nim, done){
    db.get().query(`SELECT mhsNiu,mhsNama FROM mahasiswa WHERE mhsNiu='${nim}'`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data ${nim} not found..`)
          }else{
              done(rows);
          }
        }
   );
}

function cekMhsReg(nim, done){
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
    db.get().query(`SELECT COUNT(mhsregMhsNiu) AS JUMLAH
     FROM mahasiswa_registrasi
     WHERE mhsregMhsNiu = ${nim} AND mhsregSemId = ${semesid}`,
        function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data ${nim} not found..`)
        }else{
            done(rows);
        }
    });
}


function getProfilMhsDB(nim, done){
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
		  mhsStakmhsrKode,
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
          mhsNiu='${nim}'
          LIMIT 1
         `, function(err, rows) {
        if (err) throw err;
		let row = rows[0];
		if(!row){
			done(`Data Tidak Ditemukan`)
		}
        done(rows);
    });
}

function getProfilAlm(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = date.getMonth()+1;
  if(bulan<10){
      bulan='0'+bulan;
  }
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
          YEAR(mhsTanggalLulus)= ${tahun} AND MONTH(mhsTanggalLulus)=${bulan}`,
        function(err, rows) {
          if (err) throw err;
          let row = rows[0];
          if(!row){
           done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getAllMhs(done){
    db.get().query(`SELECT    mhsNiu,
          mhsNama,
          mhsJenisKelamin,
          mhsEmail,
          prodiNamaResmi,
          mhsAngkatan,
		  FORMAT(mhsIpkTranskrip,2) AS IPK,
		  mhsStakmhsrKode,
          TRIM(CONCAT(IFNULL(PA.pegGelarDepan,''),' ',IF(PA.pegGelarBelakang='',PA.pegNama,CONCAT_WS(', ', PA.pegNama, PA.pegGelarBelakang)))) AS dosen_pa
          FROM mahasiswa
          LEFT JOIN program_studi ON mhsProdiKode=prodiKode
          LEFT JOIN pegawai PA ON mhsDsnPegNipPembimbingAkademik=PA.pegNip
          WHERE
          mhsProdiKode=705`,
          function(err, rows) {
        if (err) throw err;
        done(rows);
    });
}

//------------------

app.use('/api/mhs/if', jwtCheck);
app.get('/api/mhs/if', function(req, res) {
  getAllMhs(function(result) {
      res.status(200).send(result);
  });
});



app.post('/api/mhs/cekmhs', function(req, res) {
  if (!req.body.mhsNiu) {
    return res.status(400).json({status:"You must send the mhsNiu"});
  }
  cekMhs(req.body.mhsNiu,function(result) {
    res.status(200).json({
      status : "200",
      pesan : "berhasil mendapatkan nama mahasiswa",
      hasil : result,
    });
  });
});

app.post('/api/mhs/cekmhsreg', function(req, res) {
  cekMhsReg(req.body.mhsNiu,function(result) {
    res.status(200).json({
      Data : result,
    });
  });
});

app.use('/api/profilMhs', jwtCheck);
app.post('/api/profilMhs', function(req, res) {
  if (!req.body.mhsNiu) {
    return res.status(400).json({status:"You must send the mhsNiu"});
  }
  getProfilMhsDB(req.body.mhsNiu,function(result) {
      res.status(200).send(result);
  });
});

//app.use('/api/profilAlm', jwtCheck);
app.get('/api/profilAlm', function(req, res) {
  getProfilAlm(function(result) {
      res.status(200).send(result);
  });
});

//===========================================================

app.post('/api/profilMhsx', function(req, res) {
  if (!req.body.mhsNiu) {
    return res.status(400).json({status:"You must send the mhsNiu"});
  }
  getProfilMhsDB(req.body.mhsNiu,function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/profilAlmx', function(req, res) {
  getProfilAlm(function(result) {
      res.status(200).send(result);
  });
});
