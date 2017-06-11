<template>
    <div>
      <v-bar-title vBarTitle="我的进货单管理"></v-bar-title>
      <el-card>
        <common-find-form
          :findModel="findModel"></common-find-form>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            inline-template
            label="操作">
            <div>
              <el-button type="info" size="small" @click="operating(row)">操作</el-button>
              <el-button type="danger" size="small" @click="removePurchaseList(row.serialId, 3, row.reviewId)">删除单据</el-button>
            </div>
          </el-table-column>
          <purchase-list-info-table-column></purchase-list-info-table-column>
        </el-table>
        <common-pagination
          :pageModule="pageModule"></common-pagination>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import commonFindForm from 'components/common/commonFindForm'
  import purchaseListInfoTableColumn from  'components/purchase/purchaseListInfoTableColumn'
  import commonPagination from 'components/common/commonPagination'

  import purchaseMixin from 'mixin/purchaseMixin'
  import commonFindMixin from 'mixin/commonFindMixin'

  import bus from 'components/common/js/bus'
  import paginationMixin from 'mixin/paginationMixin'
	export default {
		name: '',
    mixins: [purchaseMixin, commonFindMixin, paginationMixin],
    data (){
			return {
        tableData : []
      }
    },
    created (){
      this.initCommonFind();
      this.initPageModule();
      this.updateCommonFind({
        message : '选择进货时间段',
        callback : this.findPurchaseByEmployeeAndPage
      });
      this.findPurchaseByEmployeeAndPage();
      this.updatePageModule({
        callback : this.findPurchaseByEmployeeAndPage
      });
    },
    methods : {
    	//获取指定员工指定页数的进货单管理信息
      findPurchaseByEmployeeAndPage() {
        let params = {
          'r.systemTime' : {
            startDate : this.formatsStartDate(this.findModel.startDate),
            endDate : this.formatsEndDate(this.findModel.endDate),
          },
          'r.Status' : this.findModel.status,
        };
        this.$http.get('/api/purchase/findPurchaseByEmployeeAndPage', {
            params : {
              findModel : JSON.stringify(params),
              pageModel : JSON.stringify({
                page : this.pageModule.page, // 每页显示数据条数
                currentPage : this.pageModule.currentPage, //当前页
              })
            }
        }, {}).then((req) =>{
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
        })
      },
      //操作进货单
      operating(row) {
      	let params = {
      		serialId : row.serialId,//入库清单号
          reviewId : row.reviewId,//入库审核号
          Status : row.Status,//入库审核状态
          system : true //是否为制单人， false表示为审核状态
        };
      	this.$router.push({name : 'purchaseListMessage', params : {purchaseInfo : params} });
      }
    },
    components : {
      vBarTitle, commonFindForm, purchaseListInfoTableColumn, commonPagination
    }
	}
</script>

<style scoped>
</style>
