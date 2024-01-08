const sqlite3 = require('sqlite3').verbose();
exports.lib = {
    init : function(userId, task, data){
        var _ = this;
        switch(task){
            case 'get':
                return new Promise(async function (result) {
                    _.getData(userId, data,function(res){
                        result(res);
                    });
                });
            case 'set':
                return new Promise(async function (result) {
                    _.setData(userId, data,function(res){
                        result(res);
                    });
                });
            default:
                return new Promise( function(resolve,reject) {
                    reject({SUCCESS:false, MESSAGE:'Hello World'});
                });
        }
    },
    getData : async function(userId, data,cb){
        let db = new sqlite3.Database('./db/tournament_manager.db', (err) => {
            if (err) {
              return console.error(err.message);
            }
          });
          let sql = `SELECT * FROM tournament ORDER BY ID`;

            db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row.name);
            });
            return cb(rows);
            });
          db.close();
          
    },
    setData : async function(userId, data,cb){
        let db = new sqlite3.Database('./db/tournament_manager.db', (err) => {
            if (err) {
              return console.error(err.message);
            }
          });
          var key = [],val = [];
          for (const k in data) {
            key.push("`"+k+"`");
            val.push("'"+data[k]+"'");
          }
          let sql = `INSERT INTO tournament (${key.toString()})
            VALUES( ${val.toString()});`;
            console.log(sql);
            db.run(sql, function(err) {
                if (err) {
                  console.log(err.message);
                  return cb(err.message);
                }
                return cb(this.lastID);
              });
          db.close();
          
    },
};