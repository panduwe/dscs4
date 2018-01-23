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

app.use('/api/daftar/kolo', jwtCheck);
app.post('/api/daftar/kolo', function(req, res) {
  if (!req.body.id_jadwal) {
    return res.status(400).json({status:"You must send the id jadwal"});
  }

      daftarkolo = {
        id_jadwal: req.body.id_jadwal,
        kode_jurusan: req.body.kode_jurusan,
        pembimbing_1 : req.body.pembimbing_1,
        pembimbing_2 : req.body.pembimbing_2,
        judul_skripsi : req.body.judul_skripsi,
        nim : req.body.nim,
        tgl : req.body.tgl,

      };
      db.get().query('INSERT INTO kolokium SET ?', [daftarkolo], function(err, result){
        if (err) throw err;
        res.status(200).json({
          status : 'Data Berhasil disimpan'
        });
      });
  });

  app.use('/api/daftar/kompre', jwtCheck);
  app.post('/api/daftar/kompre', function(req, res) {
    if (!req.body.id_jadwal) {
      return res.status(400).json({status:"You must send the id jadwal"});
    }

        daftarkompre = {
          id_jadwal: req.body.id_jadwal,
          kode_jurusan: req.body.kode_jurusan,
          nim : req.body.nim,
          tgl : req.body.tgl,

        };
        db.get().query('INSERT INTO kompre SET ?', [daftarkompre], function(err, result){
          if (err) throw err;
          res.status(200).json({
            status : 'Data Berhasil disimpan'
          });
        });
    });

app.use('/api/daftar/kp', jwtCheck);
app.post('/api/daftar/kp', function(req, res) {
  if (!req.body.id_jadwal) {
    return res.status(400).json({status:"You must send the id jadwal"});
  }
  daftarkp = {
    id_jadwal: req.body.id_jadwal,
    kode_jurusan: req.body.kode_jurusan,
    pembimbing_per : req.body.pembimbing_per,
    pembimbing_kam : req.body.pembimbing_kam,
    judul_kp : req.body.judul_kp,
    nim : req.body.nim,
    tgl : req.body.tgl,
    nama_perusahaan : req.body.nama_perusahaan,
    no_telp_perusahaan : req.body.no_telp_perusahaan,
    alamat_perusahaan : req.body.alamat_perusahaan,
  };
  db.get().query('INSERT INTO kp SET ?', [daftarkp], function(err, result){
      if (err) throw err;
      res.status(200).json({
          status : 'Data Berhasil disimpan'
      });
  });
});

app.use('/api/daftar/muna', jwtCheck);
app.post('/api/daftar/muna', function(req, res) {
  if (!req.body.id_jadwal) {
    return res.status(400).json({status:"You must send the id jadwal"});
  }
  daftarmuna = {
    id_jadwal: req.body.id_jadwal,
    kode_jurusan: req.body.kode_jurusan,
    pembimbing_1 : req.body.pembimbing_1,
    pembimbing_2 : req.body.pembimbing_2,
    judul_skripsi : req.body.judul_skripsi,
    nim : req.body.nim,
    tgl : req.body.tgl,
  };
  db.get().query('INSERT INTO muna SET ?', [daftarmuna], function(err, result){
      if (err) throw err;
      res.status(200).json({
          status : 'Data Berhasil disimpan'
      });
  });
});

app.use('/api/daftar/proposal', jwtCheck);
app.post('/api/daftar/proposal', function(req, res) {
  if (!req.body.id_jadwal) {
    return res.status(400).json({status:"You must send the id jadwal"});
  }
  daftarproposal = {
    id_jadwal: req.body.id_jadwal,
    kode_jurusan: req.body.kode_jurusan,
    judul_proposal : req.body.judul_proposal,
    nim : req.body.nim,
    tgl : req.body.tgl,
  };
  db.get().query('INSERT INTO proposal SET ?', [daftarproposal], function(err, result){
      if (err) throw err;
      res.status(200).json({
          status : 'Data Berhasil disimpan'
      });
  });
});


//------------------test------------------

