<template>
  <div class="login_bg">
    <div class="login">
      <h3 class="title">百加商品管理及收银一体化系统</h3>
      <v-title message="用户登录"></v-title>
      <div class="login-content">
        <el-form ref="form" :rules="rules"  :model="form" label-width="100px" @keyup.enter.native="login('form')">
          <el-form-item label="员工号" label-position="left" prop="username">
            <el-input class="login_input" v-model="form.username"  autofocus placeholder="员工号" type="text" ></el-input>
          </el-form-item>
          <el-form-item label="密码" label-position="left" prop="password">
            <el-input class="login_input" v-model="form.password" placeholder="密码" type="password" ></el-input>
          </el-form-item>
          <el-form-item >
            <el-button class="login_btn" type="primary" @click="login('form')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <v-title message="欢迎使用"></v-title>
    </div>
  </div>
</template>
<script>
import vTitle from 'components/login/LoginTitle'
export default {
  name: 'login',
  data () {
    return {
      form : {
      	username : '',
        password : ''
      },
      rules : {
      	username : [
          { required : true, message : '员工号不能为空', trigger: 'blur' }
        ],
        password : [
          { required : true, message : '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    vTitle
  },
  methods : {
    loginEnter(ev) {
      if(ev.keyCode == 13){
        this.login('form');
      }
    },
    login(form) {
      this.$refs[form].validate((valid) => {
        if(valid) {
        	this.$http.get('/api/user/employee/login', {params : this.form}, {}).then((req) => {
            if(req.ok) {
            	let result = req.body.result;
            	if(result.code) {
            		this.$message.success(result.msg);
                //登录
                this.$router.push({path : '/home' });
              }else{
            		this.$message.error(result.msg);
              }
            }
          },()=> {
        		this.$message.error('连接服务器失败');
          });

        }else{
        	this.$message.error('按提示填写相关信息后再登录');
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  h1, h2 {
  font-weight: normal;
  }
  .title{
    text-align: center;
  }
  .login_bg{
    background: url('../assets/login_bg.jpg');
  }
  .login{
      background: rgba(255, 255, 255, 0.51);
      margin: 150px auto 0 auto;
      min-height: 420px;
      max-width: 420px;
      padding: 40px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 4px;
      /* overflow-x: hidden; */
      box-sizing: border-box;
   }

  .login-content{
    margin-left: -30px;
  }
  .login_input {
    margin-bottom:14px;
    height: 30px;
  }
  .login_btn{
    float: right;
    width:100%;
  }
</style>
