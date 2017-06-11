<template>
  <div class="memberTable">
    <el-table
      :data="tableData"
      style="width:100%;">
      <member-table-column></member-table-column>
      <el-table-column
        prop="Status"
        label="状态"
        width="80"
        :formatter="StatusFormat">
      </el-table-column>
      <el-table-column
        prop="regDate"
        label="注册日期"
        width="120"
        :formatter="timeFormat">
      </el-table-column>
      <el-table-column
        inline-template
        fixed="right"
        label="操作"
        width="224">
        <div>
          <el-button type="info" size="small" @click="editMember(row)">修改</el-button>
          <el-button size="small" @click="putMemberStatus(row)">切换状态</el-button>
          <el-button type="danger" size="small" @click="deleteMember(row)">删除</el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  import memberTableColumn from 'components/user/member/memberTableColumn'

  import commonMixin from 'mixin/commonMixin'
  import member from 'mixin/member'
  import deleteMixin from 'mixin/deleteMixin'


	export default {
		name: 'memberTable',
    mixins : [member, commonMixin, deleteMixin],
    props : ['tableData'],
    data() {
			return {
				member : {},
        visible : {},
        memberId : ''
      }
    },
    components :{
      memberTableColumn
    },
    methods : {
			//要修改的数据
      editMember(row) {
        this.$emit('edit-member', Object.assign({}, row));
      },
      //切换会员使用状态
      putMemberStatus(row) {
      	this.$emit('put-member-status', Object.assign({}, row));
      },
      //删除指定会员信息
      deleteMember(row) {
      	this.memberId = row.memberId;
        this.openMsgbox({
          title : '删除会员信息',
          message : '确定删除【'+ row.name +'】会员',
          callback: this.removeMember
        })
      },
      //确认删除指定会员信息
      removeMember () {
      	this.$http.delete('/api/user/deleteMemberById/' + this.memberId, {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
          		this.$message.success(result.msg);
          		this.$emit('update-member-table');
            }else{
          		this.$message.error(result.msg);
            }
          }
        },()=>{
      		this.$message.error('连接服务器失败');
        });
      },
      //时间格式化
      timeFormat(row, column) {
        return new Date(row[column.property]).toLocaleDateString();
      },
      //状态格式化
      StatusFormat(row, column) {
        return row[column.property] === 1 ? '可用' : '禁用';
      }
    }
	}
</script>

<style scoped>
</style>
