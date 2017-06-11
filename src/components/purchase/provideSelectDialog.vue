<template>
    <div>
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        prop="commodityId"
        label="编号"
        width="110">
      </el-table-column>
      <el-table-column
        prop="barcode"
        label="条码"
        width="136">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="format"
        label="规格"
        width="94">
      </el-table-column>
      <el-table-column
        prop="unitName"
        label="单位">
      </el-table-column>
    </div>
</template>

<script>
	export default {
		name: '',
    props : ['material'],
    data() {
			return {
      }
    },
    methods : {

    }
	}
</script>

<style scoped>
</style>
