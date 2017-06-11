<template>
    <div class="materialMessageForm">
      <v-bar-title vBarTitle="商品资料信息"></v-bar-title>
      <el-card>
        <h3 class="content-title">商品资料信息</h3>
        <p class="content-hr"></p>
        <el-form ref="form" label-width="180px" class="form" :model="material">
          <el-form-item label="商品名称">
            <el-input type="text"  placeholder="填写商品名称" v-model="material.name" class="element"></el-input>
          </el-form-item>
          <el-form-item label="选择商品类别" >
            <el-select v-model="material.categoryId" placeholder="请选择" class="element">
              <el-option
                v-for="item in categoryOptions"
                :key="item.categoryId"
                :label="item.name"
                :value="item.categoryId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品供应商">
            <el-select v-model="material.provideId" placeholder="请选择" class="element">
              <el-option
                v-for="item in provideOptions"
                :key="item.provideId"
                :label="item.name"
                :value="item.provideId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品状态" >
            <el-radio-group v-model="material.Status">
              <el-radio :label="1">可用</el-radio>
              <el-radio :label="-1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品单位">
            <el-select v-model="material.unitId" placeholder="请选择" class="element">
              <el-option
                v-for="item in unitOptions"
                :key="item.unitId"
                :label="item.name"
                :value="item.unitId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品规格" class="element">
            <el-input type="text"  placeholder="填写商品规格" v-model="material.format" class="element"></el-input>
          </el-form-item>
          <el-form-item label="商品零售价" class="element">
            <el-input type="text"  placeholder="填写商品零售价" v-model="material.retailPrice" class="element"></el-input>
          </el-form-item>
          <el-form-item label="商品成本价" class="element">
            <el-input type="text"  placeholder="填写商品成本价" v-model="material.costPrice" class="element"></el-input>
          </el-form-item>
          <el-form-item label="商品库存数量上限" class="element">
            <el-input type="text"  placeholder="商品库存数量上限" v-model="material.quantityUpperLimit" class="element"></el-input>
          </el-form-item>
          <el-form-item label="商品库存数量下限" class="element">
            <el-input type="text"  placeholder="商品库存数量下限" v-model="material.quantityLowerLimit" class="element"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="material.remark" class="element" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" class="element" @click="addMaterial" v-show="showBtn">添&nbsp;&nbsp;加</el-button>
            <el-button type="warning" class="element" @click="updateMaterial" v-show="!showBtn">修&nbsp;&nbsp;改</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle.vue'
	export default {
		name: 'materialMessageForm',
    data() {
			return {
        showBtn : this.initShowBtn(),
        material : this.initMaterial(),
        categoryOptions : this.getCategoryOptions(),
        unitOptions : this.getUnitOptions(),
        provideOptions : this.getProvideOptions()
      }
    },
    components : {
      vBarTitle
    },
    methods : {
			//初始化商品信息
			initMaterial() {
        if(this.$route.params.material){
          return this.$route.params.material;
        }else{
          return  {
            commodityId : '', //商品资料编号（后台自动生成8位商品资料id）
            categoryId : '',//商品分类
            barcode : '',//商品条码(后台自动生成10位)
            name : '',//商品名称
            format : '',//商品规格
            unitId : '',//商品单位
            retailPrice : '',//零售价
            costPrice : '',//成本价
            quantityUpperLimit : '',//库存上限数量
            quantityLowerLimit : '',//库存下限数量
            createDate : '',//商品创建时间
            provideId : '',//商品供应商
            Status : 1,//商品状态
            remark : ''//商品备注
          }
        }
      },
      //初始化按钮
      initShowBtn() {
        return this.$route.params.material ? false : true;
      },
      //添加商品信息
      addMaterial() {
        this.$http.post('/api/commodity/addCommodity', this.material,{}).then((req) => {
        	if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              //跳转管理页面
              this.$router.push({name : 'materialManage'});
            }else{
            	this.$message.error(result.msg);
            }
          }else{
        		this.$message.error('连接服务器失败');
          }
        });
      },
      //更新商品资料信息
      updateMaterial() {
        this.$http.put('/api/commodity/updateCommodityById', this.material, {}).then((req) => {
        	if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.$message.success(result.msg);
              this.$router.push({name : 'materialManage'});
            }else{
            	this.$message.error(result.msg);
            }
          }else{
        		this.$message.error('连接服务器失败');
          }
        });
      },
      //获取指定下拉数据
      getCategoryOptions() {
				return this.$http.get('/api/commodity/findAllSort').then((req) => {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.categoryOptions = result.result;
            }else{
              this.$message.error(result.msg);
            }
          }else{
            this.$message.error('连接服务器失败');
          }
        });
      },
      getProvideOptions () {
				return this.$http.get('/api/user/provide/getProvideBySelect').then((req) => {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.provideOptions = result.result;
            }else{
              this.$message.error(result.msg);
            }
          }else{
            this.$message.error('连接服务器失败');
          }
        });
      },
      getUnitOptions () {
        return this.$http.get('/api/commodity/findAllUnit').then((req) => {
          if(req.ok) {
            let result = req.body.result;
            if(result.code) {
              this.unitOptions = result.result;
            }else{
            	this.$message.error(result.msg);
            }
          }else{
          	this.$message.error('连接服务器失败');
          }
        });
      }
    }
	}
</script>

<style scoped>
  .form{
    margin-top: 20px;
    margin-left: 30px;
  }
  .element{
    width:350px;
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
