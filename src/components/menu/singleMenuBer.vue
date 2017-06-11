<template>
    <el-menu-item :index="menuItem.url">
      <span class="sb-icon"><i :class="menuItem.icon"></i></span>
      <span class="sb-cn">&nbsp;{{ menuItem.name }}</span>
    </el-menu-item>
</template>

<script>
	export default {
		props : [ 'menuItem']
	}
</script>

<style scoped>
</style>
