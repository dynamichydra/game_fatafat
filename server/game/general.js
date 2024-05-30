const moment = require('moment');
let sql = require('../modules/mysql/common').init;

const generalGame = function () {
  
}

generalGame.prototype.removeOldData = async function (days) {
  let _ = this;
  return new Promise(async function (result) {
    const thirtyDaysAgo = moment().subtract(days, 'days').format('YYYY-MM-DD');

    let conn = await sql.connectDB();

    let t = await sql.startTransaction();

    let tranInsertSql = 'INSERT INTO transfer_log (id, fid, tid,amt,type) VALUES ?';
    let insArr = [];
    let err = false;

    // clear for fatafat table
    let query = `SELECT * FROM fatafat WHERE bdate < '${thirtyDaysAgo}'`;
    t = await sql.customSQL(query);
    if(t.SUCCESS && t.MESSAGE.length>0){
      query = 'INSERT INTO zz_fatafat (id, game_id, user_id,amt,service,number,bdate,status,price,type) VALUES ?';
      const values = t.MESSAGE.map(e => [e.id, e.game_id, e.user_id, e.amt, e.service, e.number, e.bdate, e.status, e.price, e.type]);
      t = await sql.customSQLPar(query,values);
      if(!t.SUCCESS)err = true;
      
      query = `SELECT SUM(amt) amt,SUM(price) price,user_id FROM fatafat WHERE bdate < '${thirtyDaysAgo}' GROUP BY user_id`;
      t = await sql.customSQL(query);
      for(let item of t.MESSAGE){
        insArr.push([Date.now()+'-'+'0'+item.user_id, item.user_id, 0, item.amt, 'AJ']);
        insArr.push([Date.now()+'-'+'1'+item.user_id, 0, item.user_id, item.price, 'AJ']);
      }
      
      query = `DELETE FROM fatafat WHERE bdate < '${thirtyDaysAgo}'`;
      t = await sql.customSQL(query);
      if(!t.SUCCESS)err = true;
    }
    
    // clear for fatafatSuper table
    query = `SELECT * FROM fatafatSuper WHERE bdate < '${thirtyDaysAgo}'`;
    t = await sql.customSQL(query);
    if(t.SUCCESS && t.MESSAGE.length>0){
      query = 'INSERT INTO zz_fatafatSuper (id, game_id, user_id,amt,service,number,bdate,status,price,type) VALUES ?';
      const values = t.MESSAGE.map(e => [e.id, e.game_id, e.user_id, e.amt, e.service, e.number, e.bdate, e.status, e.price, e.type]);
      t = await sql.customSQLPar(query,values);
      if(!t.SUCCESS)err = true;

      query = `SELECT SUM(amt) amt,SUM(price) price,user_id FROM fatafatSuper WHERE bdate < '${thirtyDaysAgo}' GROUP BY user_id`;
      t = await sql.customSQL(query);
      for(let item of t.MESSAGE){
        insArr.push([Date.now()+'-'+'0'+item.user_id, item.user_id, 0, item.amt, 'AJ']);
        insArr.push([Date.now()+'-'+'1'+item.user_id, 0, item.user_id, item.price, 'AJ']);
      }

      query = `DELETE FROM fatafatSuper WHERE bdate < '${thirtyDaysAgo}'`;
      t = await sql.customSQL(query);
      if(!t.SUCCESS)err = true;
    }

    // clear for gameChance table
    query = `SELECT * FROM gameChance WHERE bdate < '${thirtyDaysAgo}'`;
    t = await sql.customSQL(query);
    if(t.SUCCESS && t.MESSAGE.length>0){
      query = 'INSERT INTO zz_gameChance (id, game_id, user_id,amt,service,number,bdate,status,price,type) VALUES ?';
      const values = t.MESSAGE.map(e => [e.id, e.game_id, e.user_id, e.amt, e.service, e.number, e.bdate, e.status, e.price, e.type]);
      t = await sql.customSQLPar(query,values);
      if(!t.SUCCESS)err = true;

      query = `SELECT SUM(amt) amt,SUM(price) price,user_id FROM gameChance WHERE bdate < '${thirtyDaysAgo}' GROUP BY user_id`;
      t = await sql.customSQL(query);
      for(let item of t.MESSAGE){
        insArr.push([Date.now()+'-'+'0'+item.user_id, item.user_id, 0, item.amt, 'AJ']);
        insArr.push([Date.now()+'-'+'1'+item.user_id, 0, item.user_id, item.price, 'AJ']);
      }

      query = `DELETE FROM gameChance WHERE bdate < '${thirtyDaysAgo}'`;
      t = await sql.customSQL(query);
      if(!t.SUCCESS)err = true;
    }
    
    // clear for transaction_log table
    query = `SELECT * FROM transaction_log WHERE tdate < '${thirtyDaysAgo}'`;
    t = await sql.customSQL(query);
    if(t.SUCCESS && t.MESSAGE.length>0){
      query = 'INSERT INTO zz_transaction_log (id, user_id, amt,tdate,type,ref_no,description) VALUES ?';
      const values = t.MESSAGE.map(e => [e.id, e.user_id, e.amt, e.tdate, e.type, e.ref_no, e.description]);
      t = await sql.customSQLPar(query,values);
      if(!t.SUCCESS)err = true;
      query = `DELETE FROM transaction_log WHERE tdate < '${thirtyDaysAgo}'`;
      t = await sql.customSQL(query);
      if(!t.SUCCESS)err = true;
    }
    
    // clear for transfer_log table
    query = `SELECT * FROM transfer_log WHERE tdate < '${thirtyDaysAgo}'`;
    t = await sql.customSQL(query);
    if(t.SUCCESS && t.MESSAGE.length>0){
      query = 'INSERT INTO zz_transfer_log (id, fid, tid,amt,tdate,type) VALUES ?';
      const values = t.MESSAGE.map(e => [e.id, e.fid, e.tid, e.amt, e.tdate, e.type]);
      t = await sql.customSQLPar(query,values);
      if(!t.SUCCESS)err = true;
      
      query = `SELECT SUM(amt) amt, tid FROM transfer_log WHERE tdate < '${thirtyDaysAgo}' GROUP BY tid`;
      t = await sql.customSQL(query);
      for(let item of t.MESSAGE){
        insArr.push([Date.now()+'-'+'1'+item.tid, 0, item.tid, item.amt, 'AJ']);
      }
      query = `SELECT SUM(amt) amt, fid FROM transfer_log WHERE tdate < '${thirtyDaysAgo}' GROUP BY fid`;
      t = await sql.customSQL(query);
      for(let item of t.MESSAGE){
        insArr.push([Date.now()+'-'+'1'+item.fid,  item.fid, 0, item.amt, 'AJ']);
      }

      query = `DELETE FROM transfer_log WHERE tdate < '${thirtyDaysAgo}'`;
      t = await sql.customSQL(query);
      if(!t.SUCCESS)err = true;
    }

    if(insArr.length>0){
      t = await sql.customSQLPar(tranInsertSql,insArr);
      if(!t.SUCCESS)err = true;
    }
    
    if(err){
      t = await sql.rollbackTransaction();
    }else{
      t = await sql.commitTransaction();
    }
    conn.release();
    result(err);
  });
}

