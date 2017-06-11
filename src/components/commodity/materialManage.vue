<template>
    <div class="materialManage">
      <v-bar-title vBarTitle="商品资料管理"></v-bar-title>
      <el-card class="box-card">
        <el-row>
          <el-col :span="24" class="form-card">
            <div class="grid-content bg-purple">
              <material-find-form :propsModel="findModel"></material-find-form>
            </div>
          </el-col>
          <el-col :span="24" class="form-card">
            <div class="grid-content bg-purple-light">
              <category-select labelText="选择商品类别" :selectModel="findModel.categoryId" @on-result-change="onResultChange" ></category-select>
              <material-table
                :tableData="tableData"></material-table>
              <common-pagination
                :pageModule="pageModule"></common-pagination>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import materialTable from 'components/commodity/materialTable'
  import commonPagination from 'components/common/commonPagination'
  import materialFindForm from 'components/commodity/materialFindForm'
  import categorySelect from 'components/commodity/categorySelect'

  import paginationMixin from 'mixin/paginationMixin'
  import bus from 'components/common/js/bus';
  export default {
		name: 'materialManage',
    mixins : [paginationMixin],
    data() {
			return {
        findModel :{
          content : '',
          quantityLimit : 0,
          categoryId :  ''
        },
        tableData : []
      }
    },
    created() {
      this.initPageModule();
			this.findMaterialByPage();
      bus.$on('findMaterialByPage', ()=> {
        this.findMaterialByPage();
      });
      this.updatePageModule({
        callback : this.findMaterialByPage
      });
    },
    components : {
      vBarTitle, materialTable,commonPagination, materialFindForm, categorySelect
    },
    methods : {
      //下拉值改变时改变表格内容
      onResultChange(val) {
        this.findModel.categoryId = val;
        this.findMaterialByPage();
      },
      findMaterialByPage () {
        this.$http.get('/api/commodity/findCommodityByPage', {
        	params : {
            findModel : JSON.stringify(this.findModel),
            pageModel : JSON.stringify({
              page : this.pageModule.page, // 每页显示数据条数
              currentPage : this.pageModule.currentPage, //当前页
            })
          }
        },{}).then((req)=> {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.tableData = result.result[0];
              this.pageModule.total =result.result[1][0].count;
            }else{
              this.$message.error(result.msg);
            }
          }
        },() => {
          this.$message.error('连接服务器失败');
        });
      },
    }
	}
</script>

<style scoped>
  .form-card{
    border: 1px solid #d1d1d1;
    padding: 10px 20px 20px 10px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
</style>
