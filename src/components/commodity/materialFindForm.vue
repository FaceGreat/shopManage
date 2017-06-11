<template>
    <div>
      <div class="findContent">

      </div>
      <br/>
      <el-row>
        <el-col :span="5">
          <div class="findContent">
            <router-link tag="button" :to="{ name:'addMaterialMessage' }" class="el-button el-button--success">添加新商品资料</router-link>
            <br/>
            <div class="label">
              高级查询
              <span class="fa fa-hand-o-right fa-1x"></span>
            </div>
          </div>
        </el-col>
        <el-col :span="19" class="findFormContent">
          <el-form :model="propsModel" label-width="84px">
            <el-col :span="7">
              <el-form-item label="快速查询：" class="item">
                <el-input v-model="propsModel.content" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13" class="item">
              <el-form-item label="库存限制：">
                <el-radio-group v-model="propsModel.quantityLimit">
                  <el-radio :label="-1" class="form-radio">低于库存下限</el-radio>
                  <el-radio :label="1">高于库存上限</el-radio>
                  <el-radio :label="0">无限制</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="fuzzyQuery" class="form-btn">查询</el-button>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import bus from 'components/common/js/bus';
	export default {
		name: '',
    props : ['propsModel'],
    data () {
			return {
      }
    },
    methods : {
      fuzzyQuery() {
        bus.$emit('findMaterialByPage');
      }
    }
	}
</script>

<style scoped>
  .findContent{
      text-align: center;
      padding-top: 6px;
    }
  .findFormContent{
    border: 1px solid #d1d1d1;
    padding-top: 20px;
  }
  .form-radio{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .form-btn{
    width:100%;
  }
  .label{
    color: #000;
    margin-top: 8px;
  }
  .item{
    margin-left: 10px;
  }
</style>
