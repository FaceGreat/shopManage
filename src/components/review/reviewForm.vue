<template>
  <el-row :span="24"  class="form">
    <el-form :model="review">
      <el-col :span="6">
        <el-form-item label="制单人：">
          <el-input type="text" v-model="review.systemName" style="width: 150px;" :readonly="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="制单时间：">
          <el-date-picker
            type="date"
            style="width: 150px;"
            v-model="review.systemTime"
            placeholder="制单日期"
            :readonly="true">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="审核人：">
          <el-input type="text"  v-model="review.reviewPersonId" style="width: 150px;" :readonly="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="审核时间：">
          <el-date-picker
            type="date"
            style="width: 150px;"
            v-model="review.reviewTime"
            placeholder="审核日期"
            :readonly="true">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
  import bus from 'components/common/js/bus.js'
	export default {
		name: '',
    data() {
			return  {
				review :{
          systemId : '', //制单人，当前保存在session中的用户
          systemName : '',//制单人的姓名
          systemTime : '',//添加保存时的时间
          reviewPersonId : '',//审核人
          reviewTime : '',//审核时间
          status : 1
        }
      }
    },
    created (){
      setTimeout(()=>{
      	if(this.review.systemName === '') {
          this.getLoginEdUser();
        }
      },100);
      bus.$on('update-review-message', (val)=> {
        this.review = Object.assign({}, val);
      });
      bus.$on('init-review-form', ()=> {
        Object.assign(this.$data, this.$options.data());
        this.getLoginEdUser();
      });
    },
    methods : {
      getLoginEdUser () {
        this.$http.get('/api/user/employee/loginUserMessage',{}).then((req) =>{
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.review.systemName = result.result.name;
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
    }
	}
</script>

<style scoped>
</style>
