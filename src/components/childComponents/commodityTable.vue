<template>
    <div>
      <el-row>
        <el-col :span="11">
          <category-select labelText="选择商品类别" :selectModel="propsModel.categoryId" @on-result-change="onResultChange" ></category-select>
        </el-col>
        <el-col :span="9">
          <el-form :model="propsModel" label-width="100px">
            <el-form-item label="快速查询：" class="item">
              <el-input v-model="propsModel.content"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <el-button style="width:100%; margin-left: 20px;" @click="getSelectMaterialList">查 询</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="selectData"
        @selection-change="handleSelectionChange"
        ref="multipleSelectedMaterials"
        style="width: 100%">
        <provide-manage></provide-manage>
      </el-table>
      <common-pagination
        :pageModule="pageModule"></common-pagination>
    </div>
</template>

<script>
  import provideManage from 'components/purchase/provideSelectDialog'
  import categorySelect from 'components/commodity/categorySelect'
  import commonPagination from 'components/common/commonPagination'

  import bus from 'components/common/js/bus'
  import paginationMixin from 'mixin/paginationMixin'
	export default {
		name: '',
    props : ['visible'],
    mixins: [paginationMixin],
    data() {
			return {
        selectData: [],//模态框商品资料
        propsModel : {
          content : '',
          categoryId: '',//模态框查询商品
        }
      }
    },
    watch:{
      'visible'(val){
        Object.assign(this.$data, this.$options.data());
        this.initPageModule();
        this.updatePageModule({
          callback : this.getSelectMaterialList
        });
        if(val.props.data.formData.length !== 0) {
          this.propsModel.content = val.props.data.commodityKey;
          this.selectData =  val.props.data.formData;
        }else{
          this.getSelectMaterialList();
        }
      }
    },
    created(){
      this.initPageModule();
      if(this.visible.props.data.formData.length!== 0) {
        this.propsModel.content = this.visible.props.data.commodityKey;
        this.selectData = this.visible.props.data.formData;
      }else{
        this.getSelectMaterialList();
      }
      //更新商品选择的数据
      bus.$on('update-commodity-select-table',() => {
        let result = this.visible.props.data;
        this.selectData = result.formData;
        this.propsModel.content = result.commodityKey;
      });
      this.updatePageModule({
        callback : this.getSelectMaterialList
      });
    },
    methods : {
      //下拉值改变时改变表格内容
      onResultChange(val) {
        this.propsModel.categoryId = val;
        this.getSelectMaterialList();
      },
      //获取商品资料
      getSelectMaterialList () {
        this.$http.get('/api/commodity/getSelectCommodityList',{
          params : {
            propsModel : JSON.stringify(this.propsModel),
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        },{}).then((req) => {
          if(req.ok) {
            let result =req.body.result;
            if(result.code) {
              let data = result.result[0];
              this.pageModule.total = result.result[1][0].count;
              for(let i = 0; i< data.length;i++) {
                data[i].num = 1;
              }
              this.selectData = data;
            }else{
              this.$message.error(result.msg);
            }
          }
        },()=> {
          this.$message.error('连接服务器失败');
        });
      },
      //获取选中商品数据
      handleSelectionChange (val) {
      	//Object.assign({}, val)
        this.visible.props.data.multipleSelectedMaterials = Array.from(val);
      },
    },
    components : {
      provideManage,categorySelect, commonPagination
    }
	}
</script>

<style scoped>
</style>
