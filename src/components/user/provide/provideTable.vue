<template>
    <div>
      <el-table
        :data="tableData"
        border
        stripe
        fit
        style="width: 100%">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="供应商编号">
                <span>{{ props.row.provideId }}</span>
              </el-form-item>
              <el-form-item label="名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="供应类别">
                <span>{{ props.row.categoryName }}</span>
              </el-form-item>
              <el-form-item label="联系人">
                <span>{{ props.row.contactPerson }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.contactPhone }}</span>
              </el-form-item>
              <el-form-item label="联系地址">
                <span>{{ props.row.contactAddress }}</span>
              </el-form-item>
              <el-form-item label="联系邮箱">
                <span>{{ props.row.contactEmail }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ props.row.Status === 1 ? '可用' : '禁用' }}</span>
              </el-form-item>
              <el-form-item label="描述">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="供应类别">
        </el-table-column>
        <el-table-column
          prop="contactPerson"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="Status"
          label="状态"
          :formatter="statusFormat" >
        </el-table-column>
        <el-table-column
          label="操作"
          inline-template
          width="224">
          <div>
            <el-button type="info" size="small" @click="editProvide(row)">修改</el-button>
            <el-button  size="small" @click="toggleProvideStatus(row.Status, row.provideId)">切换状态</el-button>
            <el-button type="danger" size="small" @click="deleteProvideById(row.name, row.provideId)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <common-pagination
        :pageModule="pageModule"></common-pagination>
    </div>
</template>

<script>
  import commonPagination from 'components/common/commonPagination'

  import bus from 'components/common/js/bus'
  import paginationMixin from 'mixin/paginationMixin'
	export default {
		name: '',
    mixins : [paginationMixin],
    data() {
			return {
        tableData : [],
        categoryId: '',
      }
    },
    created() {
      this.initPageModule();
      this.findProvideByPage(0);
      bus.$on('findProvideByPage', (categoryId) => {
        this.categoryId = categoryId === '' ? 0 : categoryId;
        this.findProvideByPage();
      });
      this.updatePageModule({
        callback : this.findProvideByPage
      });
    },
    components : {
      commonPagination
    },
    methods : {
      //获取指定页数的供应商信息
			findProvideByPage () {
        let params = {
            'p.categoryId' : this.categoryId ||  arguments[0]
        };
				this.$http.get('/api/user/provide/getProvideByPage',{ params : {
          findModel : JSON.stringify(params),
          pageModel : JSON.stringify({
            page : this.pageModule.page, // 每页显示数据条数
            currentPage : this.pageModule.currentPage, //当前页
          })
        }}, {}).then((req) => {
					if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
            	this.$message.error(result.msg);
            }
          }else{
						this.$message.error('连接服务器失败')
          }
        });
      },
      //状态格式化
      statusFormat (row, column) {
				return row[column.property] === 1 ? '可用' : '禁用';
      },
      //切换指定用户的状态
      toggleProvideStatus(Status, provideId) {
				this.$http.put('/api/user/provide/updateProvideStatusById', {Status : Status , provideId : provideId},{}).then((req)=> {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
              this.$message.success(result.msg);
          		this.findProvideByPage();//更新
            }else{
              this.$message.error(result.msg);
            }
          }else{
            this.$message.error('连接服务器失败');
          }
        });
      },
      //修改所有指定的供应商
      editProvide(row) {
        this.$router.push({name : 'updateProvide', params: { provide: Object.assign({}, row)}});
      },
      //删除指定id的供应商
      deleteProvideById(name, provideId) {
        const self = this;
        this.$msgbox({
          title: '删除供应商',
          message: '确定删除【 ' + name + ' 】供应商',
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass :'el-button--danger',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在删除...';
              self.$http.delete('/api/user/provide/deleteProvideById/' + provideId).then((req) => {
                if(req.ok){
                  let result = req.body.result;
                  if(result.code) {
                    self.$message.success(result.msg);
                  }else{
                    self.$message.error(result.msg);
                  }
                }else{
                  self.$message.error('连接服务器失败');
                }
                done();
                instance.confirmButtonLoading = false;
                //更新
                self.findProvideByPage();
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

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
