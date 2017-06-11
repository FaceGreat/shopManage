<template>
    <div class="purchaseForm">
      <el-card>
        <el-form ref="form" label-width="100px" >
          <el-row>
            <el-col :span="24">
              <el-button v-show="goBack" @click="goBackFun">返回</el-button>
              <el-button :disabled="systemBtn" @click="createNewPurchase">新单</el-button>
              <el-button :disabled="systemBtn" @click="savePurchase" v-show="showBtn">制单</el-button>
              <el-button :disabled="systemBtn" @click="removePurchaseList(null, 2, reviewId)" v-show="!showBtn">弃单</el-button>
              <el-button :disabled="!systemBtn" @click="reviewPurchase">审核</el-button>
            </el-col>
            <el-col :span="24">
              <h3 class="content-title">进货单</h3>
              <p class="content-hr"></p>
            </el-col>
            <el-col :span="24"  class="form">
                <el-col :span="7">
                  <el-form-item label="入库日期：">
                    <el-date-picker
                      type="date"
                      v-model="purchase.serialDate"
                      placeholder="选择入库日期"
                      :readonly="!showBtn">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="备注：">
                    <el-input type="text"  placeholder="入库备注" :readonly="!showBtn" v-model="purchase.serialDesc"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="入库金额：" class="form-text">
                    <span >{{ purchase.totalMoney | currency }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <purchase-form-table
                    @on-result-change="onResultChange"
                    :showBtn="showBtn"
                    :tableData="tableData"
                    @clearSelection="clearPurchaseSelection">
                  </purchase-form-table>
                </el-col>
            </el-col>
          </el-row>
          <review-form></review-form>
        </el-form>
      </el-card>
    </div>
</template>

<script>
  import purchaseFormTable from 'components/purchase/purchaseFormTable'
  import reviewForm from 'components/review/reviewForm'

  import purchaseMixin from 'mixin/purchaseMixin'
  import bus from 'components/common/js/bus'
	export default {
    name: 'purchaseForm',
    mixins : [purchaseMixin],
    data () {
			return {
        systemBtn : false,
        goBack : false,
        showBtn : true,
        reviewId : '',
        serialId : '',
        tableData : [],
        purchase : {
          serialDate : new Date().toLocaleDateString(),
          serialDesc : '',
          totalMoney : 0,
          purchaseCommodityData : [],//进货单的商品数据集合*/
        }
      }
    },
    created (){
      this.initPurchase();
      //监听初始化data数据
    	bus.$on('init-purchase-form', () => {
    		this.goBack = false;
        Object.assign(this.$data, this.$options.data());
        bus.$emit('init-purchase-form-table');
        bus.$emit('init-review-form');
      });
    },
    methods : {
    	//初始化进货单信息
    	initPurchase () {
        if(this.$route.params.purchaseInfo) {
        	let params = this.$route.params.purchaseInfo;
        	if(params.Status === 2) {
        		//审核通过
            this.systemBtn = false;
          }else{
            this.systemBtn = !params.system;
          }
          this.goBack = true;
          this.showBtn = !this.showBtn;
          this.reviewId = params.reviewId;
          this.serialId =  params.serialId;
          this.$http.get('/api/purchase/findPurchaseListMessage', {
            params : {
              serialId : params.serialId,
              reviewId : params.reviewId
            }
          },{}).then((req) => {
          	if(req.ok) {
          	  let result = req.body.result;
          	  if(result.code) {
                this.purchase.serialDate = result.result[2][0].serialDate;
                this.purchase.serialDesc = result.result[2][0].serialDesc;
                this.purchase.totalMoney = result.result[2][0].totalMoney;
                //更新审核表信息
                bus.$emit('update-review-message', Object.assign({}, result.result[1][0]));
                //更新进货单商品表格信息
                /*bus.$emit('set-purchase-commodityData',result.result[0]);*/
                this.tableData = result.result[0];
              }else{
          	  	this.$message.error(result.msg);
              }
            }
          }, ()=> {
          	this.$message.error('连接服务器失败');
          })
        }
      },
    	//进货总额的实时更新
      onResultChange(val) {
        this.purchase.totalMoney = val;
      },
      //创建新的进货单
      createNewPurchase() {
        Object.assign(this.$data, this.$options.data());
        this.$message.success('创建新进货单成功');
      },
      //返回
      goBackFun() {
    		this.$router.go(-1);
      },
      //制单
      savePurchase () {
        let len = this.tableData.length;
        for(let i = 0;i< len;i++){
          this.purchase.purchaseCommodityData.push({
            commodityId : this.tableData[i].commodityId,
            num : this.tableData[i].num
          });
        }
       this.$http.post('/api/purchase/savePurchase', this.purchase, {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
          		this.$message.success(result.msg);
          		//跳转管理页面
              this.$router.push({name : 'myPurchaseList'});
            }else{
          		this.$message.error(result.msg);
            }
          }
        }, ()=> {
        	this.$message.error('连接服务器失败');
        })
      },
      //审核进货单
      reviewPurchase() {
    		//商品信息：this.purchase.purchaseCommodityData
        //审核id：this.reviewId
        this.$http.put('/api/purchase/reviewPurchase',{
          commodities :  this.tableData,
          reviewId : this.reviewId
        },{}).then((req) => {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              //跳转管理页面
              this.$router.push({name : 'purchaseListInfo'});
            }else{
              this.$message.error(result.msg);
            }
          }
        },() =>{
          this.$message.error('连接服务器失败');
        });
      },
      /*//更新进货单商品信息
      updatePurchaseCommodityData(data) {
        this.purchase.purchaseCommodityData = data;
      }*/
      //清空进货单表格全部信息
      clearPurchaseSelection() {
        this.tableData = [];
      }
    },
    components : {
      purchaseFormTable, reviewForm
    }
	}
</script>

<style scoped>
  .form{
    margin-top: 20px;
  }
  .content-title{
    text-align: center;
    margin: 12px 0;
  }
  .content-hr{
    display: block;
    margin: 0 auto;
    border-bottom: solid rgba(0, 13, 242, 0.49) 5px;
    width : 160px;
  }
  .form-text{
    margin-left: 20px;
  }
</style>
