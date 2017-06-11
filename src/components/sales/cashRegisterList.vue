<template>
  <div>
    <v-bar-title vBarTitle="销售清单信息"></v-bar-title>
    <el-card>
      <common-find-form
        :findModel="findModel"></common-find-form>
      <div class="model">
        <commodity-select labelText="选择商品类别" :selectModel="findModel.categoryId" @on-result-change="onResultChange"></commodity-select>
        <cash-register-commodity-table
        :tableData="tableData">
        </cash-register-commodity-table>
        <common-pagination
        :pageModule="pageModule"></common-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import commonFindForm from 'components/common/commonFindForm'
  import commonPagination from 'components/common/commonPagination'

  import commoditySelect from 'components/commodity/categorySelect'
  import cashRegisterCommodityTable from 'components/sales/cashRegisterCommodityTable'

  import commonFindMixin from 'mixin/commonFindMixin'
  import paginationMixin from 'mixin/paginationMixin'
  export default {
    name: '',
    mixins:[commonFindMixin, paginationMixin],
    data() {
      return {
        tableData : [],
      }
    },
    created() {
      this.initCommonFind();
      this.initPageModule();
      this.updateCommonFind({
        message : '选择收银时间段',
        callback : this.findAllCommodityByEmployeeAndPage,
      });
      this.findModel.categoryId='';
      this.findAllCommodityByEmployeeAndPage();
      this.updatePageModule({
        callback : this.findAllCommodityByEmployeeAndPage
      });
    },
    methods : {
      //下拉值改变时改变表格内容
      onResultChange(val) {
        this.findModel.categoryId = val === '' ? '' : val;
        this.findAllCommodityByEmployeeAndPage();
      },
      //获取指定员工的收银单明细信息
      findAllCommodityByEmployeeAndPage() {
      	let params = {
          'bl.billTime' : {
            startDate : this.formatsStartDate(this.findModel.startDate),
            endDate : this.formatsEndDate(this.findModel.endDate),
          },
          categoryId : this.findModel.categoryId
        };
        this.$http.get('/api/bill/findAllCommodityByEmployeeAndPage', {
        	params : {
            findModel : JSON.stringify(params),
            pageModel : JSON.stringify({
            	page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        }, {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
          		this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
          		this.$message.error(result.msg);
            }
          }
        },()=> {
        	this.$message.error('连接服务器失败');
        });
      }
    },
    components : {
      vBarTitle, commonFindForm, commonPagination,  commoditySelect, cashRegisterCommodityTable
    },
  }
</script>

<style scoped>
  .model{
    border: 1px solid #d1d1d1;
    padding: 20px 30px 0 10px;
    margin-bottom: 20px;
  }
</style>
