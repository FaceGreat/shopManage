<template>
  <el-dialog
    v-model="visible.state"
    :before-close="handleClose"
    :close-on-click-modal="false">
    <span slot="title" class="el-dialog__title">{{ visible.title  }}</span>
    <component  :is="currentView" :visible="visible"></component>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible.state = false">取 消</el-button>
      <el-button type="primary" @click="visible.callback">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import * as module from 'components/childComponents/child'

  import commonMixin from 'mixin/commonMixin'

  export default {
    name: '',
    mixins : [commonMixin],
    props : ['visible'],
    data(){
      return {
        currentView :'',
      }
    },
    watch: {
      visible(val) {
      	this.currentView = module[val.name];
      }
    },
    methods : {
      handleClose(done) {
      	done();
      }
    },
    components : {
      module
    }
  }
</script>

<style scoped>
</style>