app.post('/api/daftar/kolox', function(req, res) {
  if (!req.body.id_jadwal || !req.body.kode_jurusan || !req.body.pembimbing_1 || !req.body.pembimbing_2 || !req.body.judul_skripsi || !req.body.nim) {
    return res.status(400).send("You must send the id_jadwal,kode_jurusan,pembimbing_1,pembimbing_2,judul_skripsi,nim ");
  }
  var date = new Date();

      daftarkolo = {
        id_jadwal: req.body.id_jadwal,
        kode_jurusan: req.body.kode_jurusan,
        pembimbing_1 : req.body.pembimbing_1,
        pembimbing_2 : req.body.pembimbing_2,
        judul_skripsi : req.body.judul_skripsi,
        nim : req.body.nim,
        tgl : date,

      };
      db.get().query('INSERT INTO kolokium SET ?', [daftarkolo], function(err, result){
        if (err) throw err;
        res.status(200).json({
          status : 'Data Berhasil disimpan'
        });
      });
  });

  app.post('/api/daftar/komprex', function(req, res) {
    if (!req.body.id_jadwal || !req.body.kode_jurusan || !req.body.nim) {
    return res.status(400).send("You must send the id_jadwal,kode_jurusan,nim ");
  }
    var date = new Date();

        daftarkompre = {
          id_jadwal: req.body.id_jadwal,
          kode_jurusan: req.body.kode_jurusan,
          nim : req.body.nim,
          tgl : date,

        };
        db.get().query('INSERT INTO kompre SET ?', [daftarkompre], function(err, result){
          if (err) throw err;
          res.status(200).json({
            status : 'Data Berhasil disimpan'
          });
        });
    });

app.post('/api/daftar/kpx', function(req, res) {
  if (!req.body.id_jadwal || !req.body.kode_jurusan || !req.body.pembimbing_per || !req.body.pembimbing_kam || !req.body.judul_kp || !req.body.nim || !req.body.nama_perusahaan || !req.body.no_telp_perusahaan || !req.body.alamat_perusahaan) {
    return res.status(400).send("You must send the id_jadwal,kode_jurusan,pembimbing_per,pembimbing_kam,judul_kp,nim, nama_perusahaan, no_telp_perusahaan, alamat_perusahaan ");
  }
  var date = new Date();
  daftarkp = {
    id_jadwal: req.body.id_jadwal,
    kode_jurusan: req.body.kode_jurusan,
    pembimbing_per : req.body.pembimbing_per,
    pembimbing_kam : req.body.pembimbing_kam,
    judul_kp : req.body.judul_kp,
    nim : req.body.nim,
    tgl : date,
    nama_perusahaan : req.body.nama_perusahaan,
    no_telp_perusahaan : req.body.no_telp_perusahaan,
    alamat_perusahaan : req.body.alamat_perusahaan,
  };
  db.get().query('INSERT INTO kp SET ?', [daftarkp], function(err, result){
      if (err) throw err;
      res.status(200).json({
          status : 'Data Berhasil disimpan'
      });
  });
});

app.post('/api/daftar/munax', function(req, res) {
  if (!req.body.id_jadwal || !req.body.kode_jurusan || !req.body.pembimbing_1 || !req.body.pembimbing_2 || !req.body.judul_skripsi || !req.body.nim) {
    return res.status(400).send("You must send the id_jadwal,kode_jurusan,pembimbing_1,pembimbing_2,judul_skripsi,nim");
  }
  var date = new Date();
  daftarmuna = {
    id_jadwal: req.body.id_jadwal,
    kode_jurusan: req.body.kode_jurusan,
    pembimbing_1 : req.body.pembimbing_1,
    pembimbing_2 : req.body.pembimbing_2,
    judul_skripsi : req.body.judul_skripsi,
    nim : req.body.nim,
    tgl : date,
  };
  db.get().query('INSERT INTO muna SET ?', [daftarmuna], function(err, result){
      if (err) throw err;
      res.status(200).json({
          status : 'Data Berhasil disimpan'
      });
  });
});

app.post('/api/daftar/proposalx', function(req, res) {
  if (!req.body.id_jadwal || !req.body.kode_jurusan || !req.body.judul_proposal || !req.body.nim) {
    return res.status(400).send("You must send the id_jadwal,kode_jurusan,judul_proposal,nim");
  }
  var date = new Date();
  daftarproposal = {
    id_jadwal: req.body.id_jadwal,
    kode_jurusan: req.body.kode_jurusan,
    judul_proposal : req.body.judul_proposal,
    nim : req.body.nim,
    tgl : date,
  };
  db.get().query('INSERT INTO proposal SET ?', [daftarproposal], function(err, result){
      if (err) throw err;
      res.status(200).json({
          status : 'Data Berhasil disimpan'
      });
  });
});
