<template>
    <div class="memberTableColumn">
      <el-table-column
        type="index"
        fixed
        lable="编号">
      </el-table-column>
      <el-table-column
        prop="memberId"
        label="卡号"
        fixed
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        fixed
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="memberPhone"
        label="联系电话"
        width="126">
      </el-table-column>
      <el-table-column
        prop="discount"
        label="当前折扣"
        width="120">
      </el-table-column>
      <el-table-column
        prop="discountName"
        label="会员类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="consumeTimes"
        label="累计消费次数"
        width="150">
      </el-table-column>
      <el-table-column
        prop="consumeCost"
        label="累计消费金额"
        width="150">
      </el-table-column>
    </div>
</template>

<script>
	export default {
		name: 'memberTableColumn'
	}
</script>

<style scoped>
</style>
