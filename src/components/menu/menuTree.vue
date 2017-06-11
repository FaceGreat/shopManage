<template>
      <el-tree
        :data="tableData"
        :props="defaultProps"
        ref="tree"
        check-strictly
        default-expand-all
        show-checkbox
        class="menu-tree"
        @check-change="handleCheckChange">
      </el-tree>
</template>

<script>
	export default {
		props: ['tableData', 'checkedTreeData'],
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        //checkedTreeData : [],
      };
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        //console.log(data, checked, indeterminate);
        if(checked) {
        	this.checkedTreeData.push({
            menuId : data.menuId,
            role_menu_id : data.rmi
          });
        }else{
          let index = this.checkedTreeData.findIndex((n) => n === data.menuId);
          this.checkedTreeData.splice(index, 1);
        }
      },
      handleNodeClick(data) {
        console.log(data);
      }
    }
	}
</script>

<style scoped>
  .menu-tree{
    margin-top: 20px;
  }
</style>
