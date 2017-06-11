<template>
    <div class="sidebar">
      <el-menu  :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark"  unique-opened router >
        <div :key="item.menuId" v-for="item in menuBar">
          <single-menu-bar :menuItem="item" v-if="item.children.length === 0"></single-menu-bar>
          <multiple-menu-bar :menuItem="item" v-else></multiple-menu-bar>
        </div>
        <footer>
          <span class="currentTime">{{ currentTime }}</span>
        </footer>

      </el-menu>

    </div>
</template>

<script>
  import singleMenuBar from 'components/menu/singleMenuBer';
  import multipleMenuBar from 'components/menu/multipleMenuBar'

  import dateMixin from  'mixin/dateMixin'
	export default {
		name: 'sidebar',
    props : ['userMessage'],
    mixins: [dateMixin],
    data() {
      //this.findAllMenu();
			return {
				menuBar : [],
        currentTime : ''
      }
    },
    created() {
      this.getMenuByUserByRoleId();
      this.timing();
      //定时器，更新时间
      setInterval(this.timing,1000);
    },
    computed : {
      onRoutes() {
      	return this.$route.path.replace('/','');
      }
    },
    components : {
      singleMenuBar, multipleMenuBar
    },
    methods : {
      timing() {
        this.currentTime = this.timeFormatByDate(new Date());
      },
			getMenuByUserByRoleId () {
				setTimeout(() =>{
          this.$http.get('/api/menu/getAlreadyOwnByRole',{params : {roleId : this.userMessage.roleId}}).then((req) => {
            if(req.ok){
              const result = req.body.result;
              if(result.code) {
                this.menuBar = result.result;
              }else{
                this.$message.error(result.msg);
              }
            }else{
              this.$message.error('连接服务器失败');
            }
          });
        },300);
      }
      /*findAllMenu () {
        this.$http.get('/api/menu/getAllMenuByBar').then((req) => {
          let data = req.body.result;
          if(req.ok) {
            if(data.code){
              this.menuBar = data.result;
            }else{
              this.$message.error(result.msg);
            }
          }else{
            this.$message.error('无法连接到服务器');
          }
        });
      }*/
    }
	}
</script>

<style scoped>
  .sidebar{
    display: block;
    position: absolute;
    width: 200px;
    left: 0;
    top: 66px;
    bottom:0;
    background: #324157;
  }
  .sidebar > ul {
    height:100%;
  }
  .material-icons {font-size:12px;}
  footer{
    position:absolute;
    bottom:12px;
    width:100%;
    height:16px;
    text-align: center;
    color: #99a9bf;
  }
</style>
