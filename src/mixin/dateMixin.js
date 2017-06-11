/**
 * Created by Administrator on 2017/5/24.
 */
let date = {
  methods : {
    //时间格式化方法
    dateFtt(fmt,date){ //author: meizz
      let o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
      };
      if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      return fmt;
    },
    //日期格式化
    dataFormat(row, column) {
      let data = new Date(row[column.property]);
      return this.dateFtt("yyyy-MM-dd",data);
    },
    //日期+时间格式化
    timeFormat(row, column) {
      if(row[column.property] === null) {
        return '';
      }
      let data = new Date(row[column.property]);
      return this.dateFtt("yyyy-MM-dd hh:mm:ss",data);
    },
    timeFormatByDate(data) {
      return this.dateFtt("yyyy-MM-dd hh:mm:ss",data);
    }
  }
};

module.exports = date;
