var commonObj = require('../../modules/sqlight/common').init;
exports.lib = {
    init : function( type, task, data){
        var _ = this;
        if(!data){
          data = {};
        }
        var dmObj = null;
        if(data.conncet_dokume && data.conncet_dokume == 1){
           dmObj = require('../../modules/dokume/base');
        }
        switch(task){
            case 'get':
                return new Promise(async function (result) {
                    let res = await commonObj.getData(type, data);
                    console.log(res)
                    if(dmObj){
                      let dmData =  await dmObj.lib.init(type, task, data);
                      commonObj.margeData(dmData, res,function(mrg){
                        result(mrg);
                      });
                    }else{
                      result(res);
                    } 
                });
            case 'set':
                return new Promise(async function (result) {
                    let res = await commonObj.setData(type, data);
                    result(res);
                });
            case 'delete':
                return new Promise(async function (result) {
                  let res = await commonObj.setDelete(type, data);
                  result(res);
                });
            case 'patch':
                return new Promise(async function (result) {
                  let res = await commonObj.patchRequest(type, data);
                  result(res);
                });
            case 'put':
                return new Promise(async function (result) {
                  let res = await commonObj.putRequest(type, data);
                  result(res);
                });
            default:
                var obj = require('./'+type).init;
                return new Promise(async function (result) {
                    let res = await obj.call(commonObj,data);
                    result(res);
                });
        }

        
    },
};