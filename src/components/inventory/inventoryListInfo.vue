<template>
  <div>
    <v-bar-title vBarTitle="盘点单明细"></v-bar-title>
    <el-card>
      <common-find-form
        :findModel="findModel"></common-find-form>
      <el-table
      :data="tableData"
      style="width: 100%;">
        <el-table-column
          inline-template
          label="单价"
          width="100">
          <span>{{ row.retailPrice | currency }}</span>
        </el-table-column>
        <el-table-column
          prop="storeNum"
          label="库存数量"
          width="110">
        </el-table-column>
        <el-table-column
          prop="inventoryNum"
          label="实盘数量"
          width="110">
        </el-table-column>
        <el-table-column
          inline-template
          label="盈亏数量"
          width="110">
          <span>{{ row.inventoryNum - row.storeNum }}</span>
        </el-table-column>
        <el-table-column
          inline-template
          label="盈亏金额"
          width="110">
          <span>{{ (row.inventoryNum - row.storeNum ) * row.costPrice | currency }}</span>
        </el-table-column>
        <el-table-column
          label="盘点单号"
          prop="inventoryId"
          width="110">
        </el-table-column>
        <el-table-column
          label="盘点人"
          prop="systemName"
          width="100">
        </el-table-column>
        <el-table-column
          label="盘点日期"
          prop="systemTime"
          width="180"
          :formatter="timeFormat">
        </el-table-column>
        <el-table-column
          inline-template
          label="操作"
          width="80"
          fixed="right">
          <div>
            <el-button type="info" size="small" @click="findMyInventoryListDetails(row)">操作</el-button>
            <!--<el-button type="danger" size="small" @click="removeInventoryList(row.inventoryId, 4, row.reviewId)">删除单据</el-button>-->
          </div>
        </el-table-column>
        <commodity-table-column></commodity-table-column>
      </el-table>
      <common-pagination
        :pageModule="pageModule"></common-pagination>
    </el-card>
  </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import commonFindForm from 'components/common/commonFindForm'
  import commodityTableColumn from 'components/purchase/provideSelectDialog'
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
        tableData : []
      }
    },
    created() {
      this.initCommonFind();
      this.initPageModule();
      this.updateCommonFind({
        message : '选择盘点时间段',
        callback : this.findAllInventoryCommodityByEmployeeAndPage
      });
      this.findAllInventoryCommodityByEmployeeAndPage();
      this.updatePageModule({
        callback : this.findAllInventoryCommodityByEmployeeAndPage
      });
    },
    methods: {
    	//获取指定页数的商品清单
      findAllInventoryCommodityByEmployeeAndPage() {
        let params = {
          'r.systemTime' : {
            startDate : this.formatsStartDate(this.findModel.startDate),
            endDate : this.formatsEndDate(this.findModel.endDate),
          },
          'r.Status' : this.findModel.status,
        };
      	this.$http.get('/api/inventory/findAllInventoryCommodityByEmployeeAndPage', {
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
        }, () => {
      		this.$message.error('连接服务器失败');
        });
      }
    },
    components : {
      vBarTitle, commonFindForm, commodityTableColumn, commonPagination
    }
  }
</script>

<style scoped>
</style>
