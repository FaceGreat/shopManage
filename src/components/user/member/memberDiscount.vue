<template>
  <div>
    <v-bar-title vBarTitle="会员折扣管理"></v-bar-title>
    <el-dialog title="会员类型信息" v-model="dialogVisible">
      <discount-form :form="memberType"></discount-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMemberDiscount" v-show="showBtn">确 定</el-button>
          <el-button type="primary" @click="updateMemberDiscount" v-show="!showBtn">保 存</el-button>
      </span>
    </el-dialog>
    <el-card>
      <el-button type="success" style="margin-bottom: 20px;" @click="dialogVisible = true">添加会员类型</el-button>
      <el-table
      :data="tableData"
      style="width: 100%;">
        <el-table-column
          label="编号"
          width="100">
          <template scope="scope">
            <span>{{ ( pageModule.currentPage-1 ) * pageModule.page + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="会员类型名称">
        </el-table-column>
        <el-table-column
          prop="discount"
          label="会员折扣">
        </el-table-column>
        <el-table-column
          prop="timesLimit"
          label="满足折扣数量">
        </el-table-column>
        <el-table-column
          prop="costLimit"
          label="满足折扣金额">
        </el-table-column>
        <el-table-column
          inline-template
          label="操作">
          <div>
            <el-button type="info" size="small" @click="editMemberDiscount(row)">修改</el-button>
            <el-button type="danger" size="small" @click="deleteMemberDiscount(row.discountId, row.name)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <common-pagination
        :pageModule="pageModule"></common-pagination>
    </el-card>

  </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import discountForm from 'components/user/member/discountForm'
  import commonPagination from 'components/common/commonPagination'

  import paginationMixin from 'mixin/paginationMixin'
  export default {
    name: '',
    mixins : [paginationMixin],
    data() {
      return {
        tableData : [],
        showBtn : true,
        dialogVisible: false,
        memberType : []
      }
    },
    created(){
      this.initPageModule();
      this.initMemberType();
      this.getMemberDiscountByPage();
      this.updatePageModule({
        callback : this.getMemberDiscountByPage
      });
    },
    methods : {
    	//初始化会员类型类
      initMemberType() {
      	return this.memberType = {
      		discountId : '',
      		name : '',
          discount : parseFloat(1),
          timesLimit : 1,
          costLimit  : ''
        }
      },
      //获取指定页数的会员类型信息
      getMemberDiscountByPage () {
      	this.$http.get('/api/user/getMemberDiscountByPage', {
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
        }, () => {
      		this.$message.error('连接服务器失败');
        });
      },
      //添加一个会员类型信息
      addMemberDiscount() {
      	this.$http.post('/api/user/saveMemberDiscount', this.memberType, {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
              this.$message.success(result.msg);
              //关闭模态框
              this.dialogVisible = false;
              //更新表格信息
              this.getMemberDiscountByPage();
              //清除模型
              this.initMemberType();
            }else{
          		this.$message.error(result.msg);
            }
          }
        },() => {
      		this.$message.error('连接服务器失败');
        });
      },
      //指定修改内容
      editMemberDiscount(row) {
        this.memberType = Object.assign({}, row);
        this.showBtn = false;
        this.dialogVisible = true;
      },
      //更新指定
      updateMemberDiscount() {
        this.$http.put('/api/user/updateMemberDiscountById', this.memberType, {}).then((req)=> {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
          		this.$message.success(result.msg);
            }else{
          		this.$message.error(result.msg);
            }
            //关闭模态框
            this.dialogVisible = false;
            this.showBtn = true;
            //更新表格信息
            this.getMemberDiscountByPage();
            //清除模型
            this.initMemberType();
          }
        },() =>{
        	this.$message.error('连接服务器失败');
        });
      },
      //删除指定会员类型
      deleteMemberDiscount(discountId, name) {
        const self = this;
        this.$msgbox({
          title: '删除会员类型信息',
          message: '确定删除【 ' + name + ' 】类型',
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass :'el-button--danger',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在删除...';
              self.$http.delete('/api/user/deleteMemberDiscountById/' + discountId ).then((req) => {
                if(req.ok){
                  let result = req.body.result;
                  if(result.code) {
                    self.$message.success(result.msg);
                  }else{
                    self.$message.error(result.msg);
                  }
                }
                //更新
                this.getMemberDiscountByPage();
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
      vBarTitle,discountForm, commonPagination
    }
  }
</script>

<style scoped>
</style>
