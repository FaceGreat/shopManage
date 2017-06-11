/**
 * Created by Administrator on 2017/5/1.
 */
const mysql = require('mysql');
const async = require('async');
const $conf = require('../../conf/db');
const $util = require('../../util/util');
const $sql = require('../map/commodityMap');


//使用连接池，提升性能
const pool = mysql.createPool($util.extend({}, $conf.mysql));
let commodityModule = {
    //保存一条新的商品类型
    saveSort:(req, res, next) =>{
      pool.getConnection((err, connection)=> {
        //获取参数
        const param = req.body;
        //建立连接，保存值
        connection.query($sql.saveSort, [param.name],
          (err, result) => {
            if(result) {
              result = {
                code : true,
                msg : '添加商品类型成功'
              }
            }
            $util.closeConnection(res, result,connection);
          });
      });
    },
    //保存一条新的商品单位
    saveUnit : (req, res, next) => {
      pool.getConnection((err, connection)=> {
        //获取参数
        const param = req.body;
        //建立连接，保存值
        connection.query($sql.saveUnit, [param.name],
          (err, result) => {
            if(result) {
              result = {
                code : true,
                msg : '添加商品单位成功'
              }
            }
            $util.closeConnection(res, result,connection);
          });
      });
    },
    //保存商品信息
    saveCommodity : (req, res, next) => {
      const param = req.body;
      const commodityId = $util.uuid(8,10);
      pool.getConnection((err, connection) => {
        connection.beginTransaction((err) => {
          if (err) {
            console.log(err);
            return;
          }
          let saveCommodity = (callback) => {
            connection.query($sql.saveCommodity, [commodityId, param.categoryId, $util.uuid(12, 10), param.name, param.format, param.unitId, param.retailPrice, param.costPrice,  param.quantityUpperLimit, param.quantityLowerLimit, new Date(), param.provideId, param.Status, param.remark], (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            })
          };
          let createStore = (callback) => {
            connection.query($sql.createOneStore, [$util.uuid(8, 10), commodityId, 0], (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            })
          };
          async.series([saveCommodity, createStore], (err, result) => {
            let r = function(code, result) {
              return {
                code : code,
                msg :result
              }
            };
            if(err) {
              //错误回滚
              connection.rollback(()=>{
                $util.closeConnection(res, r(false,'添加商品资料失败'),connection);
              });
              return;
            }
            //提交
            connection.commit((err) => {
              if(err) {
                return;
              }
              $util.closeConnection(res,  r(true,'添加商品资料成功'),connection);
            })
          });
        });
      });
    },

    //获取指定页数的商品类型
   findSortByPage : (req, res, next)=>{
     pool.getConnection((err, connection) => {
       if(err) return;
       let pageModel = JSON.parse(req.query.pageModel);
       connection.beginTransaction((err) => {
         let getList = (callback) => {
           connection.query($util.commonMergerSql($sql.findSortByPage, JSON.stringify({}), pageModel, true), (err, result) => {
             if (err) {
               callback(err, null);
               return;
             }
             callback(null, result);
           });
         };
         let getCount = (callback) =>{
           connection.query($util.commonMergerCountSql($sql.findSortCount,JSON.stringify({}) ,true), (err, result) => {
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
    /* pool.getConnection((err, connection)=> {
       connection.query($sql.findSortByPage, (err, result) => {
         let r ={};
         if(result) {
           r = {
             code : true,
             result : result
           };
           $util.closeConnection(res, r,connection);
         }
       })
     })*/
   },
  //获取所有指定的商品类型
  findAllSort : (req, res, next)=>{
    pool.getConnection((err, connection)=> {
      connection.query($sql.findAllSort, (err, result) => {
        let r ={};
        if(result) {
          r = {
            code : true,
            result : result
          };
          $util.closeConnection(res, r,connection);
        }
      })
    })
  },
  //获取指定页数的商品单位
  findUnitByPage : (req, res, next) => {
    pool.getConnection((err, connection) => {
      if(err) return;
      let pageModel = JSON.parse(req.query.pageModel);
      connection.beginTransaction((err) => {
        let getList = (callback) => {
          connection.query($util.commonMergerSql($sql.findUnitByPage, JSON.stringify({}), pageModel, true), (err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        let getCount = (callback) =>{
          connection.query($util.commonMergerCountSql($sql.findUnitCount,JSON.stringify({}) ,true), (err, result) => {
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
      connection.query($sql.findUnitByPage, (err, result) => {
        let r ={};
        if(result) {
          r = {
            code : true,
            result : result
          };
        }
        $util.closeConnection(res, r,connection);
      })
    })*/
  },
  //获取所有指定的商品单位
  findAllUnit : (req, res, next) => {
    pool.getConnection((err, connection) => {
      connection.query($sql.findAllUnit, (err, result) => {
        let r ={};
        if(result) {
          r = {
            code : true,
            result : result
          }
        }
        $util.closeConnection(res, r, connection);
      });
    });
  },
  //获取指定页数的商品资料信息
  findCommodityByPage : (req, res, next) => {
    pool.getConnection((err, connection) => {
      if(err) return;
      let pageModel = JSON.parse(req.query.pageModel);
      let findModel = JSON.parse(req.query.findModel);
      connection.beginTransaction((err) => {
        let sql = '';
        if(findModel.categoryId !== '') {
          sql += ' AND c.categoryId=' +  parseInt(findModel.categoryId);
        }
        if(findModel.quantityLimit !== 0) {
          if(findModel.quantityLimit === 1) {
            sql += ' AND s.FactStoreNum > c.quantityUpperLimit';
          }else if(findModel.quantityLimit === -1) {
            sql += ' AND s.FactStoreNum < c.quantityLowerLimit';
          }
        }
        if(findModel.content !== '') {
          sql += ' AND concat(c.name, c.barcode,c.commodityId, g.name, u.name)like "%' + findModel.content  +'%"';
        }
        let getList = (callback) => {
          connection.query($util.commonMergerSql($sql.findCommodityByPage + sql, JSON.stringify({}), pageModel, true), (err, result) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        let getCount = (callback) =>{
          connection.query($util.commonMergerCountSql($sql.findCommodityCount + sql,JSON.stringify({}) ,true), (err, result) => {
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
    /*pool.getConnection((err, connection) => {
      const param = req.query;
      let sql = '';
      let queryParam = [];
      if(parseInt(param.categoryId) === 0){
        sql = $sql.findCommodityByPage
      }else{
        sql = $sql.findCommodityByPageAndCategoryId;
        queryParam.push(param.categoryId);
      }
      connection.query(sql,queryParam, (err, result) => {
        let r = {};
        if(result) {
          r = {
            code : true,
            result : result
          }
        }
        $util.closeConnection(res, r, connection);
      });
    });*/
  },
  //获取指定字段的所有商品信息，用于进货管理，库存不为0
  getSelectCommodityList : (req, res, next) => {
    pool.getConnection((err, connection) => {
      if(err) return;
      let pageModel = JSON.parse(req.query.pageModel);
      let findModel = JSON.parse(req.query.propsModel);
      connection.beginTransaction((err) => {
        let sql = '';
        if(findModel.categoryId !== '') {
          sql += ' AND c.categoryId=' +  parseInt(findModel.categoryId);
        }
        if(findModel.content !== '') {
          sql += ' AND concat(c.name, c.barcode,c.commodityId, u.name)like "%' + findModel.content  +'%"';
        }
        let getList = (callback) => {
          connection.query($util.commonMergerSql($sql.getSelectCommodityListByPage + sql, JSON.stringify({}), pageModel, true), (err, result) => {
            console.log(1);
            console.log(err);
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, result);
          });
        };
        let getCount = (callback) =>{
          connection.query($util.commonMergerCountSql($sql.findCommodityCount + sql + '  AND s.FactStoreNum !=0',JSON.stringify({}) ,true), (err, result) => {
            console.log(2);
            console.log(err);
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
    /*pool.getConnection((err, connection) => {
      const param = req.query;
      let sql = '';
      let queryParam = [];
      if(parseInt(param.categoryId) === 0){
        sql = $sql.getSelectCommodityListByPage
      }else{
        sql = $sql.getSelectCommodityListByPageAndCategoryId;
        queryParam.push(param.categoryId);
      }
      connection.query(sql,queryParam, (err, result) => {
        let r = {};
        if(result) {
          r = {
            code : true,
            result : result
          }
        }
        $util.closeConnection(res, r, connection);
      });
    });*/
  },
  //更新指定id的商品类型
  updateSortById: (req, res, next) => {
      pool.getConnection((err, connection)=> {
        if(err) throw error;
        const param = req.body;
        connection.query($sql.updateSortById,[param.name, param.categoryId], (err, result) =>{
          if(result) {
            result = {
              code : true,
              msg : '更新商品类型信息成功'
            }
          }
          $util.closeConnection(res, result,connection);
        })
      });
  },
  //更新指定id的商品单位信息
  updateUnitById : (req, res, next) => {
    pool.getConnection((err, connection)=> {
      if(err) throw error;
      const param = req.body;
      connection.query($sql.updateUnitById,[param.name, param.unitId], (err, result) =>{
        if(result) {
          result = {
            code : true,
            msg : '更新商品单位信息成功'
          }
        }
        $util.closeConnection(res, result,connection);
      })
    });
  },
  //更新商品信息
  updateCommodityById : (req, res, next) => {
    pool.getConnection((err, connection) => {
      const param = req.body;
      connection.query($sql.updateCommodityById, [param.categoryId, param.barcode, param.name, param.format, param.unitId, param.retailPrice, param.costPrice, param.quantityUpperLimit, param.quantityLowerLimit, param.provideId, param.Status, param.remark, param.commodityId], (err, result) =>{
        if(result) {
          result ={
            code : true,
            msg : '更新商品资料信息成功'
          }
        }
        $util.closeConnection(res, result,connection);
      });
    });
  },
  //更新指定商品资料的状态
  updateCommodityStatusById : (req, res, next) => {
    pool.getConnection((err, connection) => {
      const param = req.body;
      connection.query($sql.updateCommodityStatusById, [param.Status === 1? -1 : 1, param.commodityId], (err, result) =>{
        if(result) {
          result ={
            code : true,
            msg : '更新商品状态信息成功'
          }
        }
        $util.closeConnection(res, result,connection);
      });
    });
  },
  //删除指定商品类型
  deleteSortById : (req, res, next) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      const param = req.params;
      connection.query($sql.deleteSortById, param.categoryId, (err, result) => {
        if (result) {
          result = {
            code: true,
            msg: '删除商品类型成功'
          }
        }
        $util.closeConnection(res, result, connection);
      })
    })
  },
  //删除指定商品单位
  deleteUnitById:(req, res, next) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      const param = req.params;
      connection.query($sql.deleteUnitById, param.unitId, (err, result) => {
        if (result) {
          result = {
            code: true,
            msg: '删除商品单位成功'
          }
        }
        $util.closeConnection(res, result, connection);
      })
    })
  },
  //删除指定id的商品信息
  deleteCommodityById :(req, res, next) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      const param = req.body;
      //设置状态为-2，不真正删除，为后续计算盈亏做准备
      connection.query($sql.updateCommodityStatusById, [-2, param.commodityId], (err, result) => {
        if (result) {
          result = {
            code: true,
            msg: '删除商品资料信息成功'
          }
        }
        $util.closeConnection(res, result, connection);
      })
    })
  },
  //模糊查询商品
  findLikeCommodity: (req, res, next)=>{
    pool.getConnection((err, connection) => {
      if(err) throw err;
      const param = req.query;
      connection.query($sql.findLikeCommodity, param.commodityKey, (err, result) => {
        if(result) {
          result = {
            code : true,
            result : result
          }
        }
        $util.closeConnection(res, result, connection);
      });
    });
  }

};

module.exports = commodityModule;
