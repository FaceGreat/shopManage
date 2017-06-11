<template>
    <div class="menuManage">
      <v-bar-title vBarTitle="菜单管理"></v-bar-title>
      <el-row>
        <el-col :span="15" class="menu-tree" id="menuTree">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 18px;">菜单管理</span>
            </div>
            <v-tree :treeMenu="menu"></v-tree>
          </el-card>
        </el-col>
        <el-col :span="8" class="menu-form">
          <v-menu-form @updateTreeMenu="findAllMenu"></v-menu-form>

        </el-col>
      </el-row>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle.vue'
  import vTree from  'components/tree/tree.vue'
  import vMenuForm from 'components/menu/menuForm.vue'
	export default {
		name: 'menuManage',
    data() {
			this.findAllMenu();
			return  {
          menu : [],
      }
    },
    components : {
      vBarTitle, vTree, vMenuForm
    },
    methods: {
      //获取所有指定权限菜单
      findAllMenu () {
      	this.$http.get('/api/menu/findAllMenu').then((req) => {
          let data = req.body.result;
          if(req.ok) {
          	if(data.code){
          	  this.menu = data.result;
            }else{
              this.$message.error(result.msg);
            }
          }else{
            this.$message.error('无法连接到服务器');
          }
        });
      }
    }
	}
</script>

<style scoped>
  .menu-tree{
    margin-right: 24px;
  }



</style>
