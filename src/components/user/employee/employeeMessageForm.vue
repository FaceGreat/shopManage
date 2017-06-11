<template>
    <div class="employeeMessageForm">
      <v-bar-title vBarTitle="员工信息"></v-bar-title>
      <el-card>
        <router-link tag="button" to="/home/employeeManage" class="el-button el-button--success">管理员工信息</router-link>
        <h3 class="content-title">员工信息</h3>
        <p class="content-hr"></p>
        <el-form ref="form" label-width="120px" class="form" :model="employee">
          <el-form-item label="姓名">
            <el-input type="text"  placeholder="填写员工名称" v-model="employee.name" class="element"></el-input>
          </el-form-item>
          <el-form-item label="选择所属部门" >
            <el-select v-model="employee.roleId" placeholder="请选择" class="element">
              <el-option
                v-for="item in sectionOptions"
                :key="item.roleId"
                :label="item.name"
                :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位">
          <el-input type="text"  placeholder="填写员工职位" v-model="employee.position" class="element"></el-input>
          </el-form-item>
          <el-form-item label="状态" >
            <el-radio-group v-model="employee.Status">
              <el-radio :label="1">可用</el-radio>
              <el-radio :label="-1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入职时间">
            <el-date-picker
              class="element"
              v-model="employee.entryTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input type="text"  placeholder="填写员工联系电话" v-model="employee.contactPhone" class="element"></el-input>
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input type="text"  placeholder="填写员工联系地址" v-model="employee.contactAddress" class="element"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input type="text"  placeholder="填写员工身份证号" v-model="employee.IdCard" class="element"></el-input>
          </el-form-item>
          <el-form-item label="性别" >
            <el-radio-group v-model="employee.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="-1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="success" class="element" @click="addEmployee"  v-show="showBtn">添&nbsp;&nbsp;加</el-button>
            <el-button type="warning" class="element" @click="updateEmployee"  v-show="!showBtn">保&nbsp;&nbsp;存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle.vue'
	export default {
		name: 'employeeMessageForm',
    data() {
			return {
        employee : this.initEmployee(),
        sectionOptions : this.getAllSectionBySelect(),
        showBtn : this.initShowBtn(),
      }
    },
    methods : {
			//初始化员工信息
			initEmployee () {
				if(this.$route.params.employee){
          return this.$route.params.employee;
				}else{
          return {
            employeeId  : '', //员工号
            name : '',//员工姓名
            roleId : '',//员工所属角色
            position : '',//员工职位
            contactPhone : '',//员工联系电话
            contactAddress : '',//员工联系地址
            IdCard : '',//员工身份证件号
            entryTime : new Date(),//入职时间
            sex : 0,//性别
            Status : 1//状态
          }
        }
      },
      //初始化按钮
      initShowBtn() {
        return  this.$route.params.employee ? false : true;
      },
      //获取所有部门信息
      getAllSectionBySelect() {
        this.$http.get('/api/user/role/getRoleBySelect', {}).then((req) => {
          if (req.ok) {
            let result = req.body.result;
            if (result.code) {
              this.sectionOptions = result.result;
            } else {
              console.log(result.code);
            }
          }
        },() => {
          this.$message.error('连接服务器失败');
        });
      },
      //添加员工信息
      addEmployee() {
        this.employee.entryTime = this.employee.entryTime.toLocaleDateString();
				this.$http.post('/api/user/employee/addEmployee', this.employee,{}).then((req)=>{
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code){
          		this.$message.success(result.msg);
          		//跳转管理页面
              this.$router.push({name : 'employeeManage'});
            }else{
          		this.$message.error(result.msg);
            }
          }
        },()=>{
					this.$message.error('连接服务器失败');
        })
      },
      //更新指定员工信息
      updateEmployee() {
        this.employee.entryTime =  new Date(this.employee.entryTime).toLocaleDateString();
        this.$http.put('/api/user/employee/updateEmployeeById', this.employee, {}).then((req) =>{
        	if(req.ok) {
        	  let result = req.body.result;
        	  if(result.code) {
        	  	this.$message.success(result.msg);
              //跳转管理页面
              this.$router.push({name : 'employeeManage'});
            }else{
        	  	this.$message.error(result.msg);
            }
          }
        }, ()=>{
        	this.$message.error('连接服务器失败');
        })
      },
    },
    components: {
      vBarTitle
    },
	}
</script>

<style scoped>
  .form{
    margin-top: 20px;
    margin-left: 140px;
  }
  .element{
    width:350px;
  }
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
