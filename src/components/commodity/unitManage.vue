<template>
    <div class="unitManage">
      <v-bar-title vBarTitle="商品单位管理"></v-bar-title>
      <el-card class="box-card">
        <el-button type="primary" class="btn" @click="dialogShow=true;btnShow=true;">添加商品新单位</el-button>
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
            label="单位">
          </el-table-column>
          <el-table-column inline-template label="操作">
            <div>
              <el-button
                @click="editUnit(row)"
                size="small" class="small-btn">
                修改
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteUnit(row)"
                class="small-btn">
                删除
              </el-button>
            </div>
          </el-table-column>
        </el-table>
        <common-pagination
          :pageModule="pageModule"></common-pagination>
        <el-dialog title="商品新单位" v-model="dialogShow" size="tiny">
          <el-form :model="singleUnit">
            <el-form-item label="单位名称" :label-width="formLabelWidth" class="dialog-item">
              <el-input v-model="singleUnit.name"  class="dialog-input" auto-complete="off" placeholder="商品新单位"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShow = false">取 消</el-button>
            <el-button type="success" @click="addUnit" v-show="btnShow">添 加</el-button>
            <el-button type="primary" @click="updateUnit"  v-show="!btnShow">保 存</el-button>
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
		name: 'unitManage',
    mixins : [paginationMixin],
    data () {
			return {
        dialogShow : false,
        formLabelWidth: '80px',
        btnShow: true,
        singleUnit : {
        	unitId : 0,
        	name : ''
        },
        tableData: []
      }
    },
    created(){
      this.initPageModule();
      this.findUnitByPage();
      this.updatePageModule({
        callback : this.findUnitByPage
      });
    },
    components : {
      vBarTitle, commonPagination
    },
    methods : {
			//初始化参数
      initSingleUnit() {
        this.singleUnit = {
          unitId : 0,
            name : ''
        }
      },
			//获取指定页数的商品单位
      findUnitByPage () {
        this.$http.get('/api/commodity/findUnitByPage', {
          params : {
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        },{}).then((req)=>{
          if(req.ok){
            let result = req.body.result;
            if(result.code) {
              this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
              this.$message.error(result.msg);
            }
          }
        }, ()=> {
          this.$message.error('连接服务器失败');
        })
      },
      //添加商品单位
      addUnit() {
        this.$http.post('/api/commodity/addUnit', { name : this.singleUnit.name},{}).then((req)=>{
          if(req.ok){
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              //  更新表格
              this.findUnitByPage();
              this.initSingleUnit();
            }else{
              this.$message.error(result.msg);
            }
          }else{
            this.$message.error('连接服务器失败');
          }
        });
        this.dialogShow = false;
      },
      //更新条商品信息
      updateUnit() {
        this.$http.put('/api/commodity/updateUnitById', this.singleUnit).then((req) => {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              //更新表格
              this.findUnitByPage();
              this.initSingleUnit();
            }else{
              this.$message.error(result.msg);
            }
          }else{
            this.$message.error('连接服务器失败');
          }
        });
        this.dialogShow = false;
      },
      editUnit(param) {
        this.singleUnit = Object.assign({}, param);
        this.dialogShow=true;
        this.btnShow=false;
      },
      //删除一个商品单位
      deleteUnit (param) {
      	const self = this;
        this.$msgbox({
          title: '删除商品单位',
          message: '确定删除【 ' + param.name + ' 】单位',
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass :'el-button--danger',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在删除...';
              self.$http.delete('/api/commodity/deleteUnitById/' + param.unitId ).then((req) => {
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
                this.findUnitByPage();
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
