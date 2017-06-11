<template>
    <div>
      <el-table-column
        prop="serialId"
        label="入库单号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="serialDate"
        label="入库时间"
        :formatter="dataFormatter"
        width="120">
      </el-table-column>
      <el-table-column
        inline-template
        label="合计金额"
      width="110">
        <span>{{ row.totalMoney | currency}}</span>
      </el-table-column>
      <el-table-column
        prop="serialDesc"
        label="备注"
        width="120">
      </el-table-column>
      <el-table-column
        prop="reviewPersonName"
        label="审核人">
      </el-table-column>
      <el-table-column
        prop="reviewTime"
        label="审核时间"
        :formatter="dataFormatter"
        width="100">
      </el-table-column>
      <el-table-column
        prop="Status"
        label="审核状态"
        :formatter="StatusFormatter"
        width="100">
      </el-table-column>
    </div>
</template>

<script>
	export default {
		name: '',
    methods : {
      dataFormatter(row, column) {
      	if(!row[column.property]) {
      		return '';
        }
        return new Date(row[column.property]).toLocaleDateString();
      },
      StatusFormatter(row, column) {
        return row[column.property] === 1 ? '未审核' : '已审核';
      }
    }
	}
</script>

<style scoped>
</style>
