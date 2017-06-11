<template>
    <div class="salesMember">
      <el-form ref="form" label-width="80px" :model="member" >
        <el-col :span="6">
          <el-form-item label="会员编号">
            <el-input type="text"  :readonly="!showBtn" v-model="member.memberId" @keyup.enter.native="findMember"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="会员姓名">
            <el-input type="text" :readonly="true" v-model="member.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="会员折扣">
            <el-input type="text" :readonly="true" v-model="member.discount" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收银员">
            <el-input type="text" :readonly="true" v-model="cashier.cashierName"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
</template>

<script>
  import bus from 'components/common/js/bus'
	export default {
		name: 'salesMember',
    props : ['member', 'showBtn', 'cashier'],
    data() {
			return {
      }
    },
    created() {
			if(this.cashier.cashierName === '') {
        this.getLoginEdUser();
      }
    },
    methods : {
      getLoginEdUser () {
        this.$http.get('/api/user/employee/loginUserMessage',{}).then((req) =>{
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.$emit('update-sales-cashier', result.result);
            }else{
              this.$message.error(result.msg);
              this.$router.replace({name : 'Login' });
            }
          }
        },()=> {
          this.$message.error('连接服务器失败，请重新登录');
          this.$router.replace({name : 'Login' });
        });
      },
      //查询清单会员
      findMember() {
        if(this.member.memberId === '') {
        	this.$message.info('输入会员的卡号进行查询录入');
        }else{
        	this.$http.get('/api/user/getMemberById' , {
        		params : {
        			memberId : this.member.memberId
            }
          }, {}).then((req) => {
            if(req.ok) {
            	let result = req.body.result;
            	if(result.code) {
            	  let data = result.result;
            	  switch (data.length) {
                  case 0 :
                  	this.$message.info('查询不到指定会员信息');
                  	this.$emit('init-member');
                  	break;
                  case 1 :
                  	this.setMember(data[0]);
                  	break;
                }
              }else{
            		this.$message.error(result.msg);
              }
            }
          },()=>{
        		this.$message.error('连接服务器失败');
          })
        }
      },
      setMember(member) {
      	if(member.Status === -1) {
      		this.$message({
            type : 'warning',
            message  : '该用户已经被禁用，禁用原因为【 ' + member.remark + ' 】',
            duration : 6000
          });
        }else{
          this.$emit('update-member', member);
        }
      }
    }
	}
</script>

<style scoped>
  .salesMember{
    margin-top: 20px;
  }
</style>
