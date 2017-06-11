<template>
  <div>
    <v-bar-title vBarTitle="我的盘点单"></v-bar-title>
    <el-card>
      <common-find-form
      :findModel="findModel"></common-find-form>
      <el-table
        :data="tableData"
        fit
        style="width:100%;">
        <el-table-column
          prop="systemTime"
          label="盘点日期"
          :formatter="timeFormat"
          width="180">
        </el-table-column>
        <el-table-column
          inline-template
          label="操作"
          width="200"
          fixed="right">
          <div>
            <el-button type="info" size="small" @click="findMyInventoryListDetails(row)">操作</el-button>
            <el-button type="danger" size="small" @click="removeInventoryList(row.inventoryId, 3, row.reviewId)">删除单据</el-button>
          </div>
        </el-table-column>
        <inventory-list-info-table-column></inventory-list-info-table-column>
      </el-table>
      <common-pagination
        :pageModule="pageModule"></common-pagination>
    </el-card>
  </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import commonFindForm from 'components/common/commonFindForm'
  import inventoryListInfoTableColumn from 'components/inventory/inventoryListInfoTableColumn'
  import commonPagination from 'components/common/commonPagination'

  import dateMixin from 'mixin/dateMixin'
  import inventoryMixin from 'mixin/inventoryMixin'
  import commonFindMixin from 'mixin/commonFindMixin'
  import paginationMixin from 'mixin/paginationMixin'

  export default {
    name: '',
    mixins : [dateMixin, inventoryMixin, commonFindMixin, paginationMixin],
    data() {
      return  {
        tableData : [],
      }
    },
    created() {
      this.initCommonFind();
      this.initPageModule();
      this.updateCommonFind({
        message : '选择盘点时间段',
        callback : this.findInventoryByEmployeeAndPage
      });
      this.findInventoryByEmployeeAndPage();
      this.updatePageModule({
        callback : this.findInventoryByEmployeeAndPage
      });
    },
    methods : {
    	//获取指定页数的盘点单
      findInventoryByEmployeeAndPage() {
        let params = {
          'r.systemTime' : {
            startDate : this.formatsStartDate(this.findModel.startDate),
            endDate : this.formatsEndDate(this.findModel.endDate),
          },
          'r.Status' : this.findModel.status,
        };
        this.$http.get('/api/inventory/findInventoryByEmployeeAndPage', {
          params : {
            findModel : JSON.stringify(params),
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        }, {}).then((req) =>{
        	if(req.ok) {
        		let result = req.body.result;
        		if(result.code) {
              this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
        			this.$message.error(result.msg);
            }
          }
        }, ()=>{
        	this.$message.error('连接服务器失败');
        });
      },

    },
    components : {
      vBarTitle,inventoryListInfoTableColumn, commonFindForm,commonPagination
    }
  }
</script>

<style scoped>
</style>
