<template>
    <div class="purchaseListInfoTable">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="systemName"
          label="制单人">
        </el-table-column>
        <el-table-column
          prop="systemTime"
          label="制单时间"
          :formatter="dataFormatter"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          inline-template
          label="操作"
         width="170">
          <div>
            <el-button type="info" size="small" @click="operating(row)">操作</el-button>
            <el-button type="danger" size="small" @click="removePurchaseList(row.serialId, 4, row.reviewId)">删除单据</el-button>
          </div>
        </el-table-column>
        <purchase-list-info-table-column></purchase-list-info-table-column>
      </el-table>
    </div>
</template>

<script>
  import purchaseListInfoTableColumn from  'components/purchase/purchaseListInfoTableColumn'
  import purchaseMixin from 'mixin/purchaseMixin'

  import bus from 'components/common/js/bus'
	export default {
		name: 'purchaseListInfoTable',
    mixins : [purchaseMixin],
    props : ['tableData'],
    data () {
			return {

      }
    },
    created(){

    },
    components  :{
      purchaseListInfoTableColumn
    },
    methods : {

      operating (row) {
        let params = {
          serialId : row.serialId,//入库清单号
          reviewId : row.reviewId,//入库审核号
          Status : row.Status,//入库审核状态
          system : false //是否为制单人， false表示为审核状态
        };
        this.$router.push({name : 'reviewPurchaseList', params : {purchaseInfo : params} });
      },
      findPurchaseByPageToTable() {
      	bus.$emit('findPurchaseByPageToTable');
      },
      dataFormatter(row, column) {
        if(!row[column.property]) {
          return '';
        }
        return new Date(row[column.property]).toLocaleDateString();
      },
    }
	}
</script>

<style scoped>
</style>
