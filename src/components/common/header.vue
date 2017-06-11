<template>
    <div class="header">
      <!-- logo -->
      <el-row :gutter="10">
        <el-col :xs="12" :sm="12" :md="4">
          <div class="logo">
            <span class="logo_prefix">百加</span><span class="logo_suffix">供销管理系统</span>
          </div>
        </el-col>
        <el-col :xs="14" :sm="14" :md="6" style="float: right;">
          <el-col :xs="24" :sm="24" :md="8">
            <h5 style="color: white;width: 200px;">用户：{{ userMessage.name }}，欢迎使用</h5>
          </el-col>
          <div class="user-header">
            <el-dropdown trigger="click" menu-align="start">
              <img src="../../assets/defaultUserImg.png" width="50px" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >
                  <div class="setting-div">
                    <span class="setting-icon"><i class="fa fa-user-circle fa-2x"></i></span>
                    <span class="setting-string">  &nbsp;个人信息&nbsp;&nbsp;</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <div class="setting-div">
                    <span class="setting-icon"><i class="fa fa-wrench fa-2x"></i></span>
                    <span class="setting-string">  &nbsp;修改密码</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided >
                  <div class="setting-div" @click="logout">
                    <span class="setting-icon"><i class="fa fa-unlink fa-2x"></i></span>
                    <span class="setting-string" >  &nbsp;退出系统</span>
                  </div>
                </el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </div>
</template>
<script>
  export default {
    name: 'header',
    props: ['userMessage'],
    data() {
      return {
      }
    },
    methods : {
      logout() {
        const self = this;
        this.$msgbox({
          title: '退出系统',
          message: '确定退出系统？',
          showCancelButton: true,
          confirmButtonText: '退出',
          cancelButtonText: '取消',
          confirmButtonClass :'el-button--info',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在退出...';
              self.$http.get('/api/user//employee/logout', {}).then((req) => {
                if(req.ok){
                  let result = req.body.result;
                  if(result.code) {
                    self.$message.success(result.msg);
                    self.$router.push({name : 'Login' });
                  }else{
                    self.$message.error(result.msg);
                  }
                }else{
                  self.$message.error('连接服务器失败');
                }
                done();
                instance.confirmButtonLoading = false;
              })
            } else {
              instance.confirmButtonLoading = false;
              done();
            }
          }
        });
      }
    }
  }
</script>
<style scoped>
  .header {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    height:66px;

    font-size: 16px;
    line-height: 66px;
    background-color:#324157;
    box-shadow:2px 0 3px rgba(0,0,0,.5);
    z-index:1000;
    padding:0 32px 0 40px;
    overflow:hidden;

  }
  .header .logo{
    float: left;
    cursor:pointer;
    font-size: 22px;
  }
  .logo_prefix{
    color:#209e91;
  }
  .logo_suffix{
    color:#fff;
  }
  .website span{
    display:inline-block;
    color:#209e91;
  }
  .website span:first-child{
    color:#fff;
  }
  .header-right span{
    display:inline-block;
    margin-left:14px;
    font-size:18px;
    color:#fff;
    line-height:1px;
    height:18px;
    cursor:pointer;

  }
  .header-right span:hover{
    color:#209e91;
  }
  .user-header{
    float: right;
    line-height:10px;
    padding-top:7px;
    font-size:12px;
  }

  .user-header img{
    border-radius:50%;
    cursor:pointer;
  }

  .pop-image img{
    border-radius:50%;
  }
  .setting-div{
    height:30px;
    line-height:30px;
    clear:both;
  }
  .setting-div span{
    display:block;
    float:left;
    font-size:12px;
  }
  .setting-icon{
    padding-top:3px;
    padding-right:3px;
  }
</style>

