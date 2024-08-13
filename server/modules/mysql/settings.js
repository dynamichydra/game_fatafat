const libFunc = require('../../lib/func.js');
const moment =  require('moment');

exports.init = {

  call : async function(commonObj, data){
      let _ = this;
      return new Promise(async function (result) {
        if(data){
          if(data.grant_type == 'get_config'){
            let func = new libFunc();
            let res = await func.readGameJson('config/game.json',data.name??null,data.par??null);
            result(res);
          }else if(data.grant_type == 'set_config'){
            let func = new libFunc();
            let json = await func.readGameJson('config/game.json');
            if(data.arr.key && json.SUCCESS){
              if(data.arr.key[0] && data.arr.key[1] && data.arr.key[2]){
                json.MESSAGE[data.arr.key[0]][data.arr.key[1]][data.arr.key[2]] = data.arr.val;
              }else if(data.arr.key[0] && data.arr.key[1]){
                json.MESSAGE[data.arr.key[0]][data.arr.key[1]] = data.arr.val;
              }else{
                json.MESSAGE[data.arr.key[0]] = data.arr.val;
              }
            }else{
              json.MESSAGE = data.arr.val;
            }
            let res = await func.writeJsonFileSync('config/game.json',json.MESSAGE);
            result(res);
          }else{
              result({SUCCESS:false,MESSAGE:'err no grand type'});
          }
        }else{
          result({SUCCESS:false,MESSAGE:'err no data'});
        }
      });
    },
};

