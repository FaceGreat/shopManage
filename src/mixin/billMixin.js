/**
 * Created by Administrator on 2017/5/20.
 */

let billModule = {
  methods : {
    //删除单个收据单
    deleteSingleCash(billId) {
      this.billId = billId;
      this.openMsgbox({
        title : '删除收银单据',
        message : '确定删除单号为【 ' + billId + ' 】单据',
        callback : this.removeSingleBill
      });
    },
    //确认删除指定收银单据
    removeSingleBill() {
      this.$http.delete('/api/bill/deleteBillByBillId/' + this.billId, {}).then((req) => {
        if(req.ok) {
          let result = req.body.result;
          if(result.code) {
            this.$message.success(result.msg);
            this.$emit('update-cash-table');
          }else{
            this.$message.error(result.msg);
          }
        }
      },()=>{
        this.$message.error('连接服务器失败');
      });
    },
    //查看指定收银单
    findBillMessage(row) {
      //console.log(row);
      let param = {
        member : {
          memberId : row.memberId,
          name : row.name,
          discount : row.discountValue,
          cashierName : row.billUserName
        },
        billInfoId  : row.billId,
        billUserName : row.billUserName
      };
      this.$router.push({ name : 'cashRegisterMessage', params : {billInfo : param} });
    }
  }
};

module.exports = billModule;
