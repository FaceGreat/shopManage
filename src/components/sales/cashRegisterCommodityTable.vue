<template>
    <div class="cashRegisterCommodityTable">
      <el-table
      :data="tableData"
      style="width: 100%;">
        <el-table-column
          inline-template
          label="零售价"
          width="100">
          <span>{{ row.retailPrice | currency }}</span>
        </el-table-column>
        <el-table-column
          inline-template
          label="实售价"
          width="100">
          <span>{{ row.retailPrice * (row.discount || 1) | currency }}</span>
        </el-table-column>
        <el-table-column
          inline-template
          label="利润"
          width="100">
          <span>{{ row.retailPrice * (row.discount || 1) -  row.costPrice | currency }}</span>
        </el-table-column>
        <el-table-column
          label="库存数量"
          prop="factStoreNum"
          width="100">
        </el-table-column>
        <el-table-column
          prop="memberName"
          label="会员名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="billUserName"
          label="收银员">
        </el-table-column>
        <commodity-table-column></commodity-table-column>
      </el-table>
    </div>
</template>

<script>
  import commodityTableColumn from 'components/purchase/provideSelectDialog.vue'
	export default {
		name: 'cashRegisterCommodityTable',
    props : ['tableData'],
    data() {
			return{
      }
    },
    components : {
      commodityTableColumn
    }
	}
</script>

<style scoped>
  .cashRegisterCommodityTable{
    margin-bottom: 20px;
  }
</style>
