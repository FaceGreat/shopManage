<template>
    <div class="AlreadyOwnedMenu">
      <h4 class="content-title">拥有权限菜单</h4>
      <p class="content-hr"></p>
      <el-button type="warning" style="float:left;margin-top: -34px;"  :disabled="disableBtn" @click="removePermission">移除选中权限</el-button>
      <already-owned-menu-tree :tableData ="tableData" :checkedTreeData="disCheckedTreeData"></already-owned-menu-tree>
    </div>
</template>

<script>
  import alreadyOwnedMenuTree from 'components/menu/menuTree.vue'
  import bus from 'components/common/js/bus.js'
	export default {
		name: 'AlreadyOwnedMenu',
    data () {
      return{
        disableBtn : true,
        roleId : 0,
        tableData : [],
        disCheckedTreeData : []
      }
    },
    created() {
      bus.$on('updateRoleIdByAlready', (rId) => {
        this.roleId = rId;
        this.disableBtn =  rId === ''?  true : false;
        if(this.roleId !== '') {
          this.getAlreadyOwnByRole();
        }else{
          this.tableData =[];
        }
      });
    },
    methods: {
      //获取指定角色未绑定菜单
      getAlreadyOwnByRole() {
        this.$http.get('/api/menu/getAlreadyOwnByRole', {params : {roleId :　this.roleId}}).then((req) => {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.tableData = result.result;
              if(result.result.length === 0) {
              	this.disableBtn = true;
              }
            }else{
              this.$message.error(result.msg);
            }
          }
        },() => {
          this.$message.error('连接服务器失败');
        });
      },
      removePermission() {
        this.$http.delete('/api/menu/deleteEmployeePermission', {params : {roleId :this.roleId, menus : this.disCheckedTreeData}}, {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
          		this.$message.success(result.msg);
          		this.getAlreadyOwnByRole();
              bus.$emit('updateNotByAlready');
            }else{
          		this.$message.error(result.msg);
            }
          }
        },() => {
        	this.$message.error('连接服务器失败');
        });
      }
    },
    components : {
      alreadyOwnedMenuTree
    }
	}
</script>

<style scoped>
  .content-title{
    text-align: center;
    margin: 12px 0;
  }
  .content-hr{
    display: block;
    margin: 0 auto;
    border-bottom: solid rgba(0, 13, 242, 0.49) 5px;
    width : 160px;
  }
</style>
