<template>
    <div class="purchaseManage">
      <v-bar-title vBarTitle="进货单管理"></v-bar-title>
      <el-card>
        <common-find-form
          :findModel="findModel"></common-find-form>
        <el-table
          :data="tableData"
          style="width:100%;">
          <el-table-column
            prop="commodityId"
            label="入库单号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="serialDate"
            label="入库时间"
            width="110"
            :formatter="dataFormatter">
          </el-table-column>
          <el-table-column
            inline-template
            label="合计金额"
            width="120">
            <span>{{ row.costPrice * row.commodityNumber | currency}}</span>
          </el-table-column>
          <el-table-column
            prop="provideName"
            label="供应商"
            width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            inline-template
            width="170">
            <div>
              <el-button type="info" size="small" @click="operating(row)">操作</el-button>
              <el-button type="danger" size="small" @click="removePurchaseList(row.serialId, 1, row.reviewId)">删除单据</el-button>
            </div>
          </el-table-column>
          <provide-manage></provide-manage>
        </el-table>
        <common-pagination
          :pageModule="pageModule"></common-pagination>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import commonFindForm from 'components/common/commonFindForm'
  import provideManage from 'components/purchase/provideSelectDialog'
  import commonPagination from 'components/common/commonPagination'

  import purchaseMixin from 'mixin/purchaseMixin'
  import commonFindMixin from 'mixin/commonFindMixin'
  import paginationMixin from 'mixin/paginationMixin'

  import bus from 'components/common/js/bus'
	export default {
		name: 'purchaseManage',
    mixins: [purchaseMixin, commonFindMixin, paginationMixin],
    data () {
			return {
				tableData : []
      }
    },
    created (){
      this.initCommonFind();
      this.initPageModule();
      this.updateCommonFind({
        message : '选择进货时间段',
        callback : this.findAllPurchaseByEmployeeAndPage
      });
      this.findAllPurchaseByEmployeeAndPage();
      this.updatePageModule({
        callback : this.findAllPurchaseByEmployeeAndPage
      });
    },
    methods : {
			findAllPurchaseByEmployeeAndPage()  {
        let params = {
          'r.systemTime' : {
            startDate : this.formatsStartDate(this.findModel.startDate),
            endDate : this.formatsEndDate(this.findModel.endDate),
          },
          'r.Status' : this.findModel.status,
        };
        this.$http.get('/api/purchase/findAllPurchaseByEmployeeAndPage', {
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
        },()=>{
        	this.$message.error('连接服务器失败');
        })
      },
      //时间格式化
      dataFormatter(row, column) {
        if(!row[column.property]) {
          return '';
        }
        return new Date(row[column.property]).toLocaleDateString();
      },
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
      vBarTitle, commonFindForm, provideManage, commonPagination
    }
	}
</script>

<style scoped>
</style>
