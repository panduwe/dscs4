var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken'),
    ejwt    = require('express-jwt'),
    db      = require('../db');
    db      = require('../db2');

var app = module.exports = express.Router();

var jwtCheck = ejwt({
  secret: config.secretKey
});

function createToken(user) {
  return jwt.sign(_.omit(user, 'tusrPassword'), config.secretKey, { expiresIn: 60*60*5 });
}

function getUserDB(tusrNama, done) {
  db.get().query('SELECT tusrNama, tusrPassword, tusrProfil, mhsStakmhsrKode FROM uinsgd_gtakademik_portal.t_user p LEFT JOIN uinsgd_gtakademik.mahasiswa a ON p.tusrNama=a.mhsNiu WHERE p.tusrNama = ? LIMIT 1', [tusrNama], function(err, rows, fields) {
    if (err) throw err;
    //console.log(rows[0]);
    done(rows[0]);
  });
}

app.post('/api/mhs/login', function(req, res) {
  if (!req.body.tusrNama || !req.body.tusrPassword) {
    return res.status(400).json({status:"You must send the username and the password"});
  }

  getUserDB(req.body.tusrNama, function(user){
    if (!user) {
      return res.status(400).json({status:"The username is not existing"});
    }

    if (user.tusrPassword !== req.body.tusrPassword) {
      return res.status(400).json({status:"The username or password don't match"});
    }

    if (user.tusrPassword !== req.body.tusrPassword) {
      return res.status(400).json({status:"The username or password don't match"});
    }

    if (user.mhsStakmhsrKode !=='A' ) {
      return res.status(400).json({status:"You are not eligible to enter this Portal"});
    }

    res.status(200).json({
      status : 'Berhasil',
      nim : user.tusrNama,
      nama : user.tusrProfil,
      id_token: createToken(user)
    });

  });
});

app.post('/api/alm/login', function(req, res) {
  if (!req.body.tusrNama || !req.body.tusrPassword) {
    return res.status(400).json({status:"You must send the username and the password"});
  }

  getUserDB(req.body.tusrNama, function(user){
    if (!user) {
      return res.status(400).json({status:"The username is not existing"});
    }

    if (user.tusrPassword !== req.body.tusrPassword) {
      return res.status(400).json({status:"The username or password don't match"});
    }

    if (user.tusrPassword !== req.body.tusrPassword) {
      return res.status(400).json({status:"The username or password don't match"});
    }

    if (user.mhsStakmhsrKode !=='L' ) {
      return res.status(400).json({status:"You are not eligible to enter this Portal"});
    }

    res.status(200).json({
      status : 'Berhasil',
      nim : user.tusrNama,
      nama : user.tusrProfil,
      id_token: createToken(user)
    });

  });
});
