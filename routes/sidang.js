var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('../config'),
    db      = require('../db');


var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secretKey
});


function getSidangKpDB(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = date.getMonth()+1;
  if(bulan<10){
      bulan='0'+bulan;
  }
    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, judul_kp, tgl, tgl_sidang, waktu_sidang, ruangan
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN kp ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getSidangKompreDB(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = date.getMonth()+1;
  if(bulan<10){
      bulan='0'+bulan;
  }
    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, tgl, tgl_sidang, waktu_sidang, ruangan, penguji_1, penguji_2, penguji_3
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN kompre ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getSidangJudulDB(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = date.getMonth()+1;
  if(bulan<10){
      bulan='0'+bulan;
  }
    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, judul_proposal, tgl, tgl_sidang, waktu_sidang, ruangan, penguji
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN proposal ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getSidangKoloDB(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = date.getMonth()+1;
  if(bulan<10){
      bulan='0'+bulan;
  }
    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, judul_skripsi, tgl, tgl_sidang, waktu_sidang, ruangan,
                    penguji_1, penguji_2, pembimbing_1, pembimbing_2
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN kolokium ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getSidangMunaDB(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = date.getMonth()+1;
  if(bulan<10){
      bulan='0'+bulan;
  }
    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, judul_skripsi, tgl, tgl_sidang, waktu_sidang, ruangan,
                    penguji_1, penguji_2, pembimbing_1, pembimbing_2
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN muna ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`,
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


app.use('/api/sidang/kp', jwtCheck);
app.get('/api/sidang/kp', function(req, res) {
  getSidangKpDB(function(result) {
      res.status(200).send(result);
  });
});

app.use('/api/sidang/kompre', jwtCheck);
app.get('/api/sidang/kompre', function(req, res) {
  getSidangKompreDB(function(result) {
      res.status(200).send(result);
  });
});

app.use('/api/sidang/judul', jwtCheck);
app.get('/api/sidang/judul', function(req, res) {
  getSidangJudulDB(function(result) {
      res.status(200).send(result);
  });
});

app.use('/api/sidang/kolo', jwtCheck);
app.get('/api/sidang/kolo', function(req, res) {
  getSidangKoloDB(function(result) {
      res.status(200).send(result);
  });
});

app.use('/api/sidang/muna', jwtCheck);
app.get('/api/sidang/muna', function(req, res) {
  getSidangMunaDB(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/kpx', function(req, res) {
  getSidangKpDB(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/komprex', function(req, res) {
  getSidangKompreDB(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/judulx', function(req, res) {
  getSidangJudulDB(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/kolox', function(req, res) {
  getSidangKoloDB(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/munax', function(req, res) {
  getSidangMunaDB(function(result) {
      res.status(200).send(result);
  });
});



//================================== test app =============================================

function getSidangKpDBx(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = 05;

    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, judul_kp, tgl, tgl_sidang, waktu_sidang, ruangan
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN kp ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getSidangKompreDBx(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = 05;

    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, tgl, tgl_sidang, waktu_sidang, ruangan, penguji_1, penguji_2, penguji_3
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN kompre ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getSidangJudulDBx(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = 05;

    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, judul_proposal, tgl, tgl_sidang, waktu_sidang, ruangan, penguji
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN proposal ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getSidangKoloDBx(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = 05;

    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, judul_skripsi, tgl, tgl_sidang, waktu_sidang, ruangan,
                    penguji_1, penguji_2, pembimbing_1, pembimbing_2
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN kolokium ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}

function getSidangMunaDBx(done){
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = 06;

    db.get().query(`select mhsNiu, mhsNama, mhsEmail, prodiNamaResmi, judul_skripsi, tgl, tgl_sidang, waktu_sidang, ruangan,
                    penguji_1, penguji_2, pembimbing_1, pembimbing_2
                    from mahasiswa
                    JOIN program_studi ON mhsProdiKode=prodiKode
                    JOIN muna ON nim=mhsNiu
                    where YEAR(tgl)= ${tahun} AND MONTH(tgl)=${bulan}`, function(err, rows) {
        if (err) throw err;
        let row = rows[0];
        if(!row){
         done(`data pada bulan = ${bulan} - ${tahun} not found..`)
       }else{
         done(rows);
       }
    });
}


app.get('/api/sidang/kpxx', function(req, res) {
  getSidangKpDBx(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/komprexx', function(req, res) {
  getSidangKompreDBx(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/judulxx', function(req, res) {
  getSidangJudulDBx(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/koloxx', function(req, res) {
  getSidangKoloDBx(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/sidang/munaxx', function(req, res) {
  getSidangMunaDBx(function(result) {
      res.status(200).send(result);
  });
});
