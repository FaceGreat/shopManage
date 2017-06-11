/**
 * Created by Administrator on 2017/5/31.
 */
/**
 * Created by Administrator on 2017/5/20.
 */
let deleteMixin = require('./deleteMixin');

let inventoryModule = {
  data() {
    return {
      inventoryId : '',
      reviewId : '',
      type : ''
    }
  },
  mixins: [deleteMixin],
  methods : {
    removeInventoryList() {
      this.inventoryId = this.inventoryId || arguments[0];
      this.type = arguments[1];
      this.reviewId = arguments[2];
      this.openMsgbox({
        title : '删除盘点单',
        message : '确定删除编号为【 '+ this.inventoryId +' 】的盘点单',
        callback : this.deleteInventoryList
      });
    },
    //确认删除
    deleteInventoryList() {
      if(this.inventoryId !== '' && this.reviewId !== '') {
        this.$http.delete('/api/inventory/deleteInventoryById/' + this.inventoryId +'/' + this.reviewId, {}).then((req)=> {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              switch (this.type) {
                case 1 :
                  this.findInventoryByPage(); //盘点单管理
                  break;
                case 2 :
                  this.$router.go(-1);//详情弃单
                  break;
                case 3 :
                  this.findInventoryByEmployeeAndPage();//我的盘点单
                  break;
                case 4 :
                  this.findAllInventoryCommodityByEmployeeAndPage(); //盘点单商品详情
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
    },
    //查询一张我的盘点单的详细信息
    findMyInventoryListDetails(row) {
      let params = {
        inventoryId : row.inventoryId,//入库清单号
        reviewId : row.reviewId,//入库审核号
        Status : row.Status,//入库审核状态
        system : true //是否为制单人， false表示为审核状态
      };
      this.$router.push({name : 'InventoryListMessage', params : {inventoryInfo : params} });
    }
  }
};

module.exports = inventoryModule;
