var DokuMe_TaskExecutor = function() {};

DokuMe_TaskExecutor.prototype.executeTask = async function(source, type, task, data){
    var _ = this;
    
    var dbsource = source??'mysql';
    const baseModule = require('./modules/'+dbsource+'/base');
    try {
        var output = await baseModule.lib.init(type, task, data);
        return output;
    } catch (ex) {
        console.log(ex);
        return new Promise( function(resolve,reject) {
            reject({SUCCESS:false, MESSAGE:'Request not found.'});
        });
    }
};

module.exports = DokuMe_TaskExecutor;
