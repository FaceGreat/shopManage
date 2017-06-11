<template>
    <div class="cashRegisterTable">
      <!--<el-button type="danger" class="table-button">删除选中单据</el-button>-->
      <el-table
      :data="tableData"
      style="width: 100%">
        <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          prop="billId"
         label="收银单号"
          width="110">
        </el-table-column>
        <el-table-column
        prop="totalNum"
        label="合计数量"
        width="110">
      </el-table-column>
        <el-table-column
          inline-template
          label="合计金额"
          width="110">
          <span>{{ row.totalMoney /  (row.discountValue || 1) | currency }}</span>
        </el-table-column>
        <el-table-column
          inline-template
          label="优惠减免"
          width="110">
          <span>{{ row.totalMoney /  (row.discountValue || 1) - row.totalMoney | currency }}</span>
        </el-table-column>
        <el-table-column
          inline-template
          label="应收金额"
          width="110">
          <span>{{ row.totalMoney | currency }}</span>
        </el-table-column>
        <el-table-column
          prop="name"
          label="会员姓名"
          width="110">
        </el-table-column>
        <el-table-column
          prop="billUserName"
          label="收银员"
          width="100">
        </el-table-column>
        <el-table-column
          prop="systemTime"
          label="制单时间"
          :formatter="dataFormat"
          width="140">
        </el-table-column>
        <el-table-column
          prop="billTime"
          label="收银时间"
          :formatter="timeFormat"
        width="180">
        </el-table-column>
        <el-table-column
        inline-template
        fixed="right"
        label="操作"
        width="200">
          <div>
            <el-button type="danger" size="small" @click="deleteSingleCash(row.billId)">删除单据</el-button>
            <el-button type="info" size="small" @click="findBillMessage(row)">查看单据</el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import dateMixin from 'mixin/dateMixin'
  import deleteMixin from 'mixin/deleteMixin'
  import billMixin from 'mixin/billMixin'
	export default {
		name: 'cashRegisterTable',
    props : ['tableData'],
    mixins : [dateMixin, deleteMixin, billMixin],
    data () {
			return  {
        billId : ''
      }
    },
    methods :{
    }
	}
</script>

<style scoped>
  .table-button{
    margin-bottom: 20px;
  }
</style>