generalGame.prototype.generateGame = function (code,date, gameInfo, func) {
  let curDate = moment().format('YYYY-MM-DD');
  if(date){
    curDate = date;
  }
  return new Promise(async function (result) {
    let conn = await sql.connectDB();
    let res = await sql.getData('game_inplay', {'where':[
        {'key':'game_code','operator':'is','value':code},
        {'key':'start','operator':'higher-equal','value':curDate+' 00:00:00'},
      ]});
    for(let i in gameInfo){
      let found = false;
      if(res.SUCCESS && res.MESSAGE.length>0){
        found = func.findValueDate(res.MESSAGE, 'start',curDate+' '+gameInfo[i].start);
      }
      if(!found){
        if(gameInfo[i].name[moment(curDate).format('dddd').toLowerCase()]){
          let t = await sql.setData('game_inplay',
            {'name':gameInfo[i].name[moment(curDate).format('dddd').toLowerCase()],
            'start':curDate+' '+gameInfo[i].start,
            'end':curDate+' '+gameInfo[i].end,
            'duration':gameInfo[i].duration,
            'game_code':code});
        }
      }
    }
    conn.release();
    result(res);
  });
}

generalGame.prototype.startGame = async function () {
  let _ = this;
  let conn = await sql.connectDB();

  let curDate = moment().format('YYYY-MM-DD H:mm')+':00';

  let runningGame = await sql.getData('game_inplay', {'where':[
    {'key':'status','operator':'is','value':1},
    {'key':'end','operator':'lower','value':curDate}
  ]});
  if(runningGame.SUCCESS && runningGame.MESSAGE.length>0){
    
    for(const item of runningGame.MESSAGE){
      await sql.setData('game_inplay',{
        'id':item.id,
        'status':2});
    }
  }
  
  let targetGame = await sql.getData('game_inplay', {'where':[
    {'key':'status','operator':'is','value':0},
    {'key':'start','operator':'lower','value':curDate}
  ]});
  if(targetGame.SUCCESS && targetGame.MESSAGE.length>0){
    for(const item of targetGame.MESSAGE){
      await sql.setData('game_inplay',{
        'id':item.id,
        'status':1});
    }
  }
  conn.release();
}

module.exports = generalGame; 