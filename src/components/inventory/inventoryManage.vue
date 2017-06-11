<template>
  <div>
    <v-bar-title vBarTitle="盘点单管理"></v-bar-title>
    <el-card>
      <common-find-form
        :findModel="findModel"></common-find-form>
      <el-table
      :data="tableData"
      style="width:100%;">
        <el-table-column
          prop="systemName"
          label="盘点人"
          width="100">
        </el-table-column>
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
            <el-button type="info" size="small" @click="findInventoryListDetails(row)">操作</el-button>
            <el-button type="danger" size="small" @click="removeInventoryList(row.inventoryId, 1, row.reviewId)">删除单据</el-button>
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
    mixins: [dateMixin, inventoryMixin, commonFindMixin, paginationMixin],
    data() {
      return  {
        tableData : [],
      }
    },
    created() {
      this.initPageModule();
    	this.initCommonFind();
    	this.updateCommonFind({
        message : '选择盘点时间段',
        callback : this.findInventoryByPage
      });
      this.findInventoryByPage();
      this.updatePageModule({
        callback : this.findInventoryByPage
      });
    },
    methods: {
    	//获取指定页数的所有盘点单
      findInventoryByPage() {
        let params = {
          'r.systemTime' : {
            startDate : this.formatsStartDate(this.findModel.startDate),
            endDate : this.formatsEndDate(this.findModel.endDate),
          },
          'r.Status' : this.findModel.status,
        };
      	this.$http.get('/api/inventory/findInventoryByPage', {
          params : {
            findModel : JSON.stringify(params),
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        },{}).then((req) => {
      		if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
              this.$message.error(result.msg);
            }
          }
        },()=>{
      		this.$message.error('连接服务器失败');
        });
      },
      //查询一张盘点单的详细信息
      findInventoryListDetails(row) {
        let params = {
          inventoryId : row.inventoryId,//入库清单号
          reviewId : row.reviewId,//入库审核号
          Status : row.Status,//入库审核状态
          system : false //是否为制单人， false表示为审核状态
        };
        this.$router.push({name : 'InventoryListMessage', params : {inventoryInfo : params} });
      }
    },
    components : {
      vBarTitle,commonFindForm,inventoryListInfoTableColumn, commonPagination
    }
  }
</script>

<style scoped>
</style>
