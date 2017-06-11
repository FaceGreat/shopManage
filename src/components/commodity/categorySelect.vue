<template>
  <div class="form-select">
    <label>{{ labelText }}：</label>
    <el-select v-model="selectData" clearable placeholder="请选择" style="width: 150px;">
      <el-option
        v-for="item in options"
        :key="item.categoryId"
        :label="item.name"
        :value="item.categoryId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
	export default {
		name: '',
    props : ['labelText', 'selectModel'],
    data () {
			this.findAllSort();
			return {
        options : [],
        selectData : '',
        updateData : true
      }
    },
    watch : {
      selectModel(val) {
      	//判断是组件内部改变值or外部组件改变值
      	if(val === 0) {
      		this.updateData = false;
          this.selectData = ''
        }else{
          this.selectData = val
        }
      },
			//监听选中的值
      selectData(val) {
      	//updateData属性存储是内部或外部改变了值
      	if(this.updateData) {
          this.$emit("on-result-change",val);
        }else{
          this.updateData = true;
        }
      }
    },
    methods: {
      //获取所有的类型
      findAllSort () {
        this.$http.get('/api/commodity/findAllSort', {}).then((req) => {
          if (req.ok) {
            let result = req.body.result;
            if (result.code) {
              this.options = result.result;
            } else {
              console.log(result.code);
            }
          } else {
            this.$message.error('连接服务器失败');
          }
        })
      },
    }
	}
</script>

<style scoped>
  .form-select{
    margin-bottom: 20px;
  }
</style>
