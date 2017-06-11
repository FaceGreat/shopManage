<template>
    <div class="notOwnedMenu">
      <h4 class="content-title">未分配权限菜单</h4>
      <p class="content-hr"></p>
      <el-button type="success" style="float: right;margin-top: -34px;" :disabled="disableBtn" @click="addPermission">添加选中权限</el-button>
      <not-owned-menu-tree :tableData ="tableData" :checkedTreeData="checkedTreeData"></not-owned-menu-tree>
    </div>
</template>

<script>
  import notOwnedMenuTree from 'components/menu/menuTree.vue'
  import bus from 'components/common/js/bus.js'
	export default {
		name: 'notOwnedMenu',
    data () {
			return{
        disableBtn : true,
        roleId : 0,
        tableData : [],
        checkedTreeData : []
      }
    },
    created() {
      bus.$on('updateRoleIdByNot', (rId) => {
      	this.roleId = rId;
        this.disableBtn =  rId === ''?  true : false;
        if(this.roleId !== '') {
          this.getNotOwnByRole();
        }else{
        	this.tableData =[];
        }
      });
    },
    methods: {
			//获取指定角色未绑定菜单
      getNotOwnByRole() {
        this.$http.get('/api/menu/getNotOwnByRole', {params : {roleId :　this.roleId}}).then((req) => {
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
      addPermission() {
      	this.$http.post('/api/menu/saveEmployeePermission', {roleId :this.roleId, menus : this.checkedTreeData},{}).then((req) => {
      		if(req.ok) {
      			let result = req.body.result;
      			if(result.code) {
      				this.$message.success(result.msg);
      				this.getNotOwnByRole();
      				//更新已经授权的树展现层
              bus.$emit('updateAlreadyByNot');
            }else{
      				this.$message.error(result.msg);
            }
          }
        },()=>{
      		this.$message.error('连接服务器失败');
        })
      }
    },
    components : {
      notOwnedMenuTree
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
