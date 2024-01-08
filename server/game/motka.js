const moment = require('moment');
// const libFunc = require('../lib/func.js');
let sql = require('../modules/mysql/common').init;

const motka = function () {
  this.code = 'motka';
  this.duration = 5;
  this.price = {number:9,colorOne:2,colorTwo:1.5,colorThree:4.5,set:2};
  // this.func = new libFunc();
}

motka.prototype.startGame = async function () {
  
}
motka.prototype.generateResult = async function () {
  let _ = this;
  let arr = {
    '0':{tot:0,bet:[]},
    '1':{tot:0,bet:[]},
    '2':{tot:0,bet:[]},
    '3':{tot:0,bet:[]},
    '4':{tot:0,bet:[]},
    '5':{tot:0,bet:[]},
    '6':{tot:0,bet:[]},
    '7':{tot:0,bet:[]},
    '8':{tot:0,bet:[]},
    '9':{tot:0,bet:[]}}
  return new Promise(async function (result) {
    let curDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let conn = await sql.connectDB();
    
    let res = await sql.getData('game_inplay', {'where':[
      {'key':'game_code','operator':'is','value':_.code},
      {'key':'status','operator':'is','value':1},
      {'key':'end','operator':'lower-equal','value':curDate},
    ]});
    if(res.SUCCESS && res.MESSAGE.length>0){
      let inPlay = res.MESSAGE[0];
      await sql.startTransaction();
      res = await sql.getData('motka_bet', {'where':[
        {'key':'game_id','operator':'is','value':inPlay.id}
      ]});
      let resArr = {
        'id':inPlay.id,
        'status':'2',
        'result_one':null,
        'result_two':null,
        'result_three':null
        };
      if(res.SUCCESS && res.MESSAGE.length>0){
        for(const item of res.MESSAGE){
          
          if(item.btype == 'number'){
            arr[item.bname].tot += item.amt * _.price.number;
            item.price = item.amt * _.price.number;
            arr[item.bname].bet.push(item); 
          }else if(item.btype == 'color'){
            let tAmt = 0;
            if(item.bname == 'green'){
              tAmt = item.amt * _.price.colorOne;
              item.price = tAmt;
              arr['1'].tot += tAmt;
              arr['1'].bet.push(item); 
              arr['3'].tot += tAmt;
              arr['3'].bet.push(item); 
              arr['7'].tot += tAmt;
              arr['7'].bet.push(item); 
              arr['9'].tot += tAmt;
              arr['9'].bet.push(item); 

              let obj = { ...item };
              tAmt = obj.amt * _.price.colorTwo;
              obj.price = tAmt;
              arr['5'].tot += tAmt;
              arr['5'].bet.push(obj); 
            }else if(item.bname == 'red'){
              tAmt = item.amt * _.price.colorOne;
              item.price = tAmt;
              arr['2'].tot += tAmt;
              arr['2'].bet.push(item); 
              arr['4'].tot += tAmt;
              arr['4'].bet.push(item); 
              arr['6'].tot += tAmt;
              arr['6'].bet.push(item); 
              arr['8'].tot += tAmt;
              arr['8'].bet.push(item); 

              let obj = { ...item };
              tAmt = obj.amt * _.price.colorTwo;
              obj.price = tAmt;
              arr['0'].tot += tAmt;
              arr['0'].bet.push(obj); 
            }else{
              tAmt = item.amt * _.price.colorThree;
              item.price = tAmt;
              arr['0'].tot += tAmt;
              arr['0'].bet.push(item); 
              arr['5'].tot += tAmt;
              arr['5'].bet.push(item); 
            }
          }else{
            let tAmt = 0;
            tAmt = item.amt * _.price.set;
            item.price = tAmt;
            if(item.bname == 'big'){
              arr['5'].tot += tAmt;
              arr['5'].bet.push(item); 
              arr['6'].tot += tAmt;
              arr['6'].bet.push(item); 
              arr['7'].tot += tAmt;
              arr['7'].bet.push(item); 
              arr['8'].tot += tAmt;
              arr['8'].bet.push(item); 
              arr['9'].tot += tAmt;
              arr['9'].bet.push(item); 
            }else{
              arr['0'].tot += tAmt;
              arr['0'].bet.push(item); 
              arr['1'].tot += tAmt;
              arr['1'].bet.push(item); 
              arr['2'].tot += tAmt;
              arr['2'].bet.push(item); 
              arr['3'].tot += tAmt;
              arr['3'].bet.push(item); 
              arr['4'].tot += tAmt;
              arr['4'].bet.push(item); 
            }
          }
        }
        arr = Object.keys(arr).map(key => ({ id: key, ...arr[key] }));

        arr.sort((a, b) => a.tot - b.tot);
        arr = arr[0];
        
        for(let i in arr.bet){
          await sql.setData('motka_bet',{'id':arr.bet[i].id,
            'price':arr.bet[i].price,
            'status':1});
          await sql.setData('transaction_log',{'user_id':arr.bet[i].user_id,
            'amt':arr.bet[i].price,
            'ref_no':arr.bet[i].id,
            'type':'d',
            'description':'Motka win ('+arr.id+') '+(arr.bet[i].number??'')+' '+(arr.bet[i].size??'')+' '+(arr.bet[i].color??'')});
          
          await sql.customSQL('UPDATE user SET balance = balance +'+arr.bet[i].price+' WHERE id ='+arr.bet[i].user_id);
        }
        // await sql.setData('motka_win',{
        //     'game_id':inPlay.id,
        //     'number':arr.id,
        //     'size':(['0','1','2','3','4'].includes(arr.id)?'small':'big'),
        //     'color':(['1','3','7','9'].includes(arr.id)?'green':(arr.id=='0'?'red,violet':(arr.id=='5'?'green,violet':'red')))
        //   });
          resArr.result_one = arr.id;
          resArr.result_two = (['1','3','7','9'].includes(arr.id)?'green':(arr.id=='0'?'red,violet':(arr.id=='5'?'green,violet':'red')));
          resArr.result_three = (['0','1','2','3','4'].includes(arr.id)?'small':'big');
      }
      await sql.setData('game_inplay',resArr);
      await sql.commitTransaction();
    }
    conn.release();
    _.generateGame();
    result(arr);
  });
}

motka.prototype.generateGame = async function () {
  let curDate = moment().format('YYYY-MM-DD HH:mm:ss');
  let msg = null;
  let conn = await sql.connectDB();
  let res = await sql.getData('game_inplay', {'where':[
      {'key':'game_code','operator':'is','value':this.code},
      {'key':'status','operator':'is','value':1},
    ]});
  if(res.SUCCESS && res.MESSAGE.length>0){
    msg = {SUCCESS:false,MESSAGE:'One game is running'};
  }else{
    msg = await sql.setData('game_inplay',
          {'name':this.code,
          'start':curDate,
          'end':moment(curDate).add(this.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          'duration':this.duration,
          'game_code':this.code,
          'status':1}
        );
  }
  conn.release();
  return msg;
}

module.exports = motka; 