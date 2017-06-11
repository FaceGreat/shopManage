<script src="../../../server/api/bill.js"></script>
<template>
    <div class="cashRegister">
      <v-bar-title vBarTitle="前台收银"></v-bar-title>
      <el-card>
        <el-row>
          <el-col :span="24">
            <el-button v-show="!showBtn" @click="goBackFun">返回</el-button>
            <sales-member
              :member="member"
              @init-member="initMemberByCash"
              @update-member="updateMemberByCash"
              @update-sales-cashier="updateSalesCashier"
              :showBtn="showBtn"
              :cashier="cashier"></sales-member>
          </el-col>
          <el-col :span="24">
            <el-button v-show="showBtn" @click="openFindCommodity(1)">查找商品</el-button>
            <el-button v-show="showBtn" @click="openAddNewMember">添加新会员</el-button>
            <el-button v-show="showBtn" @click="openFindBillMember">查找清单会员</el-button>
            <el-button v-show="showBtn" @click="clearBillMember">清除清单会员</el-button>
            <el-button v-show="showBtn" @click="openEntryCashier">修改收银员</el-button>
            <el-button v-show="showBtn" @click="clearSalesSelectionByChecked">取消指定商品</el-button>
            <el-button v-show="showBtn" @click="clearSalesSelection">清空单据</el-button>
            <el-button v-show="showBtn" @click="balanceCommodity">结算单据</el-button>
            <common-dialog :visible="visible"></common-dialog>
          </el-col>
          <el-col :span="24">
            <h3 class="content-title">收银单</h3>
            <p class="content-hr"></p>
          </el-col>
          <el-col :span="24" class="tableModel">
            <el-table
              :data="tableData"
              @selection-change="handleSelectionChangeByChecked"
              style="width: 100%">
              <el-table-column
                inline-template
                label="零售价"
                width="100">
                <span>{{ row.retailPrice | currency}}</span>
              </el-table-column>
              <el-table-column
                inline-template
                label="折扣"
                width="94">
                <span>{{ member.discount || 1}}</span>
              </el-table-column>
              <el-table-column
                inline-template
                label="实售价"
                width="94">
                <span>{{ (member.discount || 1) * row.retailPrice | currency }}</span>
              </el-table-column>
              <el-table-column
                inline-template
                fixed="right"
                label="数量"
                width="150">
                <el-input-number
                  class="input-number"
                  v-model="row.num"
                  :min="1"
                  :disabled="!showBtn"
                  size="small">
                </el-input-number>
              </el-table-column>
              <el-table-column
                inline-template
                fixed="right"
                label="金额"
                width="123">
                <span>{{  row.num * row.retailPrice * (member.discount || 1) | currency }}</span>
              </el-table-column>
              <provide-manage></provide-manage>
            </el-table>
          </el-col>
          <el-col :span="24" class="totalModel">
            <el-col :span="12" v-show="showBtn" >
              <label>结算商品：</label>
              <el-input v-model="commodityKey"  placeholder="商品编号 / 条形码" style="width:240px;" @keyup.enter.native="findCommodityByCash"></el-input>
              <el-button @click="findCommodityByCash">回车结算</el-button>
            </el-col>
            <el-col :span="12" class="spanModel">
              <el-col :span="16">
                <span >合计金额：{{ totalMoney | currency }}</span>
              </el-col>
              <el-col :span="8">
                <span >合计数量：{{ totalNum }} </span>
              </el-col>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle.vue'
  import salesMember from 'components/sales/salesMember.vue'
  import provideManage from 'components/purchase/provideSelectDialog.vue'
  import commonDialog from 'components/childComponents/commonDialog'


  import member from 'mixin/member'
  import commonMixin from 'mixin/commonMixin'
  import commodityMixin from 'mixin/commodity'

  import bus from 'components/common/js/bus'

	export default {
		name: 'cashRegister',
    mixins : [member, commonMixin, commodityMixin],
    data() {
			return {
        visible :{},//模态框设置对象
        tableData : [],//收银清单数据
        options : [],//会员类型参数
        commodityKey : '',//商品号或商品标签
        member : {},//会员信息
        multipleSelectedMaterialsByChecked : [],//收银收据选中数据
        cashierId : '',//收银员Id
        formData : [],//查询后数据大于2时存储获取到的数据
        showBtn : true,
        cashier : {
        	cashierId : '', //收银员Id
          cashierName : '' //收银员姓名
        }
      }
    },
    watch : {
			$route(val) {
				if(val) {
          this.showBtn = true;
          this.routerInit();
        }
      }
    },
    computed : {
      //计算总价
      totalMoney : function(){
        let len = this.tableData.length;
        let sum = 0;
        for(let i = 0;i< len;i++) {
          sum += this.tableData[i].num * this.tableData[i].retailPrice * parseFloat(this.member.discount || 1);
        }
       return sum;
      },
      //总数
      totalNum  : function(){
        let len = this.tableData.length;
        let num = 0;
        for(let i = 0;i< len;i++) {
          num += parseInt(this.tableData[i].num);
        }
        return num;
      }
    },
    created () {
			this.routerInit();
    },
    methods : {
      updateSalesCashier(val) {
        this.cashier.cashierId = val.id;
        this.cashier.cashierName = val.name;
      },
      routerInit(){
        //初始化整个页面信息
        this.init();
        if(this.$route.params.billInfo) {
          let params = this.$route.params.billInfo;
          this.cashier.cashierName = params.billUserName;
          this.cashier.cashierId = params.billUserId;
          console.log(this.cashier);
          this.member = params.member;
          this.showBtn = false;
          this.findCommodityByBillId(params.billInfoId);
        }else{
        	this.tableData=[];
        }
      },
			//初始化收银台各项数据
			init() {
        this.initMember();
        this.getAllMemberDiscount();
        this.initVisible();
      },
      //通过收银单据号查询商品信息
      findCommodityByBillId(billInfoId) {
      	this.$http.get('/api/bill/findCommodityByBillId', {
      		params : {
      			billId : billInfoId
          }
        },{}).then((req) => {
      		if(req.ok) {
      			let result = req.body.result;
      			if(result.code) {
      				let len = result.result.length;
      				for(let i = 0;i<len;i++ ){
                result.result[i].num = 1;
              }
      				this.tableData = result.result;
            }else{
      				this.$message.error(result.msg);
            }
          }
        },() => {
          this.$message.error('连接服务器失败');
        });
      },
      //返回
      goBackFun() {
        this.$router.go(-1);
      },
      //添加会员信息
      addMemberManage(){
        this.addMember();
        this.closeVisible();
      },
      //清除表格中所有内容
      clearSalesSelection() {
        this.tableData = [];
        bus.$emit('clearSelection');
        this.$emit("on-result-change",0);
      },
      //清空表格中选中的内容
      clearSalesSelectionByChecked() {
        if(this.multipleSelectedMaterialsByChecked.length === 0 ) {
          this.$message.info('选择要取消的商品');
        }else{
          //清除指定商品信息
          this.clearSpecifyElement();
        }
      },
      //获取被选中的值的选中
      handleSelectionChangeByChecked(rows) {
        this.multipleSelectedMaterialsByChecked = rows;
      },
      //修改收银员
      openEntryCashier() {
        this.updateVisible({
          state : true,
          title : '收银员信息',
          callback: this.findCashier, //确定选择的回调函数
          name : 'selectCashier',//子组件名
          props: {
            cashierId : this.cashier.cashierId
          }//父组件传递子组件的指定参数
        })
      },
      //查找指定卡号的会员信息
      findCashier() {
        if(this.visible.props.cashierId === ''){
          this.$message.info('输入员工号进行查询');
        }else{
          this.$http.get('/api/user/employee/getEmployeeById', {
            params : {
              employeeId :　this.visible.props.cashierId
            }
          }, {}).then((req) => {
            if(req.ok) {
              let result = req.body.result;
              if(result.code)  {
                if(result.result.length === 0) {
                  this.$message.info('查询不到指定员工');
                }else{
                  this.closeVisible();
                  this.cashier.cashierName =  result.result[0].name;
                  this.cashier.cashierId =  result.result[0].employeeId;
                }
              }else{
                this.$message.error(result.msg);
              }
            }
          },()=>{
            this.$message.error('连接服务器失败');
          });
        }
      },
      //查找清单会员
      openFindBillMember() {
        this.updateVisible({
          state : true,
          title : '选择会员信息',
          callback: this.addBillMember, //确定选择的回调函数
          name : 'memberToBillTable',//子组件名
          props: {
            member : this.member
          }//父组件传递子组件的指定参数
        });
      },
      //清除清单会员信息
      clearBillMember() {
        this.initMember();
      },
      //查找指定商品号或条形码的商品信息
      findCommodityByCash() {
        if(this.commodityKey === '') {
        	this.$message.info('录入商品的商品号或条形码进行查询添加');
        }else{
        	this.$http.get('/api/commodity/findLikeCommodity', {
        		params :{
              commodityKey : this.commodityKey
            }
          },{}).then((req) => {
            if(req.ok){
            	let result = req.body.result;
            	if(result.code) {
            		let len = result.result.length;
            		switch (len) {
                  case 0 :
                  	this.$message.info('查询不到数据');
                  	break;
                  case 1 :
                  	let repeat = false;
                    for (let value of this.tableData) {
                      if(value.commodityId === result.result[0].commodityId) {
                        value.num++;
                        repeat = true;
                        break;
                      }
                    }
                    if(!repeat){
                      result.result[0].num = 1;
                      this.tableData.push(result.result[0]);
                    }
                    break;
                  default :
                    for (let value of  result.result) {
                      value.num = 1;
                    }
                  	this.formData = result.result;
                  	this.openFindCommodity(2);
                  	break;
                }
              }else{
            		this.$message.error(result.msg);
              }
            }
          },()=>{
        		this.$message.error('连接服务器失败');
          })
        }
      },
      //结算单据
      balanceCommodity() {
      	if(this.tableData.length === 0) {
      		this.$message.info('录入商品信息，再进行结算收据');
        }else{
      		let commodityList = [];
          for (let value of this.tableData) {
            commodityList.push({
              commodityId : value.commodityId,
              commodityNum : value.num
            });
          }
          //传递保存数据
          let bill = {
          	billInfo : commodityList,
            billList : {
              member : this.member,
              cashierId : this.cashier.cashierId,
              totalMoney : this.totalMoney,
              totalNum : this.totalNum,
              systemTime : new Date().toLocaleDateString()
            }
          };
          this.$http.post('/api/bill/saveBill', bill, {}).then((req) => {
            if(req.ok) {
            	let result = req.body.result;
            	if(result.code) {
            		this.$message.success(result.msg);
            		let cashier = Object.assign({}, this.cashier);
                Object.assign(this.$data, this.$options.data());
                this.init();
                this.cashier = cashier;
              }else{
            		this.$message.error(result.msg);
              }
            }
          },()=>{
          	this.$message.error('连接服务器失败');
          });
        }
      },
      //添加清单会员
      addBillMember() {
      	this.member = this.visible.props.member;
      	this.closeVisible();
      },
      //初始化员工信息
      initMemberByCash() {
      	this.member = {};
      },
      //更新会员信息
      updateMemberByCash(val) {
        this.member = val;
      }
    },
    components : {
      vBarTitle, salesMember, provideManage, commonDialog
    },
	}
</script>

<style scoped>
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
  .totalModel{
    margin-top: 20px;
  }
  .totalModel label{
    font-size: 14px;
    margin-left: 10px;
  }
  .tableModel{
    margin-top: 20px;
  }
  .spanModel{
    font-size: 16px;
    margin-top: 8px;
  }
  .spanModel span{
    margin-right: 100px;
  }
  .input-number{
    margin: 0 -10px -6px -6px;
  }
</style>
