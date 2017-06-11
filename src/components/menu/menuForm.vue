<template>
    <div class="menuForm">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 18px;">{{ menuFormType }}</span>
        </div>
        <el-form :model="menu"  label-width="100px" >
          <el-form-item label="菜单项名">
            <el-input type="text" require  placeholder="填写菜单项名" v-model="menu.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单等级">
            <el-input type="text" require  placeholder="填写菜单项名" v-model="menu.level" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="父菜单">
            <el-input type="text" require  placeholder="选择父菜单" v-model="menu.fatherMenu" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="菜单url地址">
            <el-input type="text" require  placeholder="示例：/home" v-model="menu.url"></el-input>
          </el-form-item>
          <el-form-item label="菜单icon图标">
            <el-input type="text" require  placeholder="示例：fa-xxxx" v-model="menu.icon"></el-input>
          </el-form-item>
          <el-button type="primary" class="menu-form-btn" @click="addMenu" v-show="btnShow">添加</el-button>
          <el-button type="warning" class="menu-form-btn" @click="updateMenu" v-show="!btnShow">修改</el-button>
        </el-form>
      </el-card>

    </div>
</template>

<script>
  import bus from 'components/common/js/bus.js'
	export default {
    data() {
    	let menu = this.initMenu(true, '添加新菜单项');
    	return {
        menu : menu,
        btnShow : true,
        menuFormType : '添加新菜单项'
      }
    },
    components : {
    },
    created() {
    	//菜单节点详细信息
      bus.$on('tree-details', (menu, parentName) => {
      	//深度拷贝一个对象，切断v-model带来的双向数据绑定
      	this.menu = Object.assign({}, menu);
      	this.menu.fatherMenu = parentName;
      	this.btnShow = false;
      	this.menuFormType = '菜单详情  /  修改菜单'
      });
      //添加子菜单
      bus.$on('add-child', (arg) => {
      	//重新初始化表单
        this.menu = this.initMenu('添加子菜单项');
        //设置信息
        this.menu.fatherMenu = arg.name;
        this.menu.level = parseInt(arg.level) + 1;
        this.menu.fatherMenuId = arg.menuId;
      });
      //更新菜单树
      bus.$on('update-TreeMenu', ()=> {
      	this.updateView();
      })
    },
    methods : {
    	//初始化模型对象
    	initMenu(status,msg) {
        this.btnShow = status;
        this.menuFormType = msg;
    		return {
          name : '',
          level : '1',
          fatherMenu : '',
          url : '',
          icon : '',
          fatherMenuId : null
        }
      },
    	//添加菜单
    	addMenu() {
    		this.$http.post('/api/menu/addMenu', this.menu,{}).then((req) => {
          if(req.ok){
          	//添加成功
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              this.updateView();
            }else{
              this.$message.error(result.msg);
            }
          }else{
            this.$message.error('连接服务器失败');
          }
        })
      },
      //更新菜单项信息
      updateMenu() {
        this.$http.put('/api/menu/updateMenu',this.menu,{}).then((req)=> {
        	if(req.ok) {
        		let result = req.body.result;
        		if(result.code) {
        			this.$message.success(result.msg);
              this.updateView();
            }else{
        			this.$message.error(result.msg);
            }
          }else{
            this.$message.error('连接服务器失败');
          }
        })
      },
      //更新树展示层
      updateView () {
        //更新菜单树
        this.$emit('updateTreeMenu');
        //清空表单数据
        this.menu = this.initMenu(true, '添加新菜单项');
      }
    }
	}
</script>

<style scoped>
  .menu-btn{
    margin-bottom: 10px;
  }
  .menu-form-btn{
    float: right;
    margin-bottom: 24px;
    width:100%;
  }
</style>
