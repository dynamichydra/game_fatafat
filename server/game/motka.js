const moment = require('moment');
// const libFunc = require('../lib/func.js');
let sql = require('../modules/mysql/common').init;

const motka = function () {
  this.code = 'motka';
  this.duration = 5;
  this.resultPCT = 80;
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
  let totArr = null;
  let grandTotal =0;
  // return new Promise(async function (result) {
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
      res = await sql.getData('motka', {'where':[
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
        // let total
        for(const item of res.MESSAGE){
          grandTotal += item.amt; 
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

        const targetValue = (grandTotal * _.resultPCT) / 100;
        let validValues = Object.values(arr).filter(item => item.tot < grandTotal);
        if (validValues.length === 0) {
          totArr =  Object.values(arr).reduce((min, item) => item.tot < min.tot ? item : min);
        }else{
          totArr =  validValues.reduce((closest, item) => 
            Math.abs(item.tot - targetValue) < Math.abs(closest.tot - targetValue) ? item : closest
          );
        }
        
        
        for(let i in totArr.bet){
          await sql.setData('motka',{'id':totArr.bet[i].id,
            'price':totArr.bet[i].price,
            'status':1});
          await sql.setData('transaction_log',{'user_id':totArr.bet[i].user_id,
            'amt':totArr.bet[i].price,
            'ref_no':totArr.bet[i].id,
            'type':'d',
            'description':'Motka win ('+totArr.id+') '+(totArr.bet[i].number??'')+' '+(totArr.bet[i].size??'')+' '+(totArr.bet[i].color??'')});
          
          await sql.customSQL('UPDATE user SET balance = balance +'+totArr.bet[i].price+' WHERE id ='+totArr.bet[i].user_id);
        }
        
          resArr.result_one = totArr.id;
          resArr.result_two = (['1','3','7','9'].includes(totArr.id)?'green':(totArr.id=='0'?'red,violet':(totArr.id=='5'?'green,violet':'red')));
          resArr.result_three = (['0','1','2','3','4'].includes(totArr.id)?'small':'big');
      }else{
        let randRes = [
            {result_one:'0',result_two:'red,violet',result_three:'small'},
            {result_one:'1',result_two:'green',result_three:'small'},
            {result_one:'2',result_two:'red',result_three:'small'},
            {result_one:'3',result_two:'green',result_three:'small'},
            {result_one:'4',result_two:'red',result_three:'small'},
            {result_one:'5',result_two:'green,violet',result_three:'big'},
            {result_one:'6',result_two:'red',result_three:'big'},
            {result_one:'7',result_two:'green',result_three:'big'},
            {result_one:'8',result_two:'red',result_three:'big'},
            {result_one:'9',result_two:'green',result_three:'big'},
            ];
            const rnd = Math.floor(Math.random() * 10);
            resArr = {
                'id':inPlay.id,
                'status':'2',
                'result_one':randRes[rnd].result_one,
                'result_two':randRes[rnd].result_two,
                'result_three':randRes[rnd].result_three
                }
      }
      await sql.setData('game_inplay',resArr);
      await sql.commitTransaction();
      _.generateGame();
    }
    // conn.release();
    // console.log(_)
  //   result({grandTotal:grandTotal,...totArr});
  // });
}

motka.prototype.generateGame = async function () {
    let _ = this;
  let curDate = moment().format('YYYY-MM-DD HH:mm:ss');
  let msg = null;
  let conn = await sql.connectDB();
  let res = await sql.getData('game_inplay', {'where':[
      {'key':'game_code','operator':'is','value':this.code},
      {'key':'status','operator':'is','value':1}
    ]});
  if(res.SUCCESS && res.MESSAGE.length>0){
    //   const diffInSeconds = moment().diff(moment(res.MESSAGE[0].end), 'seconds');
      const diffInSeconds = moment(res.MESSAGE[0].end).diff(moment(), 'seconds');
      console.log(diffInSeconds)
    //   console.log(diffInSeconds1)
      console.log(res.MESSAGE[0].end)
      console.log(diffInSeconds*1000)
      msg = {SUCCESS:false,MESSAGE:'One game is running'};
      setTimeout(function(){
        console.log('from here exist')
        _.generateResult();
      },(diffInSeconds*1000)+1001);
  }else{
    // let curDate = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('I am ')
    msg = await sql.setData('game_inplay',
          {'name':this.code,
          'start':curDate,
          'end':moment(curDate).add(this.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          'duration':this.duration,
          'game_code':this.code,
          'status':1}
        );
    setTimeout(function(){
        console.log('from here create')
        _.generateResult();
    },(_.duration*60*1000)+1001);
  }
//   conn.release();
  console.log(msg)
  return msg;
}

module.exports = motka; 