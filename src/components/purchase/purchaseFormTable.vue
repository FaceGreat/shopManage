<template>
  <div class="purchaseFormTable">
    <common-dialog :visible="visible"></common-dialog>
    <el-row>
      <el-col :span="24">
        <el-button type="success" class="table-btn" @click="openFindCommodity(1)" v-show="showBtn">增加进货商品</el-button>
        <el-button type="warning" class="table-btn" @click="clearPurchaseSelectionByChecked"  v-show="showBtn">清空选中商品</el-button>
        <el-button type="danger" class="table-btn" @click="clearPurchaseSelection"  v-show="showBtn">清空进货商品</el-button>
      </el-col>
      <el-col :span="24">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChangeByChecked">
          <el-table-column
            prop="costPrice"
            label="进货价">
          </el-table-column>
          <el-table-column
            inline-template
            label="数量"
            width="150">
            <el-input-number
                class="input-number"
                v-model="row.num"
                :min="1"
                :max="row.limitNum"
                size="small"
              v-if="showBtn">
            </el-input-number>
            <span v-else>{{ row.num }}</span>
          </el-table-column>
          <el-table-column
          inline-template
          label="金额"
          width="123">
            <span>{{  row.num * row.costPrice | currency }}</span>
          </el-table-column>
          <provide-manage></provide-manage>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import provideManage from 'components/purchase/provideSelectDialog.vue'
  import categorySelect from 'components/commodity/categorySelect.vue'
  import commonDialog from 'components/childComponents/commonDialog'


  import commonMixin from 'mixin/commonMixin'
  import commodityMixin from 'mixin/commodity'


  import bus from 'components/common/js/bus'
	export default {
		name: 'purchaseFormTable',
    mixins : [commonMixin, commodityMixin],
    props : ['tableData', 'showBtn'],
    data() {
			return {
        visible :{},
        multipleSelectedMaterialsByChecked : []
      }
    },
    computed : {
			//计算总价
      totalMoney : function(){
      	let len = this.tableData.length;
      	let sum = 0;
      	for(let i = 0;i< len;i++) {
          sum += this.tableData[i].num * this.tableData[i].costPrice;
        }
        this.$emit("on-result-change",sum);
      }
    },
    components : {
      provideManage, categorySelect, commonDialog
    },
    created(){
      /*this.getSelectMaterialList(0);*/
      this.initVisible();
      //初始化进货单数据
      bus.$on('init-purchase-form-table', ()=> {
       /* this.getSelectMaterialList(0);*/
        Object.assign(this.$data, this.$options.data());
      });
      /*//获取指定的进货单
			bus.$on('get-purchase-commodityData', () => {
        let len = this.tableData.length;
        let purchaseCommodityData = [];
        for(let i = 0;i< len;i++){
        	purchaseCommodityData.push({
            commodityId : this.tableData[i].commodityId,
            num : this.tableData[i].num
          });
        }
        this.$emit('update-purchase-commodityData',purchaseCommodityData);
      });*/
			/*//商品添加到进货单
			bus.$on('set-purchase-commodityData',(val) => {
        this.tableData = val;
      });*/

    },
    methods : {
      //清除表格中所有内容
      clearPurchaseSelection() {
      	//设置清单表格中数据为空
        /*this.tableData = [];*/
        this.$emit('clearSelection');
        this.$emit("on-result-change",0);
      },
      //清空表格中选中的内容
      clearPurchaseSelectionByChecked() {
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

    },
	}
</script>



<style scoped>
  .table-btn{
    margin-bottom: 10px;
  }
  .input-number{
    margin: 0 -10px -6px -6px;
  }
</style>
