var mysql = require('mysql');
var pool  = null;

exports.connect = function() {
  pool = mysql.createPool({
    host     : '139.99.7.216',
    user     : 'yuswee',
    password : 'Yuyuyu14',
    database : 'uinsgd_gtakademik_portal'
  });
}

exports.get = function() {
  return pool;
}
