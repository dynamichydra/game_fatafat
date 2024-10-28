let mysql = require('mysql');
let config = require('config');
var connection;

async function connectToDatabase() {
    return new Promise(async function (result) {
        if (!connection) {
            console.log(1)
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

            sqlClient.getConnection(function (err, con) {
                if (err){
                    console.log(err);
                    throw err;
                }
                connection = con;
                result(connection)
            });
        }else{
            console.log(2)
            result(connection)
        }
    });
}

// global.connectToDatabase =  connectToDatabase;
module.exports = connectToDatabase;