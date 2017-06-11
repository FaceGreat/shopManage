/**
 * Created by Administrator on 2017/5/10.
 */
//实现与mysql数据库交互
const mysql = require('mysql');
const async = require('async');
const $conf = require('../../conf/db');
const $util = require('../../util/util');
const $sql = require('../map/purchaseMap');


//使用连接池，提升性能
const pool = mysql.createPool($util.extend({}, $conf.mysql));


module.exports ={
  //添加进货单
  savePurchase : (req, res, next) => {
    const purchase = req.body;//参数
    const serialId = $util.uuid(8,10);//入库流水号
    const reviewId = $util.uuid(8,10);//入库审核号
    let values  = [];
    let len = purchase.purchaseCommodityData.length;
    let data = purchase.purchaseCommodityData;
    for(let i = 0; i< len;i++) {
      values.push([$util.uuid(8,10), serialId, data[i].commodityId, data[i].num]);
    }
    pool.getConnection((err, connection) => {
      connection.beginTransaction((err) => {
        if(err) {
          console.log(err);
          return;
        }
        //进货单中的进货信息
        let savePurchaseOfCommodity = (callback) => {
          connection.query($sql.savePurchaseOfCommodity, [values], (err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        //进货单的其他信息
        let savePurchaseOfOther = (callback) => {
          connection.query($sql.savePurchaseOfOther, [serialId, purchase.serialDate, parseFloat(purchase.totalMoney), reviewId, purchase.serialDesc],(err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        //进货单审核信息
        let savePurchaseOfReview = (callback) => {
          if(!req.session.user) {
            callback(err, null);
            return;
          }
          connection.query($sql.savePurchaseOfReview, [reviewId, req.session.user.id, new Date(), null, null, 1], (err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        async.series([savePurchaseOfReview ,savePurchaseOfOther, savePurchaseOfCommodity], (err, result) => {
          let r = function(code, result) {
            return {
              code : code,
              msg :result
            }
          };
          if(err) {
            //错误回滚
            connection.rollback(()=>{
              $util.closeConnection(res, r(false,'添加进货单失败'),connection);
            });
            return;
          }
          //提交
          connection.commit((err) => {
            if(err) {
              return;
            }
            $util.closeConnection(res,  r(true,'添加进货单成功'),connection);
          })
        });
      });
    });
  },
  //获取指定员工指定页数的进货单管理信息(我的进货单)
  findPurchaseByEmployeeAndPage: (req, res, next) => {
    if(!req.session.user) {
      return;
    }
    pool.getConnection((err, connection)=> {
      if(err) return;
      let findModel = req.query.findModel;
      let pageModel = JSON.parse(req.query.pageModel);
      connection.beginTransaction((err) => {
        let getList = (callback) => {
          connection.query($util.commonMergerSql($sql.findPurchaseByEmployeeAndPage, findModel, pageModel,false),
            req.session.user.id, (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
        };
        let getCount = (callback) => {
          connection.query($util.commonMergerCountSql($sql.findPurchaseCountByEmployee, findModel, true),
            req.session.user.id, (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
        };
        $util.commonCommit(res, [getList, getCount], connection);
      });
    });
  },
  //获取所有的进货单（管理员）
  findPurchaseByPage:(req, res, next) => {
    if(!req.session.user || req.session.user.roleId !== 5) {
      return;
    }
    pool.getConnection((err, connection)=> {
      if(err) return;
      let findModel = req.query.findModel;
      let pageModel = JSON.parse(req.query.pageModel);
      connection.beginTransaction((err) => {
        let getList = (callback) => {
          connection.query($util.commonMergerSql($sql.findPurchaseByPage, findModel, pageModel,false), (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
        };
        let getCount = (callback) => {
          connection.query($util.commonMergerCountSql($sql.findPurchaseCountByAdmin, findModel, true),
            req.session.user.id, (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
        };
        $util.commonCommit(res, [getList, getCount], connection);
      });
    });
    /*pool.getConnection((err, connection)=> {
      connection.query($sql.findPurchaseByPage, (err, result) => {
        let r = {};
        if(result) {
          r = {
            code : true,
            result: result
          }
        }
        $util.closeConnection(res, r,connection);
      });
    });*/
  },
  //查询进货单操作信息
  findPurchaseListMessage : (req, res, next) => {
    const params = req.query;
    pool.getConnection((err, connection) => {
      connection.beginTransaction((err) => {
        if (err) {
          console.log(err);
          return;
        }
        let findCommodityByPurchaseId = (callback) => {
          connection.query($sql.findCommodityByPurchaseId, [params.serialId],(err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        let findReviewByReviewId = (callback) => {
          connection.query($sql.findReviewByReviewId, [params.reviewId],(err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        let findPurchaseOtherByPurchaseId = (callback) => {
          connection.query($sql.findPurchaseOtherByPurchaseId, [params.serialId],(err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        async.series([findCommodityByPurchaseId ,findReviewByReviewId, findPurchaseOtherByPurchaseId], (err, result) => {
          let r = function(code, msg) {
            return {
              code : code,
              result :result,
              msg : msg
            }
          };
          if(err) {
            //错误回滚
            connection.rollback(()=>{
              $util.closeConnection(res, r(false,'获取进货单失败'),connection);
            });
            return;
          }
          //提交
          connection.commit((err) => {
            if(err) {
              return;
            }
            $util.closeConnection(res,  r(true,'获取进货单成功'),connection);
          })
        });
      });
    });
  },
  //获取指定员工指定页数的进货单商品
  findAllPurchaseByEmployeeAndPage:(req, res, next) => {
    /*let sql = '';
    let param=[];*/
    let findModel = req.query.findModel;
    let pageModel = JSON.parse(req.query.pageModel);
    if(!req.session.user) {
      return;
    }
    pool.getConnection((err, connection) => {
      connection.beginTransaction((err) => {
        if(err) return;
        //获取指定数据
        let getList = (callback) => {
          let sql = '';
          let param = [];
          if(req.session.user.roleId === 5) {
            sql = $sql.findAllPurchaseByAdminAndPage;
          }else{
            sql = $sql.findAllPurchaseByEmployeeAndPage;
            param.push(req.session.user.id);
          }
          connection.query($util.commonMergerSql(sql, findModel, pageModel, false), param, (err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        //获取指定查询条件的总数
        let getCount = (callback) => {
          let countSql = '';
          let countParam = [];
          if(req.session.user.roleId === 5) {
            countSql = $sql.findAllPurchaseCountByAdmin;
          }else{
            countSql = $sql.findAllPurchaseCountByEmployee;
            countParam.push(req.session.user.id);
          }
          connection.query($util.commonMergerCountSql(countSql, findModel,true), countParam, (err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        $util.commonCommit(res, [getList, getCount], connection);
      });
    });
    /*if(req.session.user.roleId === 5) {
      sql = $sql.findAllPurchaseByAdminAndPage;
    }else{
      sql = $sql.findAllPurchaseByEmployeeAndPage;
      param.push(req.session.user.id);
    }
    pool.getConnection((err, connection) => {
      connection.query(sql, param, (err, result) => {
        if(result) {
          result = {
            code : true,
            result : result
          }
        }
        $util.closeConnection(res, result, connection);
      })
    });*/
  },
  //审核进货单
  reviewPurchase : (req, res, next) => {

    if(!req.session.user) {
      res.json({
        result : {
          code : false,
          msg : '未登录'
        }
      });
    }else if(req.session.user.roleId !== 5){
      res.json({
        result : {
          code : false,
          msg : '用户没有操作权限'
        }
      });
    }else{
      const param = req.body;
      const values = [];
      let len = param.commodities.length;
      for(let i = 0; i< len;i++) {
        values.push([param.commodities[i].num, param.commodities[i].commodityId]);
      }
      pool.getConnection((err, connection) => {
        connection.beginTransaction((err) => {
          if (err) {
            console.log(err);
            return;
          }
          //更新进货单的商品信息
          let updateCommodity = (callback) =>{
            async.forEach(values, function(item, callback) {
              connection.query($sql.updatePurchaseToStore, [item[0], item[1]], (err, result) => {
                if (err) {
                  callback(err, null);
                  return;
                }
                callback(null, result);
              });
            },()=> {
              callback(null,'');
            });
          };
          let updateReview = (callback) => {
            connection.query($sql.updatePurchaseToReview, [req.session.user.id, new Date(), param.reviewId], (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            })
          };
          async.series([updateCommodity ,updateReview], (err, result) => {
            let r = function(code, msg) {
              return {
                code : code,
                msg : msg
              }
            };
            if(err) {
              //错误回滚
              connection.rollback(()=>{
                $util.closeConnection(res, r(false,'审核进货单失败'),connection);
              });
              return;
            }
            //提交
            connection.commit((err) => {
              if(err) {
                return;
              }
              $util.closeConnection(res,  r(true,'审核进货单成功'),connection);
            })
          });
        });
      });
    }
  },

  //删除指定id的进货单
  deletePurchaseById : (req, res, next) => {
    const param = req.params;//参数
    pool.getConnection((err, connection) => {
      connection.beginTransaction((err) => {
        if(err) {
          console.log(err);
          return;
        }
        //盘点单的商品信息
        let deletePurchaseOfCommodity = (callback) => {
          connection.query($sql.deletePurchaseOfCommodity, param.serialId, (err, result) => {
            console.log(1);
            console.log(err);
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        //进货单的其他信息
        let deletePurchaseOfOther = (callback) => {
          connection.query($sql.deletePurchaseOfOther, param.serialId, (err, result) => {
            console.log(2);
            console.log(err);
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        //进货单的审核信息
        let deletePurchaseByReview = (callback) => {
          connection.query($sql.deletePurchaseByReview, param.reviewId, (err, result) => {
            console.log(3);
            console.log(err);
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        async.series([deletePurchaseOfCommodity, deletePurchaseOfOther, deletePurchaseByReview], (err, result) => {
          let r = function(code, result) {
            return {
              code : code,
              msg :result
            }
          };
          if(err) {
            //错误回滚
            connection.rollback(()=>{
              $util.closeConnection(res, r(false,'删除进货单据失败'),connection);
            });
            return;
          }
          //提交
          connection.commit((err) => {
            if(err) {
              return;
            }
            $util.closeConnection(res,  r(true,'删除进货单据成功'),connection);
          })
        });
      });
    });
  }

};
