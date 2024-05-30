const moment = require('moment');
const fs = require('fs');


const impFunction = function () {
  
}

impFunction.prototype.readGameJson = function(file,name,par){
  console.log(file,par)
  return new Promise(async function (result) {
    let msg = {'SUCCESS':false,'MESSAGE':'??'};
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        msg = {'SUCCESS':false,'MESSAGE':err};
      }else{
        try {
          let arr = {};
          const jsonData = JSON.parse(data);
          if(par.key && par.key.length >0){
            for(let i in par.key){
              // if(!arr[data[i]])
                arr[par.key[i]] = jsonData[par.key[i]][name];
            }
          }else{
            arr = jsonData;
          }
          msg = {'SUCCESS':true,'MESSAGE':arr};
        } catch (parseError) {
          msg = {'SUCCESS':false,'MESSAGE':parseError};
        }
      }
      result(msg);
    });
  });
}

impFunction.prototype.findValueDate = function(data,key,val){
  if(!data || data.length ==0) return null;
  return data.find(function(value) {
    if(value)return moment(value[key]).format('YYYY-MM-DD HH:mm:ss') == val;
    else return null;
  });
}

impFunction.prototype.findValue = function(data,key,val){
  if(!data || data.length ==0) return null;
  return data.find(function(value) {
    if(value)return value[key] == val;
    else return null;
  });
}

impFunction.prototype.getCurrentDate = function(){
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  return yyyy + '-' + mm + '-' + dd ;
}

impFunction.prototype.generateNUniqueRandomNumbers = function (n,arrayToExclude,f,t) {
  if (n <= 0) {
    throw new Error('Invalid value for n. n must be greater than 0.');
  }

  const min = f??100;
  const max = t??900;
  const randomNumbers = [];

  while (randomNumbers.length < n) {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (arrayToExclude.includes(randomNumber));

    randomNumbers.push(randomNumber);
  }

  return randomNumbers;
}

module.exports = impFunction; 