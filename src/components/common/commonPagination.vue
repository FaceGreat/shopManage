<template>
  <div class="pagination">
    <el-pagination
      layout="prev, pager, next"
      :total="pageModule.total"
      :current-page="pageModule.currentPage"
      :page-size="pageModule.page"
      @current-change="pageModule.currentPageCallback">
    </el-pagination>
  </div>
</template>

<script>
	export default {
		name: '',
    props: ['pageModule'],
	}
</script>

<style scoped>
  .pagination{
    text-align: center;
    margin: 10px 0;
  }
</style>
