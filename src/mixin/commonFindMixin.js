/**
 * Created by Administrator on 2017/6/1.
 */


let commonFindMixin = {
  data() {
    return {
      findModel : {},
      sql : ''
    }
  },
  methods : {
    //初始化查询条件
    initCommonFind() {
      this.findModel = {
        startDate : '', //进货单最早时间
        endDate : '',//进货单最迟时间
        status : '',//进货单审核状态
      }
    },
    //设置查询条件
    updateCommonFind(props) {
      this.findModel.message = props.message || '选择时间段';
      this.findModel.callback = props.callback;
    },
    formatsStartDate(startDate){
      if(startDate === '') {
        return '';
      }else{
        let date = new Date(startDate);
        date.setDate(date.getDate()+1);
        return date.toISOString().replace(/([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/g, '00:00:00');
      }
    },
    formatsEndDate(endDate){
      if(endDate === '') {
        return '';
      }else{
        let date = new Date(endDate);
        date.setDate(date.getDate()+1);
        return  date.toISOString().replace(/([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/g, '24:00:00');
      }
    },
   }
};

module.exports = commonFindMixin;
