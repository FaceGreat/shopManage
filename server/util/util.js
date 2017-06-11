/**
 * Created by Administrator on 2017/2/25.
 */
const async = require('async');

let util = {
  extend: function(target, source, flag) {
    for(let key in source) {
      if(source.hasOwnProperty(key))
        flag ?
          (target[key] = source[key]) :
          (target[key] === void 0 && (target[key] = source[key]));
    }
    return target;
  },
  //返回简单信息的封装
  jsonWrite:  function(res, ret) {
    if(typeof ret === 'undefined'){
      res.json({
        result : {
          code : false,
          msg : '操作失败'
        }
      });
    }else{
      res.json({
        result : ret
      });
    }
  },
  //断开连接
  closeConnection: function(res, result, connection) {
    //返回结果
    this.jsonWrite(res,result);

    //释放连接
    connection.release();
  },
  //通用合并查询sql字符串
  traversalSql :(sourceSql, childSql, pageModel, type) => {
    let pageSql = ' LIMIT ' + ((parseInt(pageModel.currentPage) - 1) * parseInt(pageModel.page)) + ',' +  parseInt(pageModel.page);
    if(childSql !== '') {
      if(type) {
        sourceSql += ' WHERE '
      }else{
        sourceSql += ' AND '
      }
    }
    sourceSql  = sourceSql + childSql + pageSql;
    return sourceSql;
  },
  //拼装查询条件sql
  traversal :(obj) => {
    let childSql = '';
    let childStr = [];
    for (key of Object.keys(obj)){
      if(obj[key] instanceof Object) {
        //若为时间段即为时间段
        if(obj[key].startDate !== '') {
          childStr.push(key + '>=' + "'" + obj[key].startDate +  "'");
        }
        if(obj[key].endDate !== '') {
          childStr.push( key + '<=' + "'" + obj[key].endDate +  "'" );
        }
      }else if(obj[key] !== ''){
        childStr.push(key + '=' + obj[key]);
      }
    }
    let len =  childStr.length;
    if( len !== 0 ) {
      childStr.forEach(( item, index )=> {
        if(index === 0 || index === len) {
          childSql += item;
        }else{
          childSql += ' AND ' + item;
        }
      });
    }
    return childSql;
  },
  //拼装查询指定条件下的数据总数
  traversalCountSql : (sourceSql, childSql, type) => {
    if(childSql !== '') {
      if(type) {
        sourceSql += ' AND '
      }else{
        sourceSql += ' WHERE '
      }
    }
    sourceSql  = sourceSql + childSql;
    return sourceSql;
  },

  //合并通用查询sql语句
  commonMergerSql : (sourceSql, findModel, pageModel,type)=> {
    let sql = '';
    let childSql = util.traversal(JSON.parse(findModel));
    sql = util.traversalSql(sourceSql, childSql, pageModel, type);
    return sql;
  },
  //合并通用查询指定条件下的数据总数sql语句
  commonMergerCountSql : (sourceSql, findModel,type) => {
    let sql = '';
    let childSql = util.traversal(JSON.parse(findModel));
    sql = util.traversalCountSql(sourceSql, childSql, type);
    return sql;
  },

  //通用提交多sql语句执行
  commonCommit: (res, sqlArr, connection)=> {
    async.series(sqlArr,(err, result) => {
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
          util.closeConnection(res, r(false,'获取数据失败'),connection);
        });
        return;
      }
      //提交
      connection.commit((err) => {
        if(err) {
          return;
        }
        util.closeConnection(res,  r(true,'获取数据成功'),connection);
      });
    });
  },

  //随机18位id
  uuid : function (len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },
};

module.exports = util;
