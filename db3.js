var mysql = require('mysql');
var pool  = null;

exports.connect = function() {
  pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'pendafta_db'
  });
}

exports.get = function() {
  return pool;
}
