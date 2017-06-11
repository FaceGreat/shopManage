<template>
    <div>
      <v-bar-title vBarTitle="添加供应商信息"></v-bar-title>
      <el-card>
        <router-link tag="button" to="/home/provideManage" class="el-button el-button--success">管理供应商信息</router-link>
        <!--<el-button type="success" @click="goProvide"></el-button>-->
        <h3 class="content-title">供应商信息</h3>
        <p class="content-hr"></p>
        <el-form ref="form" label-width="120px" class="form" :model="provide">
          <el-form-item label="供应商名称">
            <el-input type="text"  placeholder="填写供应商名称" v-model="provide.name" class="element"></el-input>
          </el-form-item>
          <el-form-item label="选择供货类别" >
            <el-select v-model="provide.categoryId" placeholder="请选择" class="element">
              <el-option
                v-for="item in options"
                :key="item.categoryId"
                :label="item.name"
                :value="item.categoryId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商状态" >
            <el-radio-group v-model="provide.Status">
              <el-radio :label="1">可用</el-radio>
              <el-radio :label="-1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="供应商联系人">
            <el-input type="text"  placeholder="填写供应商联系人" v-model="provide.contactPerson" class="element"></el-input>
          </el-form-item>
          <el-form-item label="供应商联系电话">
            <el-input type="text"  placeholder="填写供应商联系电话" v-model="provide.contactPhone" class="element"></el-input>
          </el-form-item>
          <el-form-item label="供应商联系地址">
            <el-input type="text"  placeholder="填写供应商联系地址" v-model="provide.contactAddress" class="element"></el-input>
          </el-form-item>
          <el-form-item label="供应商联系邮箱">
            <el-input type="text"  placeholder="填写供应商联系邮箱" v-model="provide.contactEmail" class="element"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="provide.remark" class="element" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" class="element" @click="addProvide" v-show="showBtn">添&nbsp;&nbsp;加</el-button>
            <el-button type="warning" class="element" @click="updateProvide" v-show="!showBtn">修&nbsp;&nbsp;改</el-button>
          </el-form-item>
        </el-form>

      </el-card>

    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle.vue'
	export default {
		name: '',
    data () {
			this.findAllSort();
			return {
        showBtn : this.initShowBtn(),
        provide : this.initProvide(),
        options : []
      }
    },
    components: {
      vBarTitle
    },
    methods : {
			//初始化供货商信息
      initProvide (){
      	if(this.$route.params.provide){
          return this.$route.params.provide;
        }else{
          return {
            provideId : '', //供货商编号(后台自动生成24位id)
            name : '',//供货商名称
            contactPerson : '', //供货商联系人
            contactPhone : '',//供货商联系电话
            contactAddress : '',//供货商联系地址
            contactEmail : '', //供货商联系邮箱
            categoryId  : '', //供货商类别
            Status: 1,//供货商状态
            remark : '',//供货商信息备注
          }
        }
      },
      //初始化按钮
      initShowBtn() {
        if(this.$route.params.provide){
          return false;
        }else{
        	return true;
        }
      },
      //获取所有供货商信息
      findAllSort () {
        this.$http.get('/api/commodity/findAllSort', {}).then((req)=>{
          if(req.ok){
            let result = req.body.result;
            if(result.code) {
              this.options = result.result;
            }else{
              console.log(result.code);
            }
          }else{
            this.$message.error('连接服务器失败');
          }
        })
      },
      //添加一个供应商信息
      addProvide () {
      	this.$http.post('/api/user/provide/addProvide', this.provide, {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
            if(result.code){
              this.$message.success(result.msg);
              //返回管理页面
              this.$router.push({name : 'provideManage'});
            }else{
            	this.$message.error(result.msg);
            }
          }else{
          	this.$message.error('连接服务器失败');
          }
        });
      },
      //更新供应商信息
      updateProvide() {
        this.$http.put('/api/user/provide/updateProvideById', this.provide,{}).then((req) => {
        	if(req.ok) {
        		let result = req.body.result;
        		if(result.code){
              this.$message.success(result.msg);
              //返回管理页面
              this.$router.push({name : 'provideManage'});
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
