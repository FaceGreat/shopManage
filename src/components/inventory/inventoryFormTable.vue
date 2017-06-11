<template>
  <div class="purchaseFormTable">
    <common-dialog :visible="visible"></common-dialog>
    <el-row>
      <el-col :span="24">
        <el-button type="success" class="table-btn" @click="openFindCommodity(1)" v-show="showBtn">增加盘点商品</el-button>
        <el-button type="warning" class="table-btn" @click="clearInventorySelectionByChecked" v-show="showBtn">清除选中盘点商品</el-button>
        <el-button type="danger" class="table-btn" @click="clearInventorySelection" v-show="showBtn">清空盘点商品</el-button>
      </el-col>
      <el-col :span="24">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChangeByChecked">
          <el-table-column
            prop="retailPrice"
            label="单价">
          </el-table-column>
          <el-table-column
            prop="FactStoreNum"
            label="库存数量"
            width="120">
          </el-table-column>
          <el-table-column
            inline-template
            label="实际数量"
            width="150">
            <el-input-number
              class="input-number"
              v-model="row.num"
              :min="0"
              :max="row.FactStoreNum"
              size="small"
              v-if="showBtn">
            </el-input-number>
            <span v-else>{{ row.num }}</span>
          </el-table-column>
          <el-table-column
            label="盈亏数量"
            inline-template
            width="120">
            <span>{{ row.num -  row.FactStoreNum }}</span>
          </el-table-column>
          <el-table-column
            inline-template
            label="盈亏金额"
            width="120">
            <span>{{ ( row.num -  row.FactStoreNum) * row.costPrice | currency}}</span>
          </el-table-column>
          <provide-manage></provide-manage>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import provideManage from 'components/purchase/provideSelectDialog'
  import categorySelect from 'components/commodity/categorySelect'
  import commonDialog from 'components/childComponents/commonDialog'


  import commonMixin from 'mixin/commonMixin'
  import commodityMixin from 'mixin/commodity'

  import bus from 'components/common/js/bus'
  export default {
    name: 'inventoryFormTable',
    mixins : [commonMixin, commodityMixin],
    props :['tableData', 'showBtn'],
    data() {
      return {
        visible :{},
        multipleSelectedMaterialsByChecked : [],
      }
    },
    created() {
      this.initVisible();

      bus.$on('init-inventory-form-table', ()=> {
        Object.assign(this.$data, this.$options.data());
      });

    },
    computed : {
    	//总金额
      totalMoney : function(){
        let len = this.tableData.length;
        let sum = 0;
        for(let i = 0;i< len;i++) {
          sum += (this.tableData[i].num -  this.tableData[i].FactStoreNum)* this.tableData[i].costPrice;
        }
        this.$emit("on-result-change",sum);
      }
    },
    components : {
      provideManage, categorySelect, commonDialog
    },
    methods : {
     //清除表格中所有内容
      clearInventorySelection() {
        this.$emit('clearSelection');
        this.$emit("on-result-change",0);
      },
      //清空表格中选中的内容
      clearInventorySelectionByChecked() {
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
