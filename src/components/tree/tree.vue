<template>
  <div>
    <el-tree
      :data="treeMenu"
      :props="defaultProps"
      ref="tree"
      highlight-current
      accordion
      :render-content="renderContent">
    </el-tree>
  </div>
</template>

<script>
  import bus from 'components/common/js/bus.js';
  import  { MessageBox } from 'element-ui';
  export default {
    props : ['treeMenu'],
		data() {
			return  {
        defaultProps: {
          children: 'children',
          label: 'name'

        }
      }
    },
    components : {

    },
    methods : {
      renderContent(createElement, { node }) {
        const self = this;
        return createElement('span',[
            createElement('span', node.label),
            createElement('span', {attrs:{
              style:"float: right; margin-right: 20px;"
            }},[
              createElement('el-button',{attrs:{
                size:"small",
                type:"success",
                style:"width:80px;"
              },on:{
                click:function() {
                  bus.$emit('tree-details', node.data, node.parent.data.name)
                }
              }},"详情"),
              createElement('el-button',{attrs:{
                size:"small",
                style:"width:80px;"
              },on:{
                click:function() {
                	  bus.$emit('add-child', node.data);
                }
              }},"添加子菜单"),
              createElement('el-button',{attrs:{
                size:"small",
                type:"danger",
                style:"width:80px;"
              },on:{
                click:function() {
                  self.$msgbox({
                    title: '删除菜单项',
                    message: '确定删除【 ' + node.data.name + ' 】菜单项',
                    showCancelButton: true,
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    confirmButtonClass :'el-button--danger',
                    beforeClose: (action, instance, done) => {
                      if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '正在删除...';
                        self.$http.delete('/api/menu/deleteMenu/' + node.data.menuId ).then((req) => {
                          if(req.ok){
                            let result = req.body.result;
                            if(result.code) {
                              self.$message.success(result.msg);
                            }else{
                              self.$message.error(result.msg);
                            }
                          }else{
                            self.$message.error('连接服务器失败');
                          }
                          done();
                          instance.confirmButtonLoading = false;
                          //更新菜单树
                          bus.$emit('update-TreeMenu');
                        })
                      } else {
                        done();
                      }
                    }
                  });
                }
              }},"删除菜单项")
            ])
          ])
      }
    }
	}
</script>

<style scoped>
</style>
