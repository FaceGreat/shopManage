<template>
    <div>
      <v-bar-title vBarTitle="会员资料管理"></v-bar-title>
      <el-card>
        <el-button type="success" style="margin-bottom: 20px;" @click="openAddNewMember">添加新会员</el-button>
        <el-button type="danger" style="margin-bottom: 20px;" @click="deleteAllUnSetMember">删除禁用会员</el-button>
        <label class="selectLabel">指定会员类型查询</label>
        <el-select v-model="discountId" placeholder="请选择" clearable class="element" @change="onResultChange">
          <el-option
            v-for="item in options"
            :key="item.discountId"
            :label="item.name"
            :value="item.discountId">
          </el-option>
        </el-select>
        <common-dialog :visible="visible"></common-dialog>
        <member-table
          :tableData="tableData"
          v-on:edit-member="EditMember"
          v-on:put-member-status="PutMemberStatus"
          v-on:update-member-table="getMemberByPage"></member-table>
        <common-pagination
          :pageModule="pageModule"></common-pagination>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import memberTable from 'components/user/member/memberTable'
  import commonDialog from 'components/childComponents/commonDialog'
  import commonPagination from 'components/common/commonPagination'

  import member from 'mixin/member'
  import commonMixin from 'mixin/commonMixin'
  import deleteMixin from 'mixin/deleteMixin'
  import paginationMixin from 'mixin/paginationMixin'

  import bus from 'components/common/js/bus';

  export default {
    name: '',
    mixins : [member, commonMixin, deleteMixin, paginationMixin],
    data() {
      return {
        member : {},
        visible : {},
        dialogVisible : false,
        tableData : [],
        options : [],
        discountId : '',
      }
    },
    created () {
      this.initMember();//初始化会员对象
      this.initPageModule();
      this.getMemberByPage();//获取指定页数的会员个人信息
      this.getAllMemberDiscount();//获取所有的会员类型（选择）
      this.initVisible();
      this.updatePageModule({
        callback : this.getMemberByPage
      });
    },
    methods : {
      //获取指定页数的会员
      getMemberByPage() {
        let params = {
          'm.discountId' : this.discountId
        };
        this.$http.get('/api/user/getMemberByPage', { params : {
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
          }
        },() => {
        	this.$message.error('连接服务器失败');
        });
      },
      //删除指定会员信息
      deleteAllUnSetMember() {
        this.openMsgbox({
          title : '删除会员信息',
          message : '确定删除所有禁用的会员',
          callback: this.removeAllMember
        })
      },
      //确认删除
      removeAllMember() {
        this.$http.delete('/api/user/removeMemberByStatus', {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
          		this.$message.success(result.msg);
          		this.getMemberByPage();
            }else{
          		this.$message.error(result.msg);
            }
          }
        },()=> {
        	this.$message.error('连接服务器失败');
        });
      },
      //更新指定会员类型
      onResultChange(val) {
      	this.discountId = val;
        this.getMemberByPage();
      },
      //设置修改用户信息
      EditMember(row) {
      	this.member = row;
      	this.openEditMember();
      },
      //切换会员使用状态
      PutMemberStatus(row) {
        this.member = row;
        if(this.member.Status === 1) {
          //切换禁用
          this.openUpdateMemberStatus();
        }else{
          //切换可用
          this.member.remark = '';
          this.updateMemberStatus();
        }
        bus.$emit('update-remark');
      },
      //添加会员信息
      addMemberManage(){
        this.addMember();
        this.closeVisible();
      },
      //更新指定会员信息
      updateMember(){
        this.$http.put('/api/user/updateMemberById', this.member, {}).then((req) => {
          if(req.ok) {
            let result = req.body.result;
            if(result.code){
              this.$message.success(result.msg);
              this.initMember();
              this.getMemberByPage();
              this.closeVisible();
            }else{
              this.$message.error(result.msg);
            }
          }
        },() => {
          this.$message.error('连接服务器失败');
        });
      },
      //更新会员状态
      updateMemberStatus() {
      	if(this.member.Status === 1) {
          let str = [];
          let len = this.visible.props.checkEdList.length;
          if(len !== 0 ){
            for(let i = 0; i< len;i++) {
              str.push( this.visible.props.checkEdList[i] );
            }
          }
          str.push( this.member.remark );
          this.member.remark = str.toString();
        }
        this.$http.put('/api/user/updateMemberStatus', {
        	memberId : this.member.memberId,
          remark : this.member.remark
        }, {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
              this.$message.success(result.msg);
              if(this.member.Status === 1) {
                this.closeVisible();
              }
              this.initMember();
              this.getMemberByPage();

            }else{
          		this.$message.error(result.msg);
            }
          }
        },()=>{
        	this.$message.error('连接服务器失败');
        });
      },
    },
    components : {
      vBarTitle, memberTable, commonDialog, commonPagination
    }
  }
</script>

<style scoped>
  .selectLabel{
    font-size: 15px;
    margin: 0 10px;
  }
</style>
