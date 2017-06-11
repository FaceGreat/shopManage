<template>
    <div class="tableColumn">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="inventoryId"
      label="盘点单号"
        width="110">
      </el-table-column>
      <el-table-column
        inline-template
        label="合计金额"
        width="110">
        <span>{{ row.totalMoney | currency }}</span>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="140">
      </el-table-column>
      <el-table-column
        prop="reviewPersonName"
        label="审核人"
        width="110">
      </el-table-column>
      <el-table-column
        prop="reviewTime"
        label="审核时间"
        width="180"
        :formatter="timeFormat">
      </el-table-column>
      <el-table-column
        prop="Status"
        label="审核状态"
        :formatter="statusFormat"
        width="140">
      </el-table-column>
    </div>
</template>

<script>

  import dateMixin from 'mixin/dateMixin'
	export default {
		name: 'tableColumn',
    mixins : [dateMixin],
    data() {
			return{}
    },
    methods : {
			//表格状态格式化
      statusFormat(row, column) {
      	return row[column.property] === 1 ? '未审核' : '已审核';
      }
    }
	}
</script>

<style scoped>
</style>
