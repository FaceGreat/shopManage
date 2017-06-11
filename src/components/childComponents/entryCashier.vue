<template>
    <div class="entryCashier">
      <el-input v-model="visible.props.cashierId" placeholder="输入收银员的员工号" autofocus></el-input>
    </div>
</template>

<script>
	export default {
		//录入销售员
		name: 'entryCashier',
    props : ['visible'],
    data() {
			return {
      }
    },
    methods: {

    }
	}
</script>

<style scoped>
</style>
