
const mysql = require('mysql2');
const db = mysql.createPool({
    host: '172.16.0.100',
    user: 'username',
    password: 'password',
    port: 3307,
    database: 'fleet',
    connectionLimit: 10,
    waitForConnections: true
  });

export { db }