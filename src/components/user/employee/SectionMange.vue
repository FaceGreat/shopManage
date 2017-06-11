<template>
    <div class="sectionManage">
      <v-bar-title vBarTitle="员工所属部门管理"></v-bar-title>
      <el-card>
        <el-button type="primary" class="btn" @click="dialogShow=true;btnShow=true;">添加新部门</el-button>
        <el-table
          :data="tableData"
          border
          stripe
          fit
          style="width: 100%">
          <el-table-column
            type="index"
            label="编号"
            width="120">
          </el-table-column>
          <el-table-column
            property="name"
            label="部门名称">
          </el-table-column>
          <el-table-column inline-template label="操作">
            <div>
              <el-button
                @click="editSection(row)"
                size="small" class="small-btn">
                修改
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteSection(row)"
                class="small-btn">
                删除
              </el-button>
            </div>
          </el-table-column>
        </el-table>
        <common-pagination
          :pageModule="pageModule"></common-pagination>
        <el-dialog title="公司新部门" v-model="dialogShow" size="tiny">
          <el-form :model="singleSection">
            <el-form-item label="部门名称" :label-width="formLabelWidth" class="dialog-item">
              <el-input v-model="singleSection.name"  class="dialog-input" auto-complete="off" placeholder="部门名称"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShow = false">取 消</el-button>
            <el-button type="success" @click="addSection" v-show="btnShow">添 加</el-button>
            <el-button type="primary" @click="updateSection"  v-show="!btnShow">保 存</el-button>
          </div>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import commonPagination from 'components/common/commonPagination'

  import paginationMixin from 'mixin/paginationMixin'
	export default {
		name: 'sectionManage',
    mixins　: [paginationMixin],
    data() {
			return{
        dialogShow : false,
        formLabelWidth: '80px',
        btnShow: true,
        singleSection : {
          roleId : 0,
          name : ''
        },
        tableData: []
      }
    },
    created()　{
      this.initPageModule();
      this.getSectionByPage();
      this.updatePageModule({
        callback : this.getSectionByPage
      });
    },
    methods: {
			//初始化部门模型
			initSection() {
				this.singleSection  = {
          roleId : 0,
          name : ''
        }
      },
      //获取指定页数的部门信息
      getSectionByPage () {
				this.$http.get('/api/user/role/getRoleByPage', {
					params : {
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        }, {}).then((req) => {
					if(req.ok) {
						let result = req.body.result;
						if(result.code) {
              this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
							this.$message.error(result.msg);
            }
          }
        }, ()=>{
					this.$message.error('连接服务器失败');
        })
      },
      //添加部门
      addSection () {
        this.$http.post('/api/user/role/addRole', this.singleSection, {}).then((req)=> {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
          		this.$message.success(result.msg);
          		//更新表格
              this.getSectionByPage();
              //更新模型数据
              this.initSection();
            }else{
          		this.$message.error(result.msg);
            }
          }
        }, ()=> {
        	this.$message.error('连接服务器失败');
        });
        this.dialogShow = false;
      },
      //指定修改的部门信息
      editSection(row) {
        this.singleSection = Object.assign({}, row);
        this.dialogShow=true;
        this.btnShow=false;
      },
      //更新部门信息
      updateSection() {
        this.$http.put('/api/user/role/updateRoleById', this.singleSection, {}).then((req) => {
        	if(req.ok) {
        	  let result = req.body.result;
        	  if(result.code) {
              this.$message.success(result.msg);
              //更新表格
              this.getSectionByPage();
              //更新模型数据
              this.initSection();
            }else{
        	  	this.$message.error(result.msg);
            }
          }
        },()=>{
        	this.$message.error('连接服务器失败');
        });
        this.dialogShow = false;
      },
      //删除指定部门信息
      deleteSection(param) {
        const self = this;
        this.$msgbox({
          title: '删除公司部门信息',
          message: '确定删除【 ' + param.name + ' 】部门',
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass :'el-button--danger',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在删除...';
              self.$http.delete('/api/user/role/deleteRoleId/' + param.roleId ).then((req) => {
                if(req.ok){
                  let result = req.body.result;
                  if(result.code) {
                    self.$message.success(result.msg);
                  }else{
                    self.$message.error(result.msg);
                  }
                }
                //更新
                this.getSectionByPage();
              },()=> {
                self.$message.error('连接服务器失败');
              });
              done();
              instance.confirmButtonLoading = false;
            } else {
              instance.confirmButtonLoading = false;
              done();
            }
          }
        });
      }
    },
    components : {
      vBarTitle, commonPagination
    }
	}
</script>

<style scoped>
  .btn{
    margin-bottom: 14px;
  }
  .small-btn{
    width: 80px;
  }
  .dialog-item{
    margin: 0 auto;
  }
  .dialog-input{
    width:200px;
  }
</style>
