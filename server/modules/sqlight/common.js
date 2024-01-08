const sqlite3 = require('sqlite3').verbose();
const moment =  require('moment');
require('../../corefunction');
let config = require('config');
exports.init = {
  tableConfig:config.get("TABLE_DEFINITION"),
  db : new sqlite3.Database(config.get('SQLight_PATH'), (err) => {
      if (err) {
        console.log(err);
      }
  }),
  checkColumnExists: function(type, column){
    if(this.tableConfig[type] && this.tableConfig[type].includes(column)){
      return true;
    }else{
      return false;
    }
  },
    getData : async function( type, data){
      let __ = this;
      return new Promise(async function (result) {
        let isId = false;
        let cnd = " WHERE 1 ";
        if(data.where){
            for (const k in data.where) {
              if(!isId && data.where[k].key == 'ID')isId=true;
                let key = data.where[k].key.split(".");
                key = key[1]??key[0];
                switch(data.where[k].operator){
                    case "isnot":
                      if(data.where[k] == null || data.where[k] =='null' || data.where[k]=='undefined'){
                        cnd += " AND `"+key+"` != "+data.where[k].value+" ";
                      }else{
                        cnd += " AND `"+key+"` != '"+data.where[k].value+"' ";
                      }
                        break;
                    case "higher":
                      cnd += " AND `"+key+"` > '"+data.where[k].value+"' ";
                        break;
                    case "lower":
                        cnd += " AND `"+key+"` < '"+data.where[k].value+"' ";
                        break;
                    case "lower-equal":
                        break;
                    case "higher-equal":
                        break;
                    case "in":
                      cnd += " AND `"+key+"` IN ("+data.where[k].value+") ";
                        break;
                    case "notin":
                        break;
                    case "isnull":
                        cnd += " AND `"+key+"` IS NULL ";
                        break;
                    case "like":
                        cnd += " AND `"+key+"` LIKE '%"+data.where[k].value+"%' ";
                        break;
                    default:
                        cnd += " AND `"+key+"` = '"+data.where[k].value+"' ";
                        break;
                }
            }
        }
        let sql = `SELECT * FROM ${type} ${cnd} ORDER BY ID`;
        console.log(sql);
        __.db.all(sql, [], (err, rows) => {
            if (err) {
              result({SUCCESS:false,MESSAGE:err.message});
            }
            if(type == 'age'){
              let agerows = rows.map(async (a)=> {
                let wt = await __.getData('weight',{where:[{
                  key: 'AGEGROUP_ID',
                  operator: 'is',
                  value: a.ID
                }]});
                a.EVENT_WEIGHTCATEGORY = wt.SUCCESS?wt.MESSAGE:[];
                return a;
              });
              Promise.all(agerows).then(dataArray =>{   
                if (isId) {
                  if(dataArray.length == 0){
                    result({SUCCESS:false,MESSAGE:"Object or owner can not be found."});
                  }else{
                    result({SUCCESS:true,MESSAGE:dataArray[0]});
                  }
                }else{
                  result({SUCCESS:true,MESSAGE:dataArray});
                }
                
              });
              
            }else{
              if (isId) {
                if(rows.length == 0){
                  result({SUCCESS:false,MESSAGE:"Object or owner can not be found."});
                }else{
                  result({SUCCESS:true,MESSAGE:rows[0]});
                }
              }else{
                result({SUCCESS:true,MESSAGE:rows});
              }
              result({SUCCESS:true,MESSAGE:rows});
            }
            
        });
        // __.db.close();
      });
    },
    
    setData : async function(type, data){
      let __ = this;
      let doSync = data.sync ?? true;
      delete data.sync;

      let eventId = null;
      if(doSync){
        if(data.EVENT_ID){
          // use event id from data
          eventId = data.EVENT_ID ?? null
        }else{
          // get data to save the eventId
          let params = {
            where:[{key:'ID', operator:'is', value:data.ID}]
          };
          const syncDataResult = await __.getData(type, params);
          if(syncDataResult.SUCCESS){
            eventId = syncDataResult.MESSAGE.EVENT_ID;
          }
        }
      }

      return new Promise(async function (result) {
        let key = [],val = [], sql = null;
        if(data.conncet_dokume || data.conncet_dokume ==0)delete data.conncet_dokume;
        if( data.ID){
          for (const k in data) {
            // check if column exists
            if(!__.checkColumnExists(type, k)){
              console.log(`Column ${k} does not exist in ${type}`);
              continue;
            }
            if(k == "ID"){
              key.push("`"+k+"`='"+data[k]+"'");
            }else{
              if(data[k] == null || data[k] =='null' || data[k]=='undefined'){
  
                val.push("`"+k+"`=null");
              }else{
                val.push("`"+k+"`='"+data[k]+"'");
              }
            }
          }

          sql = `UPDATE ${type} SET ${val.toString()} WHERE ${key.toString()} `;
        }else{
          for (const k in data) {
            if(!__.checkColumnExists(type, k)){
              console.log(`Column ${k} does not exist in ${type}`);
              continue;
            }
            key.push("`"+k+"`");
            if(data[k] == null || data[k] =='null' || data[k]=='undefined'){
              val.push('null');
            }else{
              val.push("'"+data[k]+"'");
            }
          }
          sql = `INSERT INTO ${type} (${key.toString()}) VALUES( ${val.toString()});`;
        }
        
        //console.log(sql)
        __.db.run(sql, function(err) {
          let resData = null;
            if (err) {
              result({SUCCESS:false,MESSAGE:err.message});
            }else if(data.ID){
              result({SUCCESS:true,MESSAGE:data.ID})
            }else{
              result({SUCCESS:true,MESSAGE:this.lastID});
            }
            
        });
        // __.db.close();
      }).then(res=>{
        //console.log({res});
        if(type != 'dokume_sync'){
          if(res.SUCCESS && doSync){
            __.setData('dokume_sync', {
              table_name: type,
              ref_id: res.MESSAGE,
              status:0,
              operation:'saveObject',
              created:__.current_timestamp(),
              eventId: eventId
            });
          }
        }
        return res;
      });
    },

    setDelete : async function(type, data){
      let __ = this;
      let doSync = data.sync ?? true;
      delete data.sync;
      
      let eventId = null;
      let dokumeId = null;
      if(doSync){
        // get data to save the eventId
        let params = {
          where:[{key:'ID', operator:'is', value:data.ID}]
        };
        const syncDataResult = await __.getData(type, params);
        if(syncDataResult.SUCCESS){
          eventId = syncDataResult.MESSAGE.EVENT_ID;
          dokumeId = syncDataResult.MESSAGE.DOKUME_ID;
        }
      }
      return new Promise(async function (result) {
        let cnd = " 1 ";
        for (const k in data) {
          cnd += " AND `"+k+"`= '"+data[k]+"' ";
        }
        let sql = `DELETE FROM ${type} WHERE ${cnd}`;
        __.db.run(sql, function(err) {
          let resData = null;
            if (err) {
              resData = err.message;
            }else{
              resData = 'Ok';
            }
            result({SUCCESS:true,MESSAGE:resData});
        });
        // __.db.close();
      }).then(res=>{
        if(type != 'dokume_sync' && type != 'events'){
         // console.log({res});
          if(res.SUCCESS && doSync && dokumeId){
            __.setData('dokume_sync', {
              table_name: type,
              ref_id: dokumeId,
              status:0,
              operation:'deleteObject',
              created:__.current_timestamp(),
              eventId:eventId
            });
          }
        }
        return res;
      });
    },

    patchRequest : async function(type, data){
      let __ = this;
      return new Promise(async function (result) {
        let resMsg = [];
        for(let i in data){
          let tmp = {};
          //console.log(data[i])
          switch (data[i].BACKEND_ACTION){
            case 'delete':
              tmp[data[i].ID_RESPONSE] = await __.setDelete(type,{ID:data[i].ID});
              resMsg.push(tmp);
              break;
            case 'get':
              tmp[data[i].ID_RESPONSE] = await __.getData(type,{where:[{key: 'ID',
                    operator: 'is',
                    value: data[i].ID}]});
              resMsg.push(tmp);
            break;
            case 'update':
              tmp[data[i].ID_RESPONSE] = await __.setData(type,data[i]);
              resMsg.push(tmp);
            break;
          }
        }
        result({SUCCESS:true,MESSAGE:resMsg});
      });
    },

    putRequest : async function(type, data){
      let __ = this;
      return new Promise(async function (result) {
        let resMsg = [];
        for(let i in data.data){
          let cndArr = [];
          for(let j in data.dm_keyfield){
            cndArr.push({key:data.dm_keyfield[j], value:data.data[i][data.dm_keyfield[j]], operator:'isequel'});
          }

          let oldData = await __.getData(type,{where:cndArr});
          // console.log(oldData);
          if(oldData.SUCCESS && oldData.MESSAGE.length>0){
            //console.log( oldData.MESSAGE[0].ID);
            data.data[i]['ID'] = oldData.MESSAGE[0].ID;
            //console.log(data.data[i]['ID'])
          }
          
          resMsg.push(await __.setData(type, data.data[i]));
        }
        result({SUCCESS:true,MESSAGE:resMsg});
      });
    },

    margeData : async function (dmData, sqlData, cb){
      console.log({dmData, sqlData})
      if(dmData.SUCCESS == true && sqlData.SUCCESS == true){
        let data = [];
        if(dmData.MESSAGE.OWN) data = dmData.MESSAGE.OWN.concat(dmData.MESSAGE.SHARED);
        else data = dmData.MESSAGE;
        for(let i in data){
          let val = findValue(sqlData.MESSAGE, 'DOKUME_ID',data[i].ID);
          console.log(val,data[i].ID)
          if(!val) {
            sqlData.MESSAGE.push(data[i]);
          }
            
        }
        // console.log(sqlData)
        cb(sqlData)
      }else{
        cb(sqlData);
      }
    },

    current_timestamp: function(){
      return moment().format('YYYY-MM-DD HH:mm:ss');
    }
};