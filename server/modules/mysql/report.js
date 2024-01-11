const crypto = require('crypto');
const moment =  require('moment');

exports.init = {

  call : async function(commonObj, data){
      let _ = this;
      return new Promise(async function (result) {
        if(data){
          //type transfer
          if(data.grant_type == 'transfer'){

            let sql = " ";
            let cnd = " WHERE 1 ";

            if(data.fdate && data.fdate != '' && data.tdate && data.tdate != ''){
              const fDate = moment(data.fdate).format('YYYY-MM-DD')+' 00:00:00';
              const tDate = moment(data.tdate).format('YYYY-MM-DD')+' 23:59:59';
              cnd += ` AND (T.tdate BETWEEN '${fDate}' AND '${tDate}')`;
            }

            // if(data.pType != 'user'){

              // if(data.fid && data.fid != ''){
              //   cnd += ` AND U2.ph like '%${data.fid}%'`;
              // }
              // if(data.tid && data.tid != ''){
              //   cnd += ` AND U1.ph like '%${data.tid}%'`;
              // }
              // if(data.fname && data.fname != ''){
              //   cnd += ` AND U.name like '%${data.fname}%'`;
              // }
              // if(data.tname && data.tname != ''){
              //   cnd += ` AND U1.name like '%${data.tname}%'`;
              // }
              
              // if(data.pType == 'admin'){
              //   sql = "SELECT T.id, T.amt, T.tdate, T.type, U.name fname, U1.name tname, U.ph fph, U1.ph tph FROM `transfer_log` AS T INNER JOIN `user` U ON U.id = T.fid INNER JOIN `user` U1 ON U1.id = T.tid LEFT JOIN `user` U2 ON U1.pid = U2.id "+cnd;
              // }else{
                sql = "SELECT T.id, T.amt, T.tdate,T.type, U.name fname, U1.name tname, U.ph fph, U1.ph tph FROM `transfer_log` AS T INNER JOIN `user` U ON U.id = T.fid INNER JOIN `user` U1 ON U1.id = T.tid  "+cnd+" AND (T.fid ="+data.pId+" OR T.tid ="+data.pId+")";
              // }
              
            // }else{
            //   if(data.fid && data.fid != ''){
            //     cnd += ` AND T.fid = '${data.fid}'`;
            //   }
            //   if(data.tid && data.tid != ''){
            //     cnd += ` AND T.tid = '${data.tid}'`;
            //   }
            //   sql = "SELECT T.id, T.amt, T.tdate,T.type, U.name fname, U1.name tname, U.ph fph, U1.ph tph FROM `transfer_log` AS T INNER JOIN `user` U ON U.id = T.fid INNER JOIN `user` U1 ON U1.id = T.tid "+cnd;
            // }
            console.log(sql)
            let t = await commonObj.customSQL(sql);
            result(t);
          }else if(data.grant_type == 'bet_log'){
            if(data.pType != 'user'){
              let sql = " ";
              let cnd = " WHERE 1 ";

              if(data.status && data.status != ''){
                cnd += ` AND R.status = '${data.status}' `;
              }
              if(data.uId && data.uId != ''){
                cnd += ` AND U1.ph like '%${data.uId}%' `;
              }
              if(data.uIdE && data.uIdE != ''){
                cnd += ` AND r.user_id = '${data.uIdE}' `;
              }
              if(data.uName && data.uName != ''){
                cnd += ` AND U1.name like '%${data.uName}%' `;
              }
              if(data.gId && data.gId != ''){
                cnd += ` AND R.game_id = '${data.gId}' `;
              }
              if(data.fdate && data.fdate != '' && data.tdate && data.tdate != ''){
                const fDate = moment(data.fdate).format('YYYY-MM-DD')+' 00:00:00';
                const tDate = moment(data.tdate).format('YYYY-MM-DD')+' 23:59:59';
                cnd += ` AND (R.bdate BETWEEN '${fDate}' AND '${tDate}')`;
              }

              if(data.gName && data.gName != ''){
                cnd += ` AND GM.name= '${data.gName}' `;
              }

              if(data.pType == 'admin'){
                sql = "SELECT R.*, U1.name, U1.ph, U2.name pname, GM.name gname FROM `"+data.gCode+"` AS R INNER JOIN `game_inplay` AS GM ON GM.id=R.game_id INNER JOIN `user` U1 ON U1.id = R.user_id LEFT JOIN `user` U2 ON U1.pid = U2.id "+cnd+" ORDER BY R.id DESC";
                
              }else{
                sql = "(SELECT R.*, U1.name, U1.ph, U1.id u1id, U1.percentage u1percentage, U2.name pname, GM.name gname, U2.id u2id, U2.percentage u2percentage, 0 u3id, 0 u3percentage FROM `"+data.gCode+"` AS R INNER JOIN `game_inplay` AS GM ON GM.id=R.game_id INNER JOIN `user` U1 ON U1.id = R.user_id INNER JOIN `user` U2 ON U1.pid = U2.id "+cnd+" AND U2.id ="+data.pId+" ORDER BY R.id DESC)";
                if(data.pType != 'distributer'){
                  sql += " UNION ";
                  sql += "(SELECT R.*, U1.name, U1.ph, U1.id u1id, U1.percentage u1percentage, U2.name pname, GM.name gname, U2.id u2id, U2.percentage u2percentage, 0 u3id, 0 u3percentage FROM `"+data.gCode+"` AS R INNER JOIN `game_inplay` AS GM ON GM.id=R.game_id INNER JOIN `user` U1 ON U1.id = R.user_id INNER JOIN `user` U2 ON U1.pid = U2.id "+cnd+" AND U2.pid ="+data.pId+" ORDER BY R.id DESC)";
                  if(data.pType != 'super'){
                    sql += " UNION ";
                    sql += "(SELECT R.*, U1.name, U1.ph, U1.id u1id, U1.percentage u1percentage, U2.name pname, GM.name gname, U2.id u2id, U2.percentage u2percentage, U3.id u3id, U3.percentage u3percentage FROM `"+data.gCode+"` AS R INNER JOIN `game_inplay` AS GM ON GM.id=R.game_id INNER JOIN `user` U1 ON U1.id = R.user_id INNER JOIN `user` U2 ON U1.pid = U2.id INNER JOIN `user` U3 ON U2.pid = U3.id "+cnd+" AND U3.pid ="+data.pId+" ORDER BY R.id DESC)";
                    
                  }
                }
              }
              
              console.log(sql)
              let t = await commonObj.customSQL(sql);
              result(t);
            }else{
              result({SUCCESS:false,MESSAGE:'err'});
            }
          }else if(data.grant_type == 'pl'){
            if(data.pType != 'user'){
              let sql = " ";
              let cnd = " WHERE 1 ";

              if(data.fdate && data.fdate != '' && data.tdate && data.tdate != ''){
                const fDate = moment(data.fdate).format('YYYY-MM-DD')+' 00:00:00';
                const tDate = moment(data.tdate).format('YYYY-MM-DD')+' 23:59:59';
                cnd += ` AND (R.bdate BETWEEN '${fDate}' AND '${tDate}')`;
              }

              if(data.gName && data.gName != ''){
                cnd += ` AND G.name= '${data.gName}' `;
              }

              if(data.pType == 'admin'){
                sql = "(SELECT SUM(amt) amt,SUM(price) price, U1.ph u1name, U1.id u1id, U1.type u1type ,U2.ph u2name, U2.id u2id, U2.type u2type ,U3.ph u3name, U3.id u3id, U3.type u3type,U4.ph u4name, U4.id u4id, U4.type u4type  FROM `"+data.gCode+"` AS R INNER JOIN game_inplay G ON G.id=R.game_id INNER JOIN `user` U1 ON U1.id = R.user_id LEFT JOIN `user` U2 ON U1.pid = U2.id LEFT JOIN `user` U3 ON U2.pid = U3.id LEFT JOIN `user` U4 ON U3.pid = U4.id "+cnd+" GROUP BY U1.id)";
                
              }else{
                sql = "(SELECT SUM(amt) amt,SUM(price) price, U1.ph u1name, U1.id u1id, U1.type u1type ,U2.ph u2name, U2.id u2id, U2.type u2type, null u3name, null u3id,null u3type,null , null,null   FROM `"+data.gCode+"` AS R INNER JOIN game_inplay G ON G.id=R.game_id INNER JOIN `user` U1 ON U1.id = R.user_id LEFT JOIN `user` U2 ON U1.pid = U2.id  "+cnd+" AND U2.id ="+data.pId+" GROUP BY U1.id)";
                if(data.pType != 'distributer'){
                  sql += " UNION ";
                  sql += "(SELECT SUM(amt) amt,SUM(price) price, U1.ph u1name, U1.id u1id, U1.type u1type ,U2.ph u2name, U2.id u2id, U2.type u2type ,U3.ph u3name, U3.id u3id, U3.type u3type,null, null,null  FROM `"+data.gCode+"` AS R INNER JOIN game_inplay G ON G.id=R.game_id INNER JOIN `user` U1 ON U1.id = R.user_id LEFT JOIN `user` U2 ON U1.pid = U2.id LEFT JOIN `user` U3 ON U2.pid = U3.id "+cnd+" AND U3.id ="+data.pId+" GROUP BY U2.id)";
    
                  if(data.pType != 'super'){
                    sql += " UNION ";
                    sql += "(SELECT SUM(amt) amt,SUM(price) price, U1.ph u1name, U1.id u1id, U1.type u1type ,U2.ph u2name, U2.id u2id, U2.type u2type ,U3.ph u3name, U3.id u3id, U3.type u3type,U4.ph u4name, U4.id u4id, U4.type u4type  FROM `"+data.gCode+"` AS R INNER JOIN game_inplay G ON G.id=R.game_id INNER JOIN `user` U1 ON U1.id = R.user_id LEFT JOIN `user` U2 ON U1.pid = U2.id LEFT JOIN `user` U3 ON U2.pid = U3.id LEFT JOIN `user` U4 ON U3.pid = U4.id "+cnd+" AND U4.id ="+data.pId+" GROUP BY U3.id)";
                
                  }
                }
              }
              
              console.log(sql)
              let t = await commonObj.customSQL(sql);
              result(t);
            }else{
              result({SUCCESS:false,MESSAGE:'err'});
            }
          }else if(data.grant_type == 'user'){
            if(data.pType != 'user'){
              let sql = " ";
              let cnd = " WHERE 1 ";

              if(data.uStatus && data.uStatus != ''){
                cnd += ` AND U1.status = '${data.uStatus}' `;
              }
              if(data.uPh && data.uPh != ''){
                cnd += ` AND U1.email like '%${data.uPh}%' `;
              }
              if(data.uName && data.uName != ''){
                cnd += ` AND U1.name like '%${data.uName}%' `;
              }
              if(data.uId && data.uId != ''){
                cnd += ` AND U1.ph like '%${data.uId}%' `;
              }

              if(data.pType == 'admin'){
                sql = "SELECT U1.id,U1.pid,U1.name,U1.ph,U1.email,U1.type,U1.balance,U1.status,U1.percentage,U2.name pname FROM `user` U1 LEFT JOIN `user` U2 ON U1.pid = U2.id "+cnd;
              }else{
                sql = "(SELECT U1.id,U1.pid,U1.name,U1.ph,U1.email,U1.type,U1.balance,U1.status,U1.percentage,U2.name pname FROM `user` U1 INNER JOIN `user` U2 ON U1.pid = U2.id "+cnd+" AND U2.id ="+data.pId+")";
                if(data.pType != 'distributer'){
                  sql += " UNION ";
                  sql += "(SELECT U1.id,U1.pid,U1.name,U1.ph,U1.email,U1.type,U1.balance,U1.status,U1.percentage,U2.name pname FROM `user` U1 INNER JOIN `user` U2 ON U1.pid = U2.id "+cnd+" AND U2.pid ="+data.pId+")";
                  if(data.pType != 'super'){
                    sql += " UNION ";
                    sql += "(SELECT U1.id,U1.pid,U1.name,U1.ph,U1.email,U1.type,U1.balance,U1.status,U1.percentage,U2.name pname FROM `user` U1 INNER JOIN `user` U2 ON U1.pid = U2.id INNER JOIN `user` U3 ON U2.pid = U3.id "+cnd+" AND U3.pid ="+data.pId+")";
                  }
                }
              }
              
              console.log(sql)
              let t = await commonObj.customSQL(sql);
              result(t);
            }else{
              result({SUCCESS:false,MESSAGE:'err'});
            }
          }else if(data.grant_type == 'user_simple'){
            if(data.pType != 'user'){
              let sql = " ";
              let cnd = " WHERE pid= "+data.pId;

              if(data.uStatus && data.uStatus != ''){
                cnd += ` AND status = '${data.uStatus}' `;
              }
              if(data.uPh && data.uPh != ''){
                cnd += ` AND email like '%${data.uPh}%' `;
              }
              if(data.uName && data.uName != ''){
                cnd += ` AND name like '%${data.uName}%' `;
              }
              if(data.uId && data.uId != ''){
                cnd += ` AND ph like '%${data.uId}%' `;
              }

              sql = "SELECT id,pid,name,ph,email,type,balance,status,percentage FROM `user`  "+cnd;
              
              console.log(sql)
              let t = await commonObj.customSQL(sql);
              result(t);
            }else{
              result({SUCCESS:false,MESSAGE:'err'});
            }
          }else{
              result({SUCCESS:false,MESSAGE:'err'});
          }
        }else{
          result({SUCCESS:false,MESSAGE:'err'});
        }
      });
    },
};