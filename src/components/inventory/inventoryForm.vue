<template>
  <el-card>
    <el-form ref="form" label-width="100px" >
      <el-row>
        <el-col :span="24">
          <el-button v-show="goBack" @click="goBackFun">返回</el-button>
          <el-button :disabled="systemBtn" @click="createNewInventoryList(true)">新单</el-button>
          <el-button :disabled="systemBtn" @click="saveInventoryList" v-show="showBtn">制单</el-button>
          <el-button :disabled="systemBtn"  v-show="!showBtn" @click="removeInventoryList(null, 2, reviewId)">弃单</el-button>
          <el-button :disabled="!systemBtn" @click="reviewInventoryList">审核</el-button>
        </el-col>
        <el-col :span="24">
          <h3 class="content-title">盘点单</h3>
          <p class="content-hr"></p>
        </el-col>
        <el-col :span="24"  class="form">
          <el-col :span="7">
            <el-form-item label="盘点日期：">
              <el-date-picker
                type="date"
                v-model="inventory.serialDate"
                placeholder="选择盘点日期"
                :readonly="!showBtn">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="备注：">
              <el-input type="text"  placeholder="盘点备注" :readonly="!showBtn" v-model="inventory.serialDesc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="盘点金额：" class="form-text">
              <span >{{ inventory.totalMoney | currency}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <inventory-form-table
              @on-result-change="onResultChange"
              :showBtn="showBtn"
             :tableData="tableData"
              @clearSelection="clearInventorySelection"></inventory-form-table>
          </el-col>
        </el-col>
      </el-row>
      <review-form></review-form>
    </el-form>
  </el-card>
</template>

<script>
  import inventoryFormTable from 'components/inventory/inventoryFormTable'
  import reviewForm from 'components/review/reviewForm'

  import inventoryMixin from 'mixin/inventoryMixin'

  import bus from 'components/common/js/bus'
  export default {
		name: '',
    mixins: [inventoryMixin],
    data (){
			return {
        systemBtn : false,
        goBack : false,
        showBtn : true,
        reviewId : '',//审核单号
        inventoryId : '',//盘点单号
        tableData : [],
        inventory : {
          serialDate : new Date().toLocaleDateString(),
          serialDesc : '',
          totalMoney : 0,
        }
      }
    },
    created() {
      this.initInventory();
      //监听初始化data数据
      bus.$on('init-inventory-form', () => {
        this.goBack = false;
        Object.assign(this.$data, this.$options.data());
        bus.$emit('init-inventory-form-table');
        bus.$emit('init-review-form');
      });
    },
    methods : {
    	//初始化盘点单
    	initInventory () {
        if(this.$route.params.inventoryInfo) {
          let params = this.$route.params.inventoryInfo;
          if(params.Status === 2) {
            //审核通过
            this.systemBtn = false;
          }else{
            this.systemBtn = !params.system;
          }
          this.goBack = true;
          this.showBtn = !this.showBtn;
          this.reviewId = params.reviewId;
          this.inventoryId = params.inventoryId;
          this.$http.get('/api/inventory/findInventoryListMessage', {
            params : {
              inventoryId : params.inventoryId,
              reviewId : params.reviewId
            }
          },{}).then((req) => {
            if(req.ok) {
              let result = req.body.result;
              if(result.code) {
              	//console.log(result.result);
                this.inventory.serialDate = result.result[2][0].inventoryTime;
                this.inventory.serialDesc = result.result[2][0].remark;
                this.inventory.totalMoney = result.result[2][0].totalMoney;
                //更新审核表信息
                bus.$emit('update-review-message', Object.assign({}, result.result[1][0]));
                //更新盘点单商品表格信息
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
      //审核盘点单
      reviewInventoryList(){
        let len = this.tableData.length;
        let inventoryCommodityData = [];
        for(let i = 0;i< len;i++){
          inventoryCommodityData.push({
            commodityId : this.tableData[i].commodityId,
            num : this.tableData[i].num -  this.tableData[i].FactStoreNum
          });
        }
        this.$http.put('/api/inventory/updateInventoryByReview', {
          commodities : inventoryCommodityData,
          reviewId : this.reviewId
        }, {}).then((req) =>{
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              //跳转管理页面
              this.$router.push({name : 'inventoryManage'});
            }else{
              this.$message.error(result.msg);
            }
          }
        },() => {
        	this.$message.error('连接服务器失败');
        });
      },
      onResultChange(val) {
        this.inventory.totalMoney = val;
      },
      //返回
      goBackFun() {
        this.$router.go(-1);
      },
      //清空盘点单全部信息
      clearInventorySelection() {
      	this.tableData = [];
      },
      //保存一张盘点单
      saveInventoryList() {
      	let len = this.tableData.length;
      	if(len === 0) {
          this.$message.info('添加盘点商品数据再进行制单');
        }else{
          let info = {
            serial : this.inventory, //盘点单附加信息
            commodityList : [],//商品信息集合
          };
          for(let i = 0;i < len;i ++) {
            let commodity = {
              commodityId : this.tableData[i].commodityId,
              storeNum : this.tableData[i].FactStoreNum,
              inventoryNum : this.tableData[i].num
            };
            info.commodityList.push(commodity);
          }

          this.$http.post('/api/inventory/saveInventory', info, {}).then((req) => {
            if(req.ok) {
              let result = req.body.result;
              if(result.code) {
                this.$message.success(result.msg);
                //清空单据信息
                this.createNewInventoryList(false);
              }else{
                this.$message.error(result.msg);
              }
            }
          }, () => {
          	this.$message.error('连接服务器失败');
          });
        }
      },
      //新单
      createNewInventoryList (state) {
        Object.assign(this.$data, this.$options.data());
        if(state) {
          this.$message.success('创建新盘点单成功');
        }
      }
    },
    components : {
      reviewForm, inventoryFormTable
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
</style>
