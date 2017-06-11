/**
 * Created by Administrator on 2017/4/27.
 */
//实现与mysql数据库交互
const mysql = require('mysql');
const $conf = require('../../conf/db');
const $util = require('../../util/util');
const $sql = require('../map/userMap');
const $cipher = require('../../util/cipher');


//使用连接池，提升性能
const pool = mysql.createPool($util.extend({}, $conf.mysql));


module.exports = {
  role　: {
    saveRole : (req, res, next) =>{
      pool.getConnection((err, connection)=> {
        //获取参数
        const param = req.body;
        //建立连接，保存值
        connection.query($sql.role.saveRole, [param.name], (err, result) => {
          if(result) {
            result = {
              code : 200,
              msg : '添加新部门成功'
            }
          }
          $util.closeConnection(res, result,connection);
        });
      });
    },
    //更新指定角色信息
    updateRoleById :(req, res, next) => {
      pool.getConnection((err, connection)=> {
        //获取参数
        const param = req.body;
        //建立连接，保存值
        connection.query($sql.role.updateRoleById, [param.name, param.roleId], (err, result) => {
          if(result) {
            result = {
              code : 200,
              msg : '更新部门信息成功'
            }
          }
          $util.closeConnection(res, result,connection);
        });
      });
    },
    //获取指定页数的角色信息
    getAllRoleByPage : (req, res, next) =>{
      pool.getConnection((err, connection) => {
        if(err) return;
        let pageModel = JSON.parse(req.query.pageModel);
        connection.beginTransaction((err) => {
          let getList = (callback) => {
            connection.query($util.commonMergerSql($sql.role.getAllRoleByPage, JSON.stringify({}), pageModel, true), (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
          };
          let getCount = (callback) =>{
            connection.query($util.commonMergerCountSql($sql.role.findRoleCount,JSON.stringify({}) ,true), (err, result) => {
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
    //获取所有角色信息，用于下拉选择
    getRoleBySelect : (req, res, next) => {
      pool.getConnection((err, connection) => {
        connection.query($sql.role.getRoleBySelect, (err, result) => {
          let r = {};
          if (result) {
            r = {
              code: true,
              result: result
            }
          }
          $util.closeConnection(res, r, connection);
        });
      });
    },
    //删除指定角色信息
    deleteRoleId : (req, res, next) => {
      pool.getConnection((err, connection) => {
        const param = req.params;
        connection.query($sql.role.deleteRoleId, param.roleId, (err, result) => {
          if(result){
            result={
              code : true,
              msg : '删除部门信息成功'
            }
          }
          $util.closeConnection(res, result,connection);
        })
      })
    },
  },
  employee : {
    //员工登录
    login : (req, res, next) =>{
      pool.getConnection((err, connection) => {
        const param = req.query;
        connection.query($sql.employee.login, [param.username, $cipher.encrypt(param.password)], (err, result) => {
          if(result.length !== 0) {
            if(result[0].Status === -2) {
              result = {
                code : false,
                msg : '登录失败，该用户已被禁止使用本系统',
              }
            }else{
              //保存用户登录信息
              req.session.user = {
                id : result[0].employeeId,
                name : result[0].name,
                roleId : result[0].roleId
              };
              req.session.userPass = {
                password : $cipher.encrypt(param.password)
              };
              result = {
                code : true,
                msg : '登录成功',
              }
            }

          }else{
            result = {
              code : false,
              msg : '用户名或密码错误',
            }
          }
          $util.closeConnection(res, result,connection);
        })
      });
    },
    //保存一个员工信息
    saveEmployee:(req, res, next) => {
      pool.getConnection((err, connection) => {
        const param = req.body;
        connection.query($sql.employee.saveEmployee, [$util.uuid(5,10), param.name, param.roleId, param.position, param.contactPhone, param.contactAddress, param.IdCard, param.entryTime, param.sex, param.Status, $cipher.encrypt('123456')],
          (err, result) => {
            if(result) {
              result={
                code : true,
                msg : '添加新员工信息成功'
              }
            }
            $util.closeConnection(res, result,connection);
          });
      });
    },
    //更新指定员工信息
    updateEmployeeById : (req, res, next) => {
      pool.getConnection((err, connection)=> {
        //获取参数
        const param = req.body;
        //建立连接，保存值
        connection.query($sql.employee.updateEmployeeById, [param.name, param.roleId, param.position, param.contactPhone, param.contactAddress, param.IdCard, param.entryTime, param.sex, param.Status, param.employeeId],
          (err, result) => {
          if(result) {
            result = {
              code : 200,
              msg : '更新员工信息成功'
            }
          }
          $util.closeConnection(res, result,connection);
        });
      });
    },
    //更新员工使用状态
    updateEmployeeStatusById : (req, res, next) => {
      pool.getConnection((err, connection)=> {
        //获取参数
        const param = req.body;
        //建立连接，保存值
        connection.query($sql.employee.updateEmployeeStatusById, [param.Status === 1 ? -1 : 1, param.employeeId],
          (err, result) => {
            if(result) {
              result = {
                code : 200,
                msg : '更新员工使用状态成功'
              }
            }
            $util.closeConnection(res, result,connection);
          });
      });
    },
    //获取指定页数的员工信息
    getEmployeeByPage: (req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) return;
        let pageModel = JSON.parse(req.query.pageModel);
        let propsModel = JSON.parse(req.query.propsModel);
        connection.beginTransaction((err) => {
          let sql = '';
          let queryParam = [];
          if(parseInt(propsModel.roleId) === 0){
            if(propsModel.content === '') {
              sql = '';
            }else{
              sql = 'concat(e.employeeId, e.name, r.name, e.position, e.contactPhone, e.contactAddress, e.IdCard, e.sex, e.Status) like "%' + propsModel.content  +'%"';
            }
          }else{
            sql = 'e.roleId='+ parseInt(propsModel.roleId);
            if(propsModel.content !== '') {
              sql += ' AND concat(e.employeeId, e.name, r.name, e.position, e.contactPhone, e.contactAddress, e.IdCard, e.sex, e.Status) like "%'+ propsModel.content +'%"';
            }
          }
          if(sql !== '') {
            sql = ' AND  ' + sql;
          }
          let getList = (callback) => {
            connection.query($util.commonMergerSql($sql.employee.getEmployeeByPage + sql, JSON.stringify({}), pageModel, true), (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
          };
          let getCount = (callback) =>{
            console.log(sql);
            connection.query($util.commonMergerCountSql($sql.employee.findEmployeeCount + sql,JSON.stringify({}) ,true), (err, result) => {
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
     /* pool.getConnection((err, connection) => {
        const param = req.query;
        let sql = '';
        let queryParam = [];
        if(parseInt(param.roleId) === 0){
          if(param.content === '') {
            sql = $sql.employee.getEmployeeByPage;
          }else{
            sql = $sql.employee.fuzzyQueryByPage;
            queryParam.push(param.content);
          }
        }else{
          queryParam.push(parseInt(param.roleId));
          if(param.content === '') {
            sql = $sql.employee.getEmployeeByPageAndRoleId;
          }else{
            sql = $sql.employee.fuzzyQueryByPageAndRoleId;
            queryParam.push(param.content);
          }
        }
        connection.query(sql, queryParam, (err, result) => {
          let r = {};
          if(result) {
            r = {
              code : true,
              result : result
            }
          }
          $util.closeConnection(res, r,connection);
        });
      });*/
    },
    //获取指定员工号的指定的员工信息
    getEmployeeById : (req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.query;
        connection.query($sql.employee.getEmployeeById, param.employeeId, (err, result) => {
          if(result) {
            result = {
              code : true,
              result : result
            }
          }
          $util.closeConnection(res, result,connection);
        });
      });
    },
    //删除指定id的员工信息
    deleteEmployeeById :(req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.params;
        connection.query($sql.employee.updateEmployeeStatusById, [-2, param.employeeId], (err, result) => {
          if(result){
            result={
              code : true,
              msg : '删除员工信息成功'
            }
          }
          $util.closeConnection(res, result,connection);
        });
      });
    }
  },
  provide : {
    //添加一个供应商信息
    saveProvide:(req, res, next)=> {
      pool.getConnection((err, connection)=> {
        //获取参数
        const param = req.body;
        //建立连接，保存值
        connection.query($sql.provide.saveProvide, [$util.uuid(24,16), param.name, param.contactPerson, param.contactPhone, param.contactAddress, param.contactEmail, param.categoryId, param.Status, param.remark], (err, result) => {
          if(result) {
            result = {
              code : 200,
              msg : '添加供应商信息成功'
            }
          }
          $util.closeConnection(res, result,connection);
        });
      });
    },
    //获取指定id的供应商详情
    getProvideById :(req, res, next) => {
      pool.getConnection((err, connection) => {
        const param = req.params;
        connection.query($sql.provide.getProvideById,[param.provideId], (err, result) => {
          let r ={};
          if(result) {
              r= {
                code : true,
                result : result
              }
          }
          $util.closeConnection(res, r,connection);
        });
      });
    },
    //指定页数的供应商数据
    getProvideByPage : (req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) return;
        let findModel = req.query.findModel;
        let pageModel = JSON.parse(req.query.pageModel);
        let sql = '';
        let judge = parseInt(JSON.parse(findModel)['p.categoryId']) === 0 ? true : false;
        if(judge){
          findModel = JSON.stringify({});
        }
        sql = $util.commonMergerSql($sql.provide.getProvideByPageAndCategoryId, findModel, pageModel, false);
        connection.beginTransaction((err) => {
          let getList = (callback) => {
            connection.query(sql, (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
          };
          let getCount = (callback) =>{
            connection.query($util.commonMergerCountSql($sql.provide.findProvideCount,findModel ,false), (err, result) => {
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

    //获取供应商信息，用于下拉选择选项
    getProvideBySelect : (req, res, next) => {
      pool.getConnection((err, connection) => {
        connection.query($sql.provide.getProvideBySelect, (err, result) => {
          let r= {};
          if(result) {
            r={
              code: true,
              result : result
            }
          }
          $util.closeConnection(res, r, connection);
        });
      });
    },
    //更新指定供应商信息
    updateProvideById : (req, res, next) =>{
      pool.getConnection((err, connection) => {
        const param = req.body;
        connection.query($sql.provide.updateProvideById, [param.name, param.contactPerson, param.contactPhone, param.contactAddress, param.contactEmail, param.categoryId, param.Status, param.remark, param.provideId], (err, result) => {
          console.log(err);
          if(result) {
            result = {
              code : true,
              msg : '更新供应商信息成功'
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //更新指定供应商信息的状态
    updateProvideStatusById : (req, res, next) => {
      pool.getConnection((err, connection) => {
        const param = req.body;
        connection.query($sql.provide.updateProvideStatusById, [param.Status === 1? -1 : 1, param.provideId], (err, result) => {
          if(result) {
            result = {
              code : true,
              msg : '更新供应商状态成功'
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //删除指定供应商信息
    deleteProvideById : (req, res, next) =>{
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.params;
        connection.query($sql.provide.deleteProvideById, param.provideId, (err, result) => {
          if(result){
            result={
              code : true,
              msg : '删除供应商信息成功'
            }
          }
          $util.closeConnection(res, result,connection);
        })
      })
    }
  },
  member : {
    /**
     * 会员类型
     */
    //保存会员类型信息
    saveMemberDiscount: (req, res, next) => {
      pool.getConnection((err, connection) =>{
        if(err) throw err;
        const param = req.body;
        connection.query($sql.member.saveMemberDiscount, [param.name, parseFloat(param.discount), param.timesLimit, param.costLimit], (err, result) => {
          if(result) {
            result = {
              code : true,
              msg : '添加会员类型成功'
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //修改会员类型
    updateMemberDiscountById: (req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.body;
        connection.query($sql.member.updateMemberDiscountById, [param.name, parseFloat(param.discount), param.timesLimit, param.costLimit,  param.discountId],
          (err, result) =>{
          if(result) {
            result = {
              code : true,
              msg : '更新会员类型信息成功'
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //删除会员类型信息
    deleteMemberDiscountById:(req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.params;
        connection.query($sql.member.deleteMemberDiscountById, param.discountId, (err, result) => {
          if(result) {
            result = {
              code : true,
              msg : '删除会员类型成功'
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //获取指定页数的会员类型信息
    getMemberDiscountByPage:(req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) return;
        let pageModel = JSON.parse(req.query.pageModel);
        connection.beginTransaction((err) => {
          let getList = (callback) => {
            connection.query($util.commonMergerSql($sql.member.getMemberDiscountByPage, JSON.stringify({}), pageModel, true), (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
          };
          let getCount = (callback) =>{
            connection.query($util.commonMergerCountSql($sql.member.findMemberDiscountCount,JSON.stringify({}) ,true), (err, result) => {
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
    //获取指定页数的会员类型信息
    getMemberByTypeAndPage:(req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.query;
        connection.query($sql.member.getMemberByTypeAndPage, param.discountId, (err, result) => {
          if(result) {
            result = {
              code : true,
              result : result
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //获取所有会员类型，用户下拉选择
    getAllMemberDiscount: (req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw  err;
        connection.query($sql.member.getAllMemberDiscount, (err, result) => {
          if(result) {
            result = {
              code : true,
              result : result
            }
          }
          $util.closeConnection(res, result, connection);
        });
      })
    },
    /**
     * 会员信息
     */
    //保存一个新会员信息
    saveMember:(req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.body;
        connection.query($sql.member.saveMember, [param.memberId, param.name, param.memberPhone, param.discountId, 0,  0, 1, new Date()],
          (err, result) => {
            if(result) {
              result = {
                code : true,
                msg : '添加新会员成功'
              }
            }
            $util.closeConnection(res, result, connection);
          });
      });
    },
    //更新会员个人信息
    updateMemberById:(req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.body;
        console.log(param);
        connection.query($sql.member.updateMemberById, [param.name, param.memberPhone,  param.discountId, param.memberId],(err, result) => {
          if(result) {
            result = {
              code : true,
              msg : '更新会员信息成功'
            }
          }
          $util.closeConnection(res,result, connection);
        });
      });
    },
    //更新会员状态
    updateMemberStatus:(req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.body;
        connection.query($sql.member.updateMemberStatus, [param.remark, param.memberId],(err, result) => {
          if(result) {
            result = {
              code : true,
              msg : '更新会员状态成功'
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //删除指定会员信息
    deleteMemberById: (req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.params;
        console.log(param);
        connection.query($sql.member.deleteMemberById, param.memberId, (err, result) => {
          if(result) {
            result = {
              code : true,
              msg : '删除指定会员信息成功'
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //清除禁用状态的会员信息
    removeMemberByStatus : (req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        connection.query($sql.member.removeMemberByStatus, (err, result) => {
          if(result) {
            result = {
              code : true,
              msg : '清除禁用会员信息成功'
            }
          }
          $util.closeConnection(res,result, connection);
        });
      });
    },
    //获取指定页数的会员信息
    getMemberByPage:(req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) return;
        let findModel = req.query.findModel;
        let pageModel = JSON.parse(req.query.pageModel);
        let sql = '';
        let judge = parseInt(JSON.parse(findModel)['m.discountId']) === '' ? true : false;
        if(judge){
          findModel = JSON.stringify({});
        }
        sql = $util.commonMergerSql($sql.member.getMemberByPage, findModel, pageModel, false);
        connection.beginTransaction((err) => {
          let getList = (callback) => {
            connection.query(sql, (err, result) => {
              if (err) {
                callback(err, null);
                return;
              }
              callback(null, result);
            });
          };
          let getCount = (callback) =>{
            connection.query($util.commonMergerCountSql($sql.member.findMemberCount,findModel ,false), (err, result) => {
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
    //获取指定的可使用的会员信息
    findAllBillMember: (req, res, next) =>{
      pool.getConnection((err, connection) => {
        if(err) return;
        let pageModel = JSON.parse(req.query.pageModel);
        connection.beginTransaction((err) => {
          let getList = (callback) => {
            connection.query($util.commonMergerSql($sql.member.findAllBillMember, JSON.stringify({}), pageModel, true), (err, result) => {
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
            connection.query($util.commonMergerCountSql($sql.member.findMemberCountToBill,JSON.stringify({}) ,true), (err, result) => {
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
      /*pool.getConnection((err, connection) =>{
        if(err) throw err;
        connection.query($sql.member.findAllBillMember, (err,result) => {
          if(result) {
            result = {
              code : true,
              result : result
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });*/
    },
    //获取所有禁用状态会员的描述
    getMemberRemark : (req, res, next) =>{
      pool.getConnection((err, connection) => {
        if(err) throw err;
        connection.query($sql.member.getMemberRemark, (err, result) => {
          if(result) {
            result = {
              code : true,
              result : result
            }
          }
          $util.closeConnection(res, result, connection);
        });
      });
    },
    //获取指定id的会员信息
    getMemberById: (req, res, next) => {
      pool.getConnection((err, connection) => {
        if(err) throw err;
        const param = req.query;
        connection.query($sql.member.getMemberById, param.memberId, (err, result) => {
          if(result) {
            result = {
              code : true,
              result : result
            }
          }
          $util.closeConnection(res, result, connection);
        })
      })
    }
  }
};
