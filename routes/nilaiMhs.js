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

app.post('/api/nilai/matkul', function(req, res) {
  if (!req.body.mhsNim || !req.body.kode_matkul) {
    return res.status(400).json({status:"You must send the mhsNim and the kode_matkul"});
  }
  var krsMhsNiu = req.body.mhsNim;
  var vmktwkrsMkkurKode = req.body.kode_matkul;
  db.get().query(`SELECT
            vmktwkrsJumlahSksKrs AS sks_jumlah,
            COALESCE(krsdtKodeNilai,0) AS nilai,
            COALESCE(krsdtBobotNilai,0) AS bobot_nilai
         FROM s_krs_detil
            LEFT JOIN s_krs ON krsId = krsdtKrsId
            LEFT JOIN s_v_matakuliah_ditawarkan_krs ON krsdtVmktwkrsId = vmktwkrsId
         WHERE krsMhsNiu = ${krsMhsNiu} AND krsdtIsBatal = 0 AND krsApprovalke > 0
         AND vmktwkrsMkkurKode ='${vmktwkrsMkkurKode}'`,
    function(err, result){
    if (err) throw err;
    let row = result[0];
    if(!row){
      return res.status(400).json({status:"data tidak ditemukan"});
    }
    res.status(200).json({
      status : "200",
      message : "berhasil mendapatkan data ",
      sks_jumlah : row.sks_jumlah,
      nilai : row.nilai,
      bobot_nilai : row.bobot_nilai,

    });
  });
});