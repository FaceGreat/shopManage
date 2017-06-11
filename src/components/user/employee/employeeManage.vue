<template>
  <div>
    <v-bar-title vBarTitle="员工信息管理"></v-bar-title>
    <el-card>
      <el-row>
        <el-col :span="24">
            <el-col :span="3">
              <router-link tag="button" to="/home/employee/addEmployee" class="el-button el-button--success">添加新员工</router-link>
            </el-col>
            <el-col :span="8">
              <el-form :model="propsModel" label-width="120px">
                <el-form-item label="快速查询：" class="item">
                  <el-input v-model="propsModel.content"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="3">
              <el-button style="width:100%; margin-left: 20px;" @click="getEmployeeByPage">查 询</el-button>
            </el-col>
          </el-col>
        <el-col :span="24" class="employee-table">
            <section-select :selectModel="propsModel.roleId" @on-result-change="onResultChange"></section-select>
            <employee-message-table
              :tableData="tableData"></employee-message-table>
          <common-pagination
            :pageModule="pageModule"></common-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import sectionSelect from 'components/user/employee/sectionSelect'
  import employeeMessageTable from 'components/user/employee/employeeMessageTable'
  import commonPagination from 'components/common/commonPagination'

  import paginationMixin from 'mixin/paginationMixin'

  import bus from 'components/common/js/bus'
  export default {
    name: '',
    mixins : [paginationMixin],
    data() {

      return{
        tableData : [],
        selectData : [],
        propsModel : {
          content : '',
          roleId : 0
        }
      }
    },
    created() {
      this.initPageModule();
      this.getEmployeeByPage();
      this.updatePageModule({
        callback : this.getEmployeeByPage
      });
    },
    methods: {
      //下拉值改变时改变表格内容
      onResultChange(val) {
        this.propsModel.roleId = val === '' ? 0 : val;
        this.getEmployeeByPage();
      },
      //获取指定页数的员工信息
      getEmployeeByPage () {
        this.$http.get('/api/user/employee/getEmployeeByPage',{
        	params :{
            propsModel :  JSON.stringify(this.propsModel),
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
        	}
        }, {}).then((req)=>{
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
              this.$message.error(result.msg);
            }
          }
        },()=>{
          this.$message.error('连接服务器失败');
        })
      },
    },
    components : {
      vBarTitle, sectionSelect, employeeMessageTable, commonPagination
    }
  }
</script>

<style scoped>
  .employee-table{
    margin-top: 16px;
    padding: 16px;
    border: 1px solid #99a9bf;
  }
</style>
