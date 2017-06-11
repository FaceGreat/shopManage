<template>
  <el-dialog v-model="visible.state">
    <span slot="title" class="el-dialog__title"></span>
    <component  :is="currentView" :visible="visible"></component>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible.state = false">取 消</el-button>
      <el-button type="primary" @click="visible.callback">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import * as module from 'components/test/child'
	export default {
		name: '',
    props : ['visible'],
    data(){
			return {
				currentView : module.testHome
      }
    },
    components : {
      module
    }
	}
</script>

<style scoped>
</style>
