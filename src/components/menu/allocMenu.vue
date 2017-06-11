<template>
    <div class="allocMenu">
      <v-bar-title vBarTitle="部门权限菜单分配"></v-bar-title>
      <el-card>
        <section-select :selectModel="roleId" @on-result-change="onResultChange" style="margin-left: 26px;"></section-select>
        <el-row>
          <el-col :span="11" class="menu-box">
            <not-owned-menu ></not-owned-menu>
          </el-col>
          <el-col :span="11" class="menu-box">
            <already-owned-menu></already-owned-menu>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle.vue'
  import sectionSelect from 'components/user/employee/sectionSelect.vue'
  import alreadyOwnedMenu from 'components/menu/alreadyOwnedMenu.vue'
  import notOwnedMenu from 'components/menu/notOwnedMenu.vue'
  import bus from 'components/common/js/bus.js'
	export default {
		name: 'allocMenu',
    data() {
			return {
        roleId : '',
      }
    },
    created(){
      bus.$on('updateAlreadyByNot', () => {
        bus.$emit('updateRoleIdByAlready', this.roleId);
      });
      bus.$on('updateNotByAlready', () => {
        bus.$emit('updateRoleIdByNot', this.roleId);
      });
    },
    methods　: {
      onResultChange(val) {
      	this.roleId = val;
        bus.$emit('updateRoleIdByNot', this.roleId);
        bus.$emit('updateRoleIdByAlready', this.roleId);
      },
      methods : {
      	//获取指定角色未选中
      }
    },
    components : {
      vBarTitle, sectionSelect, alreadyOwnedMenu, notOwnedMenu
    }
	}
</script>

<style scoped>
  .menu-box{
    margin-top: 10px;
    padding: 10px;
    margin-left: 26px;
    border: 1px solid #99a9bf;
  }
</style>
