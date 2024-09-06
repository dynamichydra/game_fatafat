let mysql = require('mysql');
let config = require('config');
let connection;

async function connectToDatabase() {
    return new Promise(async function (result) {
        if (!connection) {
            let sqlClient = mysql.createPool({
                host: config.get('db.mysql.host'),
                user: config.get('db.mysql.user'),
                password: config.get('db.mysql.pass'),
                port: config.get('db.mysql.port'),
                connectionLimit: 100,
                acquireTimeout: 60000,
                idleTimeoutMillis:60000,
                debug: false,
                timezone: 'Asia/Kolkata',
                database: config.get('db.mysql.dbname')
            });

            sqlClient.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    throw err;
                }
                // db = connection;
                result(connection)
            });
        }else{
            result(connection)
        }
    });
}

// global.connectToDatabase =  connectToDatabase;
module.exports = connectToDatabase;