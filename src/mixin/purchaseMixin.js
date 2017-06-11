/**
 * Created by Administrator on 2017/5/31.
 */
let deleteMixin = require('./deleteMixin');

let purchaseModule = {
  mixins : [deleteMixin],
  data() {
    return {
      serialId : '',
      reviewId : '',
      type : ''
    }
  },
  methods :{
    removePurchaseList() {
      this.serialId =  arguments[0] || this.serialId;
      this.type = arguments[1];
      this.reviewId = arguments[2];
      this.openMsgbox({
        title : '删除进货单',
        message : '确定删除编号为【 '+ this.serialId +' 】的进货单',
        callback : this.deletePurchaseList
      });
    },
    //确认删除
    deletePurchaseList() {
      if(this.serialId !== '' && this.reviewId !== '') {
        this.$http.delete('/api/purchase/deletePurchaseById/' + this.serialId +'/' + this.reviewId, {}).then((req)=> {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              switch (this.type) {
                case 1 :
                  this.findAllPurchaseByEmployeeAndPage(); //进货单管理
                  break;
                case 2 :
                  this.$router.go(-1);//详情弃单
                  break;
                case 3 :
                  this.findPurchaseByEmployeeAndPage();//我的进货单
                  break;
                case 4 :
                  this.findPurchaseByPageToTable(); //进货单商品详情
                  break;
              }
            }else{
              this.$message.error(result.msg);
            }
          }
        },()=>{
          this.$message.error('连接服务器失败');
        })
      }
    }
  }
};


module.exports = purchaseModule;
