<template>
    <div class="Home">
      <v-header :userMessage="user"></v-header>
      <v-sidebar :userMessage="user"></v-sidebar>
      <div class="content">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
</template>

<script>
  import vHeader from 'components/common/header.vue'
  import vSidebar from 'components/common/sidebar.vue'
	export default {
		name: 'Home',
    data() {
      this.getLoginEdUser();
      return  {
        user : {}
      }
    },
    methods : {
      getLoginEdUser () {
        this.$http.get('/api/user/employee/loginUserMessage',{}).then((req) =>{
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.user = result.result;
            }else{
            	this.$message.error(result.msg);
              this.$router.replace({name : 'Login' });
            }
          }
        },()=> {
        	this.$message.error('连接服务器失败，请重新登录');
          this.$router.replace({name : 'Login' });
        });
      }
    },
    components : {
      vHeader,vSidebar
    }
	}
</script>
<style>
</style>
