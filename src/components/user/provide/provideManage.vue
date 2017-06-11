<template>
    <div>
      <v-bar-title vBarTitle="供应商资料管理"></v-bar-title>
      <el-card>
          <category-select labelText="选择供应商类别" :selectModel="categoryId" @on-result-change="onResultChange" class="card-select"></category-select>
          <router-link tag="button" :to="{ name:'addProvide' }" class="el-button el-button--success">添加新供应商</router-link>
          <provide-table></provide-table>

      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import categorySelect from 'components/commodity/categorySelect'
  import provideTable from 'components/user/provide/provideTable'

  import bus from 'components/common/js/bus';

	export default {
		name: '',
    data() {
			return {
        categoryId : '',
      }
    },
    components : {
      vBarTitle, categorySelect,provideTable
    },
    methods  : {
      //下拉值改变时改变表格内容
      onResultChange(val) {
      	this.categoryId = val === '' ? 0 : val;
        bus.$emit('findProvideByPage', this.categoryId);
      }
    }
	}
</script>

<style scoped>
  .card-select,
  .card-btn{
   float: left;
    margin-right: 20px;
  }
</style>
