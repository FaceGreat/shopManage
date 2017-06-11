<template>
    <div class="employeeMessageTable">
      <el-table
        :data="tableData"
        border
        stripe
        fit
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="76">
        </el-table-column>
        <el-table-column
          prop="employeeId"
          label="员工号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="员工姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="所属部门"
          width="100">
        </el-table-column>
        <el-table-column
          prop="position"
          label="职位"
          width="110">
        </el-table-column>
        <el-table-column
          prop="entryTime"
          label="入职时间"
          width="120"
           :formatter="entryTimeFormat">
        </el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话"
          width="130">
        </el-table-column>
        <el-table-column
          prop="contactAddress"
          label="联系地址"
          width="130">
        </el-table-column>
        <el-table-column
          prop="IdCard"
          label="身份证件号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="76"
          :formatter="sexFormat">
        </el-table-column>
        <el-table-column
          prop="Status"
          label="状态"
          width="76"
          :formatter="StatusFormat">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          inline-template
          width="224">
          <div>
            <el-button type="info" size="small" @click="editEmployee(row)" >修改</el-button>
            <el-button  size="small" @click="toggleEmployeeStatus(row.Status, row.employeeId)" >切换状态</el-button>
            <el-button type="danger" size="small" @click="deleteEmployeeById(row.name, row.employeeId)" >删除</el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import bus from 'components/common/js/bus'
	export default {
		name: 'employeeMessageTable',
    props: ['tableData'],
    data() {
			return {
        roleId : 0,
      }
    },
    created() {
			//快速查询
      bus.$on('fuzzyQuery', (findModel) => {
        this.fuzzyQuery(findModel);
      });
    },
    methods : {
      //获取指定修改员工的信息
      editEmployee(row) {
        this.$router.push({name : 'updateEmployee', params: { employee: Object.assign({}, row)}});
      },
      //更新用户状态
      toggleEmployeeStatus(status, employeeId) {
				this.$http.put('/api/user/employee/updateEmployeeStatusById', {Status : status, employeeId :employeeId}, {}).
          then((req)=> {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
          		this.$message.success(result.msg);
          		this.getEmployeeByPage(this.roleId);
            }else{
          		this.$message.error(result.msg);
            }
          }
        },()=> {
					this.$message.error('连接服务器失败');
        })
      },
      //删除一个员工信息
      deleteEmployeeById(employeeName, employeeId) {
        const self = this;
        this.$msgbox({
          title: '删除员工',
          message: '确定删除【 ' + employeeName + ' 】员工',
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass :'el-button--danger',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在删除...';
              self.$http.delete('/api/user/employee/deleteEmployeeById/' + employeeId).then((req) => {
                if(req.ok){
                  let result = req.body.result;
                  if(result.code) {
                    self.$message.success(result.msg);
                  }else{
                    self.$message.error(result.msg);
                  }
                }
                self.getEmployeeByPage(this.roleId);
              },() => {
                  self.$message.error('连接服务器失败');
              });
              done();
              instance.confirmButtonLoading = false;
              //更新
            } else {
              instance.confirmButtonLoading = false;
              done();
            }
          }
        });
      },
      entryTimeFormat(row, column) {
        return new Date(row[column.property]).toLocaleDateString();
      },
      sexFormat(row, column) {
				return row[column.property] === 1? '男' : '女';
      },
      StatusFormat(row, column) {
				return row[column.property] === 1 ? '可用' : '禁用';
      }
    }
	}
</script>

<style scoped>
  .employeeMessageTable{
    margin-top: 20px;
  }
</style>
