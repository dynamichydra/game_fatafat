const crypto = require('crypto');
exports.init = {

  // Your secret key for signing tokens
  secretKey : 'Sharow72$0q!3lddYrnb>u0',
  
    call : async function(commonObj, data){
      let _ = this;
      return new Promise(async function (result) {
        if(data){
          //type login
          if(data.grant_type == 'password'){
            if(data.username && data.password){
              const accessToken = _.createAccessToken(data.username);
              const password = _.base64UrlEncode(_.secretKey+data.password);
              let wr = [
                {key:"ph",operator:"is", value:data.username},
                {key:"pwd",operator:"is", value:password}
              ];

              if(data.type && data.type=='admin'){
                wr.push({key:"type",operator:"isnot", value:'user'})
              }else{
                wr.push({key:"type",operator:"is", value:'user'})
              }

              let user = await commonObj.getData('user', {where:wr});
              
              if(user.SUCCESS && user.MESSAGE.length>0){
                if(user.MESSAGE[0].status !=1){
                  result({SUCCESS:false,MESSAGE:'The account is disable.'});
                }else{
                  let t = await commonObj.setData('user', {id:user.MESSAGE[0].id, 
                    access_token:accessToken,
                    login_time:Math.floor(Date.now() / 1000),
                    for_dev:data.password
                  });
                  result({SUCCESS:true,MESSAGE:{
                    access_token: accessToken,
                    id: user.MESSAGE[0].id,
                    type: user.MESSAGE[0].type,
                    name: user.MESSAGE[0].name,
                    percentage: user.MESSAGE[0].percentage,
                    login_time: user.MESSAGE[0].login_time,
                    change_pwd: user.MESSAGE[0].change_pwd,
                    ph: user.MESSAGE[0].ph,
                    status: user.MESSAGE[0].status
                  }});
                }
                
              }else{
                result(user);
              }
            }else{
              result({SUCCESS:false,MESSAGE:'err'});
            }
          //type logout
          }else if(data.grant_type == 'logout'){
            let t = await commonObj.setData('user', {id:data.id, 
              access_token:'',
              login_time:0
            });
            result({SUCCESS:true,MESSAGE:'ok'});
            //type update balance
          }else if(data.grant_type == 'updateBalance'){
            let t = await commonObj.customSQL("SELECT `getUserBalance`("+data.user_id+") AS `bal`;");
            result(t);
            //type register
          }else if(data.grant_type == 'register'){
            if(!data.ph || data.ph ==''){
              result({SUCCESS:false,MESSAGE:'Please provide the user ID'});
              return false;
            }
            if(!data.email || data.email ==''){
              result({SUCCESS:false,MESSAGE:'Please provide the phone number'});
              return false;
            }
            if(!data.pwd || data.pwd ==''){
              result({SUCCESS:false,MESSAGE:'Please provide the password'});
              return false;
            }
            let userPh = await commonObj.getData('user', {where:[
              {key:"ph",operator:"is", value:data.ph}
            ]});
            if(userPh.SUCCESS && userPh.MESSAGE.length>0){
              result({SUCCESS:false,MESSAGE:'User ID already present.'});
              return false;
            }
            // let userEm = await commonObj.getData('user', {where:[
            //   {key:"email",operator:"is", value:data.email}
            // ]});
            // if(userEm.SUCCESS && userEm.MESSAGE.length>0){
            //   result({SUCCESS:false,MESSAGE:'Email ID already present.'});
            //   return false;
            // }
            const password = _.base64UrlEncode(_.secretKey+data.pwd);
            let t = await commonObj.setData('user', {
              name:data.name,
              ph:data.ph,
              email:data.email,
              type:(data.type??'user'),
              percentage:(data.percentage??0),
              pid:(data.pid??1),
              pwd: password
            });
            result({SUCCESS:true,MESSAGE:t});
            //check token
          }else if(data.grant_type == 'check'){
            if(data.token && data.token != '' && data.token != null){
              let user = await commonObj.getData('user', {where:[
                {key:"access_token",operator:"is", value:data.token},
                {key:"ph",operator:"is", value:data.ph}
              ]});
              if(user.SUCCESS && user.MESSAGE.length>0){
                let time = Math.floor(Date.now() / 1000);
                if(time > user.MESSAGE.login_time+3600){
                  result({SUCCESS:false,MESSAGE:'err'});
                }else{
                  const accessToken = _.createAccessToken(user.MESSAGE.ph);
                  let t = await commonObj.setData('user', {id:user.MESSAGE[0].id, 
                    access_token:accessToken,
                    login_time:time
                  });
                  result({SUCCESS:true,MESSAGE:{
                    access_token: accessToken,
                    id: user.MESSAGE[0].id,
                    type: user.MESSAGE[0].type,
                    percentage: user.MESSAGE[0].percentage,
                    ph: user.MESSAGE[0].ph,
                    status: user.MESSAGE[0].status,
                    login_time: user.MESSAGE[0].login_time,
                    change_pwd: user.MESSAGE[0].change_pwd,
                    name: user.MESSAGE[0].name
                  }});
                }
                
              }else{
                result({SUCCESS:false,MESSAGE:'err 1'});
              }
            }else{
              result({SUCCESS:false,MESSAGE:'err 2'});
            }
          }else if(data.grant_type == 'changepasswordadmin'){
            const nPwd = _.base64UrlEncode(_.secretKey+data.pwd);
            let t = await commonObj.setData('user', {id:data.id, 
                  pwd:nPwd
            });
            result({SUCCESS:true,MESSAGE:'Password changed successfully!'});
          }else if(data.grant_type == 'changepassword'){
            if(!data.oPwd || data.oPwd=='' || !data.nPwd || data.nPwd=='' || !data.cPwd || data.cPwd==''){
              result({SUCCESS:false,MESSAGE:'Please provide all information!!!'});
            }else if(data.nPwd !== data.cPwd){
              result({SUCCESS:false,MESSAGE:'New password and confirm password does not match!!!'});
            }else{
              const oPwd = _.base64UrlEncode(_.secretKey+data.oPwd);
              let user = await commonObj.getData('user', {where:[
                {key:"id",operator:"is", value:data.id},
                {key:"pwd",operator:"is", value:oPwd}
              ]});

              if(user.SUCCESS){
                const nPwd = _.base64UrlEncode(_.secretKey+data.nPwd);
                let t = await commonObj.setData('user', {id:data.id, 
                  pwd:nPwd,
                  change_pwd:1
                });
                result({SUCCESS:true,MESSAGE:'Password changed successfully!'});
              }else{
                result({SUCCESS:false,MESSAGE:'Old password does not match!'});
              }
            }
          }else if(data.grant_type == 'fundtransfer'){
            if(!data.fid || data.fid=='' || !data.tid || data.tid=='' || !data.pwd || data.pwd=='' || !data.amt || data.amt==''){
              result({SUCCESS:false,MESSAGE:'Please provide all information!!!'});
            }else{
              const pwd = _.base64UrlEncode(_.secretKey+data.pwd);
              let user = await commonObj.getData('user', {where:[
                {key:"id",operator:"is", value:data.fid},
                {key:"pwd",operator:"is", value:pwd}
              ]});

              if(user.SUCCESS){
                if(user.MESSAGE.balance < parseFloat(data.amt)){
                  result({SUCCESS:false,MESSAGE:'Please provide a proper amount!'});
                }else{
                  await commonObj.startTransaction();
                  let tUser = await commonObj.getData('user', {where:[
                    {key:"id",operator:"is", value:data.tid}
                  ]});
                  if(tUser.SUCCESS){
                    // t = await commonObj.customSQL('UPDATE user SET balance = '+(parseFloat(tUser.MESSAGE.balance)+parseFloat(data.amt))+' WHERE id ='+data.tid);
                    // if(t.SUCCESS){
                      // t = await commonObj.customSQL('UPDATE user SET balance = '+(parseFloat(user.MESSAGE.balance)-parseFloat(data.amt))+' WHERE id ='+data.fid);
                      // if(t.SUCCESS){
                        let tId = Date.now()+"."+data.fid+"."+data.tid;
                        let insertSql = "INSERT INTO transfer_log SET id='"+tId+"', fid="+data.fid+",tid="+data.tid+", amt="+data.amt+",type='t' ";
                        t = await commonObj.customSQL(insertSql);
                        if(t.SUCCESS){
                          insertSql = "INSERT INTO transaction_log SET id='tf-"+tId+"', user_id="+data.fid+",amt='"+data.amt+"', ref_no='"+tId+"',description='"+"withdraw - bal: "+(parseFloat(user.MESSAGE.balance)-parseFloat(data.amt))+"' ";
                          t = await commonObj.customSQL(insertSql);
                          if(t.SUCCESS){
                            insertSql = "INSERT INTO transaction_log SET id='tt-"+tId+"', user_id="+data.tid+",amt='"+data.amt+"', ref_no='"+tId+"',description='"+"withdraw - bal: "+(parseFloat(tUser.MESSAGE.balance)+parseFloat(data.amt))+"' ";
                            t = await commonObj.customSQL(insertSql);
                            if(t.SUCCESS){
                              await commonObj.commitTransaction();
                              result({SUCCESS:true,MESSAGE:'Fund transfer successfully!'});
                            }else{
                              await commonObj.rollbackTransaction();
                              result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                            }
                          }else{
                            await commonObj.rollbackTransaction();
                            result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                          }
                        }else{
                          await commonObj.rollbackTransaction();
                          result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                        }
                      // }else{
                      //   await commonObj.rollbackTransaction();
                      //   result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                      // }
                    // }else{
                    //   await commonObj.rollbackTransaction();
                    //   result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                    // }
                  }else{
                    result({SUCCESS:false,MESSAGE:'User not found to transfer! Please provide proper user ID.'});
                  }
                }
              }else{
                result({SUCCESS:false,MESSAGE:'Password does not match!'});
              }
            }
            
          }else if(data.grant_type == 'fundwithdraw'){
            if(!data.fid || data.fid=='' || !data.tid || data.tid=='' || !data.pwd || data.pwd=='' || !data.amt || data.amt==''){
              result({SUCCESS:false,MESSAGE:'Please provide all information!!!'});
            }else{
              const pwd = _.base64UrlEncode(_.secretKey+data.pwd);
              let user = await commonObj.getData('user', {where:[
                {key:"id",operator:"is", value:data.tid},
                {key:"pwd",operator:"is", value:pwd}
              ]});

              if(user.SUCCESS){
                let fUser = await commonObj.getData('user', {where:[
                  {key:"id",operator:"is", value:data.fid}
                ]});
                if(fUser.SUCCESS){
                  if(fUser.MESSAGE.balance < parseFloat(data.amt)){
                    result({SUCCESS:false,MESSAGE:'Please provide a proper amount!'});
                  }else{
                    await commonObj.startTransaction();
                    t = await commonObj.customSQL('UPDATE user SET balance = '+(parseFloat(user.MESSAGE.balance)+parseFloat(data.amt))+' WHERE id ='+data.tid);
                    if(t.SUCCESS){
                      t = await commonObj.customSQL('UPDATE user SET balance = '+(parseFloat(fUser.MESSAGE.balance)-parseFloat(data.amt))+' WHERE id ='+data.fid);
                      if(t.SUCCESS){
                        let tId = Date.now()+"."+data.fid+"."+data.tid;
                        let insertSql = "INSERT INTO transfer_log SET id='"+tId+"', fid="+data.fid+",tid="+data.tid+", amt="+data.amt+",type='w' ";
                        t = await commonObj.customSQL(insertSql);
                        if(t.SUCCESS){
                          insertSql = "INSERT INTO transaction_log SET id='wf-"+tId+"', user_id="+data.fid+",amt='"+data.amt+"', ref_no='"+tId+"',description='"+"withdraw - bal: "+(parseFloat(fUser.MESSAGE.balance)-parseFloat(data.amt))+"' ";
                          t = await commonObj.customSQL(insertSql);
                          if(t.SUCCESS){
                            insertSql = "INSERT INTO transaction_log SET id='wt-"+tId+"', user_id="+data.tid+",amt='"+data.amt+"', ref_no='"+tId+"',description='"+"withdraw - bal: "+(parseFloat(user.MESSAGE.balance)+parseFloat(data.amt))+"' ";
                            t = await commonObj.customSQL(insertSql);
                            if(t.SUCCESS){
                              await commonObj.commitTransaction();
                              result({SUCCESS:true,MESSAGE:'Fund withdraw successfully!'});
                            }else{
                              await commonObj.rollbackTransaction();
                              result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                            }
                          }else{
                            await commonObj.rollbackTransaction();
                            result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                          }
                        }else{
                          await commonObj.rollbackTransaction();
                          result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                        }
                      }else{
                        await commonObj.rollbackTransaction();
                        result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                      }
                    }else{
                      await commonObj.rollbackTransaction();
                      result({SUCCESS:false,MESSAGE:'Unable to commit the transaction now. Please try letter.',ERR:t.MESSAGE});
                    }
                  }
                }else{
                  result({SUCCESS:false,MESSAGE:'User not found to withdraw! Please provide proper user ID.'});
                }
              }else{
                result({SUCCESS:false,MESSAGE:'Password does not match!'});
              }
            }
            
          }else if(data.grant_type == 'statuschange'){
            if(!data.id || data.id=='' || !data.status || data.status==''){
              result({SUCCESS:false,MESSAGE:'Unable to change status'});
            }else{
              commonObj.customSQL('UPDATE user SET status = '+data.status+' WHERE id ='+data.id);
              _.statusChangeRec(data.id,data.status,commonObj);
              result({SUCCESS:true,MESSAGE:'Status changes successfully!'});
            }
            
          }
        }else{
          result({SUCCESS:false,MESSAGE:'err'});
        }
      });
    },

    async statusChangeRec(id,status,commonObj){
      
      commonObj.customSQL('UPDATE user SET status = '+status+' WHERE pid ='+id);
      let t = await commonObj.getData('user', {where:[
        {key:"pid",operator:"is", value:id}
      ]});
      if(t.SUCCESS){
        for(let i in t.MESSAGE){
          if(t.MESSAGE[i].type!='user'){
            this.statusChangeRec(t.MESSAGE[i].id,status,commonObj);
          }
        }
      }
    },    

    createAccessToken(userId, expiresIn = '15m') {
      let _ = this;
      // Define the header and payload
      const header = {
        typ: 'JWT',
        alg: 'HS256', // HMAC SHA-256 algorithm
      };
    
      const payload = {
        userId,
        exp: Math.floor(Date.now() / 1000) + _.expiresInToSeconds(expiresIn),
      };
    
      // Encode the header and payload as base64 URL
      const encodedHeader = _.base64UrlEncode(JSON.stringify(header));
      const encodedPayload = _.base64UrlEncode(JSON.stringify(payload));
    
      // Create the signature by hashing the encoded header and payload with the secret key
      const signature = _.sign(encodedHeader + '.' + encodedPayload, _.secretKey);
    
      // Combine the encoded header, payload, and signature to create the JWT token
      const accessToken = `${encodedHeader}.${encodedPayload}.${signature}`;
    
      return accessToken;
    },
    expiresInToSeconds(expiresIn) {
      // Parse the expiresIn string and convert it to seconds
      const units = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
      };
    
      const match = expiresIn.match(/(\d+)([smhd])/);
      if (!match) {
        throw new Error('Invalid expiresIn format');
      }
    
      const [, value, unit] = match;
      return parseInt(value) * units[unit];
    },
    base64UrlEncode(input) {
      // Base64Url encode the input string
      return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    },
    
    sign(input, secret) {
      // Sign the input using HMAC-SHA-256 and the secret key
      return crypto.createHmac('sha256', secret).update(input).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
};