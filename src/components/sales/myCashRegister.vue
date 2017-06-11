<template>
  <div>
    <v-bar-title vBarTitle="我的销售信息"></v-bar-title>
    <el-card>
      <common-find-form
        :findModel="findModel"></common-find-form>
      <cash-register-table
        :tableData="tableData"
        @update-cash-table="findBillByEmployeeAndPage"></cash-register-table>
      <common-pagination
        :pageModule="pageModule"></common-pagination>
    </el-card>
  </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import commonFindForm from 'components/common/commonFindForm'
  import cashRegisterTable from  'components/sales/cashRegisterTable'
  import commonPagination from 'components/common/commonPagination'

  import commonFindMixin from 'mixin/commonFindMixin'
  import paginationMixin from 'mixin/paginationMixin'
  export default {
    name: '',
    mixins: [commonFindMixin, paginationMixin],
    data() {
      return {
        tableData : []
      }
    },
    created() {
      this.initCommonFind();
      this.initPageModule();
      this.updateCommonFind({
        message : '选择收银时间段',
        callback : this.findBillByEmployeeAndPage
      });
      this.findBillByEmployeeAndPage();
      this.updatePageModule({
        callback : this.findBillByEmployeeAndPage
      });
    },
    methods : {
      findBillByEmployeeAndPage() {
        let params = {
          'bl.billTime' : {
            startDate : this.formatsStartDate(this.findModel.startDate),
            endDate : this.formatsEndDate(this.findModel.endDate),
          },
          categoryId : this.findModel.categoryId
        };
        this.$http.get('/api/bill/findBillByEmployeeAndPage', {
          params : {
            findModel : JSON.stringify(params),
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        },{}).then((req) => {
          if(req.ok){
            let result = req.body.result;
            if(result.code) {
              this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
              this.$message.error(result.msg);
            }
          }
        },() => {
          this.$message.error('连接服务器失败');
        });
      },
    },
    components : {
      vBarTitle, commonFindForm, cashRegisterTable, commonPagination
    },
  }
</script>

<style scoped>
</style>
