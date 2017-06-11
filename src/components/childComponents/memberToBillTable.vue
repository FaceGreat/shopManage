<template>
    <div class="memberToBillTable">
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%">
        <el-table-column
          inline-template
          fixed="right"
          label="操作"
          width="80">
          <el-tag type="primary" v-show="row.checked">选&nbsp;&nbsp;中</el-tag>
        </el-table-column>
        <member-table-column></member-table-column>
      </el-table>
      <common-pagination
        :pageModule="pageModule"></common-pagination>
    </div>
</template>

<script>
  import memberTableColumn from 'components/user/member/memberTableColumn'
  import commonPagination from 'components/common/commonPagination'

  import paginationMixin from 'mixin/paginationMixin'
	export default {
		name: 'memberToBillTable',
    props : ['visible'],
    mixins: [paginationMixin],
    data() {
			return {
        tableData : [],
      }
    },
    created () {
      this.initPageModule();
      this.findAllBillMember();
      this.updatePageModule({
        callback : this.findAllBillMember
      });
    },
    components : {
      memberTableColumn, commonPagination
    },
    methods : {
			findAllBillMember() {
        this.$http.get('/api/user/findAllBillMember', {
        	params : {
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        }, {}).then((req)=>{
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              let data = result.result[0];
              let len = data.length;
              this.pageModule.total = result.result[1][0].count;
            	for(let i = 0;i< len;i++){
                data.checked = false;
              }
              this.tableData = data;
            }else{
              this.$message.error(result.msg);
            }
          }
        },()=>{
        	this.$message.error('连接服务器失败');
        });
      },
      //切换单选选中
      handleCurrentChange(currentRow, oldCurrentRow) {
				if(oldCurrentRow !== null) {
          oldCurrentRow.checked =false;
        }
        this.visible.props.member = currentRow;
				currentRow.checked = true;
      }
    }
	}
</script>

<style scoped>
</style>
